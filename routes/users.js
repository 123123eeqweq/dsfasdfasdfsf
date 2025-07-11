import express from "express";
import User from "../models/User.js";
import UserBlack from "../models/UserBlack.js";
import axios from "axios";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

const mainBotToken = process.env.TELEGRAM_MAIN_BOT_TOKEN;
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const adminIds = process.env.ADMIN_IDS
  ? process.env.ADMIN_IDS.split(",").map((id) => id.trim())
  : [];

router.get("/:telegramId", async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({
      telegramId: user.telegramId,
      firstName: user.firstName,
      photoUrl: user.photoUrl,
      balance: user.balance,
      diamonds: user.diamonds,
      inventory: user.inventory,
      totalDeposits: user.totalDeposits,
      openedTopupCases: user.openedTopupCases,
      hasInitiatedFirstWithdrawal: user.hasInitiatedFirstWithdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

router.post("/add-balance", async (req, res) => {
  const { telegramId, amount, type = "stars", secret } = req.body;

  if (
    !telegramId ||
    !Number.isInteger(amount) ||
    amount <= 0 ||
    secret !== process.env.SECRET_KEY
  ) {
    return res.status(400).json({ message: "Некорректные данные" });
  }
  if (!["stars", "diamonds"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Тип должен быть stars или diamonds" });
  }

  try {
    const update =
      type === "diamonds"
        ? { diamonds: amount }
        : { balance: amount, totalDeposits: amount };
    const user = await User.findOneAndUpdate(
      { telegramId },
      { $inc: update },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({
      message: `Начислено ${amount} ${type} пользователю ${telegramId}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

router.post("/add-balance/remove", async (req, res) => {
  const { telegramId, amount, type = "stars", secret } = req.body;

  if (
    !telegramId ||
    !Number.isInteger(amount) ||
    amount <= 0 ||
    secret !== process.env.SECRET_KEY
  ) {
    return res.status(400).json({ message: "Некорректные данные" });
  }
  if (!["stars", "diamonds"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Тип должен быть stars или diamonds" });
  }

  try {
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const currentBalance = type === "diamonds" ? user.diamonds : user.balance;
    if (currentBalance < amount) {
      return res
        .status(400)
        .json({ message: `Недостаточно ${type} для снятия` });
    }

    const update =
      type === "diamonds" ? { diamonds: -amount } : { balance: -amount };
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      { $inc: update },
      { new: true }
    );

    res.json({
      message: `Снято ${amount} ${type} у пользователя ${telegramId}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

router.post("/ban", async (req, res) => {
  const { telegramId, secret } = req.body;

  if (!telegramId || secret !== process.env.SECRET_KEY) {
    return res.status(400).json({ message: "Некорректные данные" });
  }

  try {
    const user = await User.findOne({ telegramId: String(telegramId) });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const blacklistedUser = await UserBlack.findOne({
      telegramId: String(telegramId),
    });

    if (blacklistedUser) {
      return res
        .status(400)
        .json({ message: "Пользователь уже в черном списке" });
    }

    await UserBlack.create({ telegramId });

    user.inventory = [];
    user.balance = 0;
    user.diamonds = 0;
    user.totalDeposits = 0;
    user.save();

    res.json({
      message: `Пользователь ${telegramId} был забанен!`,
    });
  } catch (error) {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

router.post("/unban", async (req, res) => {
  const { telegramId, secret } = req.body;

  if (!telegramId || secret !== process.env.SECRET_KEY) {
    return res.status(400).json({ message: "Некорректные данные" });
  }

  try {
    const blacklistedUser = await UserBlack.findOne({
      telegramId: String(telegramId),
    });

    if (!blacklistedUser) {
      return res
        .status(400)
        .json({ message: "Пользователя нет в черном списке" });
    }

    await UserBlack.deleteOne({ telegramId });

    res.json({
      message: `Пользователь ${telegramId} был разбанен!`,
    });
  } catch (error) {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

router.post("/initiate-withdrawal/:telegramId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { telegramId: req.params.telegramId },
      { $set: { hasInitiatedFirstWithdrawal: true } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({
      message: "Первый вывод инициирован",
      hasInitiatedFirstWithdrawal: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

router.get("/withdraw/:telegramId/:giftId", async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const giftIndex = user.inventory.findIndex(
      (item) => item.giftId === req.params.giftId
    );
    if (giftIndex === -1) {
      return res.status(400).json({ message: "Подарок не найден в инвентаре" });
    }

    const gift = user.inventory[giftIndex];
    user.inventory.splice(giftIndex, 1);
    await user.save();

    try {
      await axios.post(
        `https://api.telegram.org/bot${mainBotToken}/sendMessage`,
        {
          chat_id: user.telegramId,
          text: `⚠️ Для получения вывода <b>обязательно отправьте любое сообщение</b> на этот аккаунт 👉 @tgrun_support23 даже если вы уже писали раньше!\nЭто нужно для технической фиксации вашего запроса в системе.\n\n‼️Без этого <b>вывод подарка невозможен технически</b>, поэтому просим <b>отправить хотя бы точку или любое слово</b>.\n\nБлагодарим за понимание!`,
          parse_mode: "HTML",
        }
      );
    } catch (error) {
      console.log(error);
      // Ошибка отправки уведомления не влияет на основной процесс
    }

    // Проверка переменных окружения
    if (!botToken || adminIds.length === 0) {
      // Логирование пропущено для продакшна, так как это не критично
    } else {
      const blacklistedUser = await UserBlack.findOne({
        telegramId: req.params.telegramId,
      });
      const alertMsg = !blacklistedUser
        ? ""
        : "⚠️ ВНИМАНИЕ! Пользователь в черном списке!\n\n";
      // Отправка уведомления админам
      const message =
        `${alertMsg}Пользователь вывел подарок:\n` +
        `👤 ID: <code>${req.params.telegramId}</code>\n` +
        `🎁 Подарок: ${gift.name} (${req.params.giftId})\n` +
        `💰 Стоимость: ${gift.price} звёзд\n` +
        `🔗 Ссылка: https://t.me/@id${req.params.telegramId}\n\n` +
        `📊 Информация о пользователе:\n` +
        `💸 Баланс: ${user.balance} звёзд\n` +
        `💎 Алмазы: ${user.diamonds}\n` +
        `🎒 Количество подарков в инвентаре: ${user.inventory.length}\n` +
        `📅 Дата регистрации: ${user.createdAt.toLocaleDateString("ru-RU")}\n` +
        `👨‍💼 Приглашён: ${
          user.invitedBy ? `<code>${user.invitedBy}</code>` : "Отсутствует"
        }\n` +
        `👥 Количество рефералов: ${user.referrals.length}\n` +
        `🎉 Реферальный бонус: ${user.referralBonus} звёзд\n` +
        `🏆 Награждённые рефералы: ${user.referralsAwarded.length}\n` +
        `💳 Сумма депозитов: ${user.totalDeposits} звёзд\n`;

      for (const adminId of adminIds) {
        try {
          await axios.post(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              chat_id: adminId,
              text: message,
              parse_mode: "HTML",
            }
          );
        } catch (error) {
          console.log(error);
          // Ошибка отправки уведомления не влияет на основной процесс
        }
      }
    }

    res.json({
      message: "Подарок выведен",
      inventory: user.inventory,
    });
  } catch (error) {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

router.get("/check-subscription/:telegramId", async (req, res) => {
  try {
    const { telegramId } = req.params;
    const channelId = -1002522126399; // ID канала, на который нужно подписаться

    if (!telegramId) {
      return res.status(400).json({ message: "Некорректные данные" });
    }

    const response = await axios.get(
      `https://api.telegram.org/bot${mainBotToken}/getChatMember`,
      {
        params: {
          chat_id: channelId,
          user_id: telegramId,
        },
      }
    );

    const status = response.data.result.status;
    const isSubscribed = ["member", "administrator", "creator"].includes(
      status
    );

    res.json({
      telegramId,
      channelId,
      isSubscribed,
    });
  } catch (error) {
    if (error.response?.data?.error_code === 400) {
      return res.status(400).json({
        message: "Пользователь не найден в чате или канал недоступен",
      });
    }
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

export default router;
