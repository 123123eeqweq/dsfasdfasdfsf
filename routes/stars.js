import express from "express";
import { Telegraf } from "telegraf";
import User from "../models/User.js";
import Deposit from "../models/Deposit.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Установка вебхука
const webhookUrl = "https://tgrun.xyz/api/stars/webhook"; // Замените на ваш URL


bot.telegram
  .setWebhook(webhookUrl)
  .then(() => {
    console.log(`Webhook установлен на ${webhookUrl}`);
  })
  .catch((error) => {
    console.error("Ошибка установки вебхука:", error);
  });

// Создание инвойса
router.post("/create-invoice", async (req, res) => {
  try {
    const { telegramId, starsAmount } = req.body;

    if (!telegramId || !starsAmount || starsAmount <= 0) {
      return res.status(400).json({ message: "Некорректные данные" });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Создаём инвойс через Bot API
    const invoiceLink = await bot.telegram.createInvoiceLink({
      title: "Пополнение звёзд",
      description: `Покупка ${starsAmount} Telegram Stars для рулетки`,
      payload: JSON.stringify({ telegramId, starsAmount }),
      provider_token: "", // Пустой для Telegram Stars
      currency: "XTR", // Код валюты для Telegram Stars
      prices: [{ label: "Звёзды", amount: starsAmount }],
    });

    res.json({ invoiceLink });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

// Вебхук для обработки транзакций Telegram Stars
router.post("/webhook", async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Обработка pre_checkout_query
bot.on("pre_checkout_query", async (ctx) => {
  try {
    await ctx.answerPreCheckoutQuery(true);
  } catch (error) {
    await ctx.answerPreCheckoutQuery(
      false,
      "Ошибка обработки. Попробуйте позже"
    );
  }
});

// Обработка успешной оплаты
bot.on("successful_payment", async (ctx) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { invoice_payload, telegram_payment_charge_id, total_amount } =
      ctx.update.message.successful_payment;
    const { telegramId, starsAmount } = JSON.parse(invoice_payload);

    const user = await User.findOne({ telegramId }).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return ctx.reply("Пользователь не найден");
    }

    const starsToAdd = Math.floor(starsAmount);
    user.balance += starsToAdd;
    user.totalDeposits += starsToAdd; // Добавляем к totalDeposits
    await user.save({ session });

    // Проверяем, достиг ли пользователь порога в 100 звезд и есть ли реферер
    if (user.totalDeposits >= 100 && user.invitedBy) {
      const referrer = await User.findOne({ telegramId: user.invitedBy });
      if (referrer && !referrer.referralsAwarded?.includes(telegramId)) {
        // Начисляем алмаз рефереру
        referrer.diamonds += 1;
        // Отмечаем, что за этого реферала уже начислен алмаз (чтобы избежать повторного начисления)
        referrer.referralsAwarded = referrer.referralsAwarded
          ? [...referrer.referralsAwarded, telegramId]
          : [telegramId];
        await referrer.save();
      }
    }

    const deposit = new Deposit({
      telegramId,
      amount: starsAmount,
      starsAdded: starsToAdd,
      currency: "STARS",
      transactionId: telegram_payment_charge_id,
    });
    await deposit.save({ session });

    await session.commitTransaction();
    session.endSession();

    await ctx.reply(
      `Начислено ${starsToAdd} звёзд за ${starsAmount} Telegram Stars`
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    await ctx.reply("Ошибка начисления. Обратитесь к администратору");
  }
});

export default router;
