import express from 'express';
import Case from '../models/Case.js';
import Gift from '../models/Gift.js';

const router = express.Router();

// Проверка авторизации
router.use((req, res, next) => {
  const telegramId = req.headers.authorization?.split(' ')[1]; // Ожидаем "Bearer <telegramId>"
  if (!telegramId) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }
  next();
});

// Эндпоинт для получения всех кейсов с подарками
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find();
    const casesWithGifts = await Promise.all(
      cases.map(async (caseItem) => {
        const items = await Promise.all(
          caseItem.items.map(async (item) => {
            const gift = await Gift.findOne({ giftId: item.giftId });
            return {
              giftId: item.giftId,
              probability: item.probability,
              name: gift ? gift.name : 'Unknown',
              image: gift ? gift.image : 'https://via.placeholder.com/40',
              price: gift ? gift.price : 0,
            };
          })
        );
        return {
          id: caseItem.caseId,
          name: caseItem.name,
          image: caseItem.image,
          price: caseItem.price,
          isTopup: caseItem.isTopup,
          items,
        };
      })
    );
    res.json(casesWithGifts);
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Эндпоинт для получения одного кейса
router.get('/:caseId', async (req, res) => {
  try {
    const caseItem = await Case.findOne({ caseId: req.params.caseId });
    if (!caseItem) {
      return res.status(404).json({ message: 'Кейс не найден' });
    }
    const items = await Promise.all(
      caseItem.items.map(async (item) => {
        const gift = await Gift.findOne({ giftId: item.giftId });
        return {
          giftId: item.giftId,
          probability: item.probability,
          name: gift ? gift.name : 'Unknown',
          image: gift ? gift.image : 'https://via.placeholder.com/40',
          price: gift ? gift.price : 0,
        };
      })
    );
    const caseWithGifts = {
      id: caseItem.caseId,
      name: caseItem.name,
      image: caseItem.image,
      price: caseItem.price,
      isTopup: caseItem.isTopup,
      items,
    };
    res.json(caseWithGifts);
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

export default router;