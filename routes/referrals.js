import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      referralLink: `https://t.me/tgrun_official_bot?startapp=ref_${telegramId}`,
      invitedCount: user.referrals.length,
      diamonds: user.diamonds,
    });
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

export default router;