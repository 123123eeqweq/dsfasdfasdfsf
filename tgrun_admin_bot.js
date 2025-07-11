import dotenv from "dotenv";
dotenv.config();
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

// Настройки
const token = process.env.TELEGRAM_BOT_TOKEN;
const adminIds = process.env.ADMIN_IDS.split(",").map((id) => id.trim());
const apiUrl = process.env.API_URL;
const secretKey = process.env.SECRET_KEY;

axios.defaults.headers.common["Authorization"] = `Bearer ${secretKey}`;

// Функции
const isAdmin = (chatId) => {
  const userId = chatId.toString();

  if (!adminIds.includes(userId)) {
    bot.sendMessage(chatId, "Доступ запрещен 🚫");
    return false;
  }

  return true;
};

// Создаём бота
const bot = new TelegramBot(token, { polling: true });

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (!isAdmin(chatId)) {
    return;
  }

  bot.sendMessage(
    chatId,
    "Привет, Админ! 👊 Я бот для управления игроком.\n\n➕ Добавить звезды: /add <user_id> <amount> [stars|diamonds]\n➖ Удалить звезды/алмазы: /remove <user_id> <amount> [stars|diamonds]\n❌ Забанить: /ban <user_id>\n✅ Разбанить: /unban <user_id>"
  );
});

// Обработка команды /add
bot.onText(/\/add (\d+) (\d+)(?: (stars|diamonds))?/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!isAdmin(chatId)) {
    return;
  }

  const telegramId = match[1];
  const amount = parseInt(match[2]);
  const type = match[3] || "stars";

  // Валидация
  if (amount <= 0) {
    return bot.sendMessage(chatId, "Сумма должна быть больше нуля! 😒");
  }

  try {
    // Отправляем запрос на бэкенд
    const response = await axios.post(`${apiUrl}/users/add-balance`, {
      telegramId,
      amount,
      type,
      secret: secretKey,
    });

    bot.sendMessage(
      chatId,
      `Начислено ${amount} ${type} юзеру ${telegramId}! 💫`
    );
  } catch (error) {
    if (error.response) {
      bot.sendMessage(chatId, `Ой, косяк: ${error.response.data.message} 😕`);
    } else {
      bot.sendMessage(chatId, "Сервак отвалился, пни админа! 😅");
    }
  }
});

// Обработка команды /remove
bot.onText(/\/remove (\d+) (\d+)(?: (stars|diamonds))?/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!isAdmin(chatId)) {
    return;
  }

  const telegramId = match[1];
  const amount = parseInt(match[2]);
  const type = match[3] || "stars";

  // Валидация
  if (amount <= 0) {
    return bot.sendMessage(chatId, "Сумма должна быть больше нуля! 😒");
  }

  try {
    // Отправляем запрос на бэкенд
    const response = await axios.post(`${apiUrl}/users/add-balance/remove`, {
      telegramId,
      amount,
      type,
      secret: secretKey,
    });

    bot.sendMessage(
      chatId,
      `Снято ${amount} ${type} у юзера ${telegramId}! 🗑️`
    );
  } catch (error) {
    if (error.response) {
      bot.sendMessage(chatId, `Ой, косяк: ${error.response.data.message} 😕`);
    } else {
      bot.sendMessage(chatId, "Сервак отвалился, пни админа! 😅");
    }
  }
});

// Обработка команды /ban
bot.onText(/\/ban (\d+)$/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!isAdmin(chatId)) {
    return;
  }

  const telegramId = match[1];

  try {
    // Отправляем запрос на бэкенд
    const response = await axios.post(`${apiUrl}/users/ban`, {
      telegramId,
      secret: secretKey,
    });

    bot.sendMessage(chatId, `Пользователь ${telegramId} был забанен! ❌`);
  } catch (error) {
    if (error.response) {
      bot.sendMessage(chatId, `Ой, косяк: ${error.response.data.message} 😕`);
    } else {
      bot.sendMessage(chatId, "Сервак отвалился, пни админа! 😅");
    }
  }
});

// Обработка команды /unban
bot.onText(/\/unban (\d+) ?/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!isAdmin(chatId)) {
    return;
  }

  const telegramId = match[1];

  try {
    // Отправляем запрос на бэкенд
    const response = await axios.post(`${apiUrl}/users/unban`, {
      telegramId,
      secret: secretKey,
    });

    bot.sendMessage(chatId, `Пользователь ${telegramId} был разбанен! ✅`);
  } catch (error) {
    if (error.response) {
      bot.sendMessage(chatId, `Ой, косяк: ${error.response.data.message} 😕`);
    } else {
      bot.sendMessage(chatId, "Сервак отвалился, пни админа! 😅");
    }
  }
});

// Обработка ошибок
bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});

console.log("Бот запущен! 🚀");
