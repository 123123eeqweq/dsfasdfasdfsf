import express from 'express';
import LiveSpin from '../models/LiveSpin.js';
import Gift from '../models/Gift.js';

const router = express.Router();

// Эндпоинт для получения последних спинов
router.get('/', async (req, res) => {
  try {
    const spins = await LiveSpin.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Добавляем данные о подарке
    const spinsWithGifts = await Promise.all(
      spins.map(async (spin) => {
        const gift = await Gift.findOne({ giftId: spin.giftId }).lean();
        return {
          id: spin._id,
          giftId: spin.giftId,
          caseId: spin.caseId,
          createdAt: spin.createdAt,
          gift: gift ? {
            name: gift.name,
            image: gift.image,
            price: gift.price,
          } : null,
        };
      })
    );

    res.json(spinsWithGifts);
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

export default router;