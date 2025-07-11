import express from 'express';
import Case from '../models/Case.js';
import User from '../models/User.js';
import LiveSpin from '../models/LiveSpin.js';
import cases from '../data/cases.js';

const router = express.Router();

router.post('/:caseId', async (req, res) => {
  try {
    const { telegramId, isDemo, isHunterCase } = req.body;
    const { caseId } = req.params;

    if (!telegramId) {
      return res.status(400).json({ message: 'Требуется идентификатор Telegram' });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const caseItem = cases.find(c => c.id === caseId);
    if (!caseItem || !caseItem.items || caseItem.items.length === 0) {
      return res.status(404).json({ message: 'Кейс не найден или пуст' });
    }

    // Проверка на демо-режим для Free Daily, реферальных и кейсов за депозиты
    if (isDemo && (caseId === 'case_13' || caseItem.isReferral || caseItem.isTopup)) {
      return res.status(403).json({ message: 'Демо-режим недоступен для этого кейса' });
    }

    // Проверка баланса (только для не-демо режима)
    if (!isDemo) {
      if (caseId === 'case_13') {
        const now = new Date();
        const lastSpin = user.lastFreeDailySpin;
        if (lastSpin && now - lastSpin < 24 * 60 * 60 * 1000) {
          const timeLeft = 24 * 60 * 60 * 1000 - (now - lastSpin);
          return res.status(403).json({
            message: `Бесплатный спин доступен через ${Math.floor(timeLeft / 3600000)}ч ${Math.floor((timeLeft % 3600000) / 60000)}м`,
          });
        }
      } else if (caseItem.isTopup) {
        const requiredDeposits = parseInt(caseItem.name.match(/\d+/)[0]);
        if (user.totalDeposits < requiredDeposits) {
          return res.status(403).json({
            message: `Недостаточно депозитов. Требуется ${requiredDeposits} звёзд, у вас ${user.totalDeposits}`,
          });
        }
        if (user.openedTopupCases.includes(caseId)) {
          return res.status(403).json({ message: 'Этот кейс уже открыт' });
        }
      } else if (caseItem.isReferral && caseItem.diamondPrice > 0) {
        if (user.diamonds < caseItem.diamondPrice) {
          return res.status(400).json({ message: `Недостаточно алмазов. Требуется ${caseItem.diamondPrice}, у вас ${user.diamonds}` });
        }
        user.diamonds -= caseItem.diamondPrice;
      } else if (caseItem.price > 0) {
        if (user.balance < caseItem.price) {
          return res.status(400).json({ message: `Недостаточно звёзд. Требуется ${caseItem.price}, у вас ${user.balance}` });
        }
        user.balance -= caseItem.price;
      }
    }

    let chosenGiftId = null;

    if (isHunterCase) {
      // Для хантер-кейсов всегда возвращаем gift_001
      chosenGiftId = 'gift_001';
    } else {
      // Обычная логика выбора подарка
      const rand = Math.random();
      let cumulativeProbability = 0;
      for (const item of caseItem.items) {
        // Пропускаем gift_037 (plushpepe)
        if (item.giftId === 'gift_037') continue;
        cumulativeProbability += item.probability;
        if (rand <= cumulativeProbability) {
          chosenGiftId = item.giftId;
          break;
        }
      }
      // Fallback: выбираем первый подарок с ненулевой вероятностью, кроме gift_037
      if (!chosenGiftId) {
        const validItems = caseItem.items.filter(item => item.probability > 0 && item.giftId !== 'gift_037');
        if (validItems.length === 0) {
          // Если нет валидных подарков, возвращаем gift_001
          chosenGiftId = 'gift_001';
        } else {
          chosenGiftId = validItems[0].giftId;
        }
      }
    }

    // Дополнительная защита: если случайно выбрался gift_037, заменяем на gift_001
    if (chosenGiftId === 'gift_037') {
      chosenGiftId = 'gift_001';
    }

    // Обновление пользователя (только для не-демо режима)
    if (!isDemo) {
      if (chosenGiftId !== 'gift_001') {
        const gift = cases.find(c => c.id === caseId).items.find(i => i.giftId === chosenGiftId);
        user.inventory.push({
          giftId: chosenGiftId,
          name: gift.name,
          image: gift.image,
          price: gift.price,
        });
      }
      if (caseId === 'case_13') {
        user.lastFreeDailySpin = new Date();
      }
      if (caseItem.isTopup) {
        user.openedTopupCases.push(caseId);
      }
      await user.save();

      // Логирование спина
      const liveSpin = new LiveSpin({
        giftId: chosenGiftId,
        caseId: caseItem.id,
      });
      await liveSpin.save();
    }

    res.json({
      giftId: chosenGiftId,
      newBalance: isDemo ? user.balance : user.balance,
      newDiamonds: isDemo ? user.diamonds : user.diamonds,
    });
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

export default router;