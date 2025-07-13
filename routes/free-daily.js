import express from 'express';
import User from '../models/User.js';
import { checkSubscription } from '../utils/telegram.js';

const router = express.Router();

router.get('/status/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка подписки
    const { isSubscribed, error } = await checkSubscription(req.params.telegramId, process.env.TELEGRAM_CHANNEL_ID);
    if (error || !isSubscribed) {
      return res.status(403).json({ 
        isSubscribed: false, 
        message: 'Подпишитесь на наш канал, чтобы открыть бесплатный кейс!' 
      });
    }

    const now = new Date();
    const lastSpin = user.lastFreeDailySpin;
    const isAvailable = !lastSpin || (now - lastSpin) >= 24 * 60 * 60 * 1000;
    const timeLeft = isAvailable ? 0 : 24 * 60 * 60 * 1000 - (now - lastSpin);

    res.json({
      isSubscribed: true,
      isAvailable,
      timeLeft: Math.floor(timeLeft / 1000),
    });
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

export default router;