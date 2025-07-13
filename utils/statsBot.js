
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Deposit from '../models/Deposit.js';
import LiveSpin from '../models/LiveSpin.js';

const bot = new TelegramBot(process.env.TELEGRAM_STATS_BOT_TOKEN, { polling: true });

const getStats = async () => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // 1. Общее количество пользователей
    const totalUsers = await User.countDocuments();

    // 2. Количество спинов за день (если есть LiveSpin)
    const spinsToday = await LiveSpin.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // 3. Общее количество депозитов
    const totalDeposits = await Deposit.countDocuments();

    // 4. Сумма депозитов за день
    const depositsToday = await Deposit.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' }, totalStars: { $sum: '$starsAdded' } } },
    ]);

    // 5. Общее количество рефералов
    const totalReferrals = await User.aggregate([
      { $group: { _id: null, total: { $sum: { $size: '$referrals' } } } },
    ]);

    // 6. Топ-5 пользователей по балансу
    const topUsers = await User.find()
      .sort({ balance: -1 })
      .limit(5)
      .select('firstName balance');

    // 7. Активность бесплатных кейсов за день
    const freeSpinsToday = await User.countDocuments({
      lastFreeDailySpin: { $gte: startOfDay, $lte: endOfDay },
    });

    // Формируем сообщение
    let message = `📊 Статистика на ${new Date().toLocaleDateString()}:\n\n`;
    message += `👥 Пользователей: ${totalUsers}\n`;
    message += `🎰 Спины за сегодня: ${spinsToday}\n`;
    message += `💸 Всего депозитов: ${totalDeposits}\n`;
    message += `💰 Депозиты за сегодня: ${depositsToday[0]?.totalAmount || 0} (звёзд: ${depositsToday[0]?.totalStars || 0})\n`;
    message += `🤝 Рефералов: ${totalReferrals[0]?.total || 0}\n`;
    message += `🎁 Бесплатные кейсы сегодня: ${freeSpinsToday}\n`;
    message += `\n🏆 Топ-5 пользователей по балансу:\n`;
    topUsers.forEach((user, index) => {
      message += `${index + 1}. ${user.firstName}: ${user.balance} ⭐\n`;
    });

    return message;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return 'Ошибка при получении статистики 😔';
  }
};

bot.onText(/\/stat/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const stats = await getStats();
    await bot.sendMessage(chatId, stats);
  } catch (error) {
    await bot.sendMessage(chatId, 'Ошибка при выполнении команды 😔');
  }
});

export const startStatsBot = () => {
  console.log('Stats bot started');
};