const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN2, { polling: false });

const checkSubscription = async (telegramId, chatId) => {
  try {
    const member = await bot.getChatMember(chatId, telegramId);
    const isSubscribed = ['member', 'administrator', 'creator'].includes(member.status);
    return { isSubscribed, error: null };
  } catch (error) {
    return { isSubscribed: false, error: error.message };
  }
};

module.exports = { checkSubscription };