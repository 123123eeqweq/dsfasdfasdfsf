import { Telegraf } from "telegraf";
import mongoose from "mongoose";
import UserBlack from "./models/UserBlack.js";
import axios from "axios";

const ADMINS_ID = [8041175810, 7088860263, 6930729575, 338804511, 7315177144, 7622553267]; // Список ID админов

// Токен бота
const botToken = "7991054805:AAE5_Ezi9srU9-Lz2vMEOjPDxXL6HjAcFKg";
const bot = new Telegraf(botToken);

// Подключаемся к MongoDB, база test
mongoose
  .connect(
    "mongodb+srv://usert54t4545:4haiSkksL9KRyH76@cluster0.jbcz2k2.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB подключен, братан! 😎"))
  .catch((err) => console.error("MongoDB не хочет дружить:", err));

// Схема и модель User, коллекция users
const userSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true },
    totalDeposits: { type: Number, default: 0 },
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);

// Команда /start
bot.start((ctx) => {
  if (!ADMINS_ID.includes(ctx.message.from.id)) {
    return ctx.reply("Доступ запрещен 🚫");
  }
  ctx.reply(
    "Привет! Пиши /check <telegramId>, чтобы узнать суму депозитов юзера."
  );
});

// Команда /check
bot.command("check", async (ctx) => {
  if (!ADMINS_ID.includes(ctx.message.from.id)) {
    return ctx.reply("Доступ запрещен 🚫");
  }

  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply("Ошибка комманды - /check <telegramId>");
  }

  const telegramId = args[1];

  try {
    const user = await User.findOne({ telegramId: telegramId }).lean();

    if (!user) {
      return ctx.reply(`Юзер с ID ${telegramId} не найден`);
    }
    const blacklistedUser = await UserBlack.findOne({
      telegramId: telegramId,
    });

    const alertMsg = !blacklistedUser
      ? ""
      : "⚠️ ВНИМАНИЕ! Пользователь в черном списке!\n\n";

    // Отправка уведомления админам
    const message =
      `${alertMsg}` +
      `📊 Информация о пользователе:\n` +
      `👤 ID: <code>${telegramId}</code>\n` +
      `🔗 Ссылка: https://t.me/@id${telegramId}\n` +
      `💸 Баланс: ${user.balance} звёзд\n` +
      `💎 Алмазы: ${user.diamonds}\n` +
      `🎒 Количество подарков в инвентаре: ${user.inventory?.length || 0}\n` +
      `📅 Дата регистрации: ${user.createdAt.toLocaleDateString("ru-RU")}\n` +
      `👨‍💼 Приглашён: ${
        user.invitedBy ? `<code>${user.invitedBy}</code>` : "Отсутствует"
      }\n` +
      `👥 Количество рефералов: ${user.referrals?.length || 0}\n` +
      `🎉 Реферальный бонус: ${user.referralBonus} звёзд\n` +
      `🏆 Награждённые рефералы: ${user.referralsAwarded?.length || 0}\n` +
      `💳 Сумма депозитов: ${user.totalDeposits} звёзд\n`;

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: ctx.message.from.id,
      text: message,
      parse_mode: "HTML",
    });
  } catch (err) {
    console.error(err);
    ctx.reply("Что-то пошло не так, попробуй позже. 😕");
  }
});

// Запускаем бота
bot
  .launch()
  .then(() => console.log("Бот в деле! 🚀"))
  .catch((err) => console.error("Бот не взлетел:", err));

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
