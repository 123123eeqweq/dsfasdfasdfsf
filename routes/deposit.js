import { TonClient, Address, fromNano, Cell } from "@ton/ton";
import express from "express";
import User from "../models/User.js";
import Deposit from "../models/Deposit.js";
import mongoose from "mongoose";
import axios from "axios";
import UserBlack from "../models/UserBlack.js";

const router = express.Router();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const adminIds = process.env.ADMIN_IDS
  ? process.env.ADMIN_IDS.split(",").map((id) => id.trim())
  : [];

async function sendWarningToAdmins(telegramId) {
  const message =
    `🚨🚨🚨 <b>Внимание!</b>\n\n` +
    `Пользователь с ID <code>${telegramId}</code> пытается подделать транзакции в TON. Выдан бан 🚫`;

  const blacklistedUser = await UserBlack.findOne({
    telegramId: String(telegramId),
  });

  if (!blacklistedUser) {
    UserBlack.create({ telegramId: String(telegramId) });
  }

  for (const adminId of adminIds) {
    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: adminId,
        text: message,
        parse_mode: "HTML",
      });
    } catch (error) {
      console.log(error);
      // Ошибка отправки уведомления не влияет на основной процесс
    }
  }
}

// Функция для получения транзакции по хэшу через Toncenter API
async function getTransactionByHash(address, hash) {
  try {
    const response = await axios.get(
      `https://toncenter.com/api/v2/getTransactions?address=${address.toString()}&hash=${hash}&limit=1`,
      {
        headers: {
          "X-API-Key":
            "81d2c78823637dd19947dfc560d5414c55a6ac6f62ede468120cfa39b80baeea",
        },
      }
    );
    const transactions = response.data.result;
    if (!transactions || transactions.length === 0) {
      throw new Error("Транзакция не найдена");
    }
    return transactions[0];
  } catch (error) {
    console.error("Ошибка получения транзакции из Toncenter:", error);
    throw error;
  }
}

router.post("/:telegramId", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { telegramId } = req.params;
    const { amount, currency, transactionId, result } = req.body;

    console.log(result);

    // Проверка входных данных
    if (!amount || amount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Некорректная сумма депозита" });
    }

    if (currency !== "TON") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Неподдерживаемая валюта" });
    }

    if (!transactionId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "transactionId отсутствует" });
    }

    // Проверка адреса кошелька
    const walletAddressStr = "UQD39Shoh1etFYqjVHau4d5pG5lZ3vg8AryiWkRcWudlhgj8";
    let walletAddress;
    try {
      walletAddress = Address.parse(walletAddressStr);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Некорректный адрес кошелька" });
    }

    const expectedAmount = amount * 1_000_000_000; // Сумма в нанотонах

    try {
      // Декодируем BOC и получаем хэш транзакции
      let transactionHash;
      try {
        const bocCell = Cell.fromBoc(Buffer.from(transactionId, "base64"))[0];
        console.log(bocCell);
        transactionHash = bocCell.hash().toString("hex");
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        sendWarningToAdmins(telegramId);
        return res.status(400).json({ message: "Некорректный формат BOC" });
      }

      if (!transactionHash) {
        await session.abortTransaction();
        session.endSession();
        sendWarningToAdmins(telegramId);
        return res
          .status(400)
          .json({ message: "Не удалось получить хэш транзакции" });
      }


      const transaction = await getTransactionByHash(
        walletAddress,
        transactionHash
      );


      if (!transaction) {
        await session.abortTransaction();
        session.endSession();
        sendWarningToAdmins(telegramId);
        return res.status(400).json({ message: "Транзакция не найдена" });
      }

      // Проверка валидности транзакции
      const isValid =
        transaction.in_msg && // Входящее сообщение существует
        transaction.in_msg.destination === walletAddress.toString() && // Адрес получателя совпадает
        parseInt(transaction.in_msg.value) >= expectedAmount && // Сумма совпадает или больше
        transaction.in_msg.source !== "" && // Источник не пустой
        transaction.transaction_id.hash === transactionHash; // Проверка соответствия хэша

      if (!isValid) {
        await session.abortTransaction();
        session.endSession();
        sendWarningToAdmins(telegramId);
        return res.status(400).json({ message: "Недействительная транзакция" });
      }

      // Проверка, что транзакция не использовалась ранее
      const existingDeposit = await Deposit.findOne({ transactionId }).session(
        session
      );
      if (existingDeposit) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Транзакция уже обработана" });
      }

      // Остальная логика (начисление звёзд, реферальная программа и т.д.)
      const user = await User.findOne({ telegramId }).session(session);
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const starsToAdd = Math.floor(amount * 100); // 1 TON = 100 звёзд
      user.balance += starsToAdd;
      user.totalDeposits += starsToAdd;
      await user.save({ session });

      if (user.totalDeposits >= 100 && user.invitedBy) {
        const referrer = await User.findOne({
          telegramId: user.invitedBy,
        }).session(session);
        if (referrer && !referrer.referralsAwarded?.includes(telegramId)) {
          referrer.diamonds += 1;
          referrer.referralsAwarded = referrer.referralsAwarded
            ? [...referrer.referralsAwarded, telegramId]
            : [telegramId];
          await referrer.save({ session });
        }
      }

      const deposit = new Deposit({
        telegramId,
        amount,
        starsAdded: starsToAdd,
        currency,
        transactionId,
      });
      await deposit.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.json({
        newBalance: user.balance,
        totalDeposits: user.totalDeposits,
        starsAdded: starsToAdd,
        message: `Начислено ${starsToAdd} звёзд за ${amount} ${currency}`,
      });
    } catch (error) {
      console.error("Ошибка проверки транзакции:", error);
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Ошибка проверки транзакции или BOC" });
    }
  } catch (error) {
    console.error("Внутренняя ошибка:", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

export default router;
