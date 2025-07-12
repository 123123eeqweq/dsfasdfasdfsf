import express from 'express';
import Case from '../models/Case.js';
import User from '../models/User.js';
import LiveSpin from '../models/LiveSpin.js';
import cases from '../data/cases.js';
import gifts from '../data/gifts.js'; // Добавляем импорт gifts.js

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

    if (isDemo && (caseId === 'case_13' || caseItem.isReferral || caseItem.isTopup)) {
      return res.status(403).json({ message: 'Демо-режим недоступен для этого кейса' });
    }

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
    let chosenGift = null;

    if (isHunterCase) {
      chosenGiftId = 'gift_001';
      chosenGift = gifts.find(g => g.id === chosenGiftId) || {
        id: 'gift_001',
        name: 'Ничего',
        price: 0,
      };
    } else {
      const rand = Math.random();
      let cumulativeProbability = 0;
      for (const item of caseItem.items) {
        if (item.giftId === 'gift_037') continue;
        cumulativeProbability += item.probability;
        if (rand <= cumulativeProbability) {
          chosenGiftId = item.giftId;
          chosenGift = gifts.find(g => g.id === chosenGiftId);
          break;
        }
      }
      if (!chosenGiftId) {
        const validItems = caseItem.items.filter(item => item.probability > 0 && item.giftId !== 'gift_037');
        if (validItems.length === 0) {
          chosenGiftId = 'gift_001';
          chosenGift = gifts.find(g => g.id === chosenGiftId) || {
            id: 'gift_001',
            name: 'Ничего',
            price: 0,
          };
        } else {
          chosenGiftId = validItems[0].giftId;
          chosenGift = gifts.find(g => g.id === chosenGiftId);
        }
      }
    }

    if (chosenGiftId === 'gift_037') {
      chosenGiftId = 'gift_001';
      chosenGift = gifts.find(g => g.id === chosenGiftId) || {
        id: 'gift_001',
        name: 'Ничего',
        price: 0,
      };
    }

    if (!isDemo) {
      if (chosenGiftId !== 'gift_001') {
        user.inventory.push({
          giftId: chosenGiftId,
          name: chosenGift.name,
          price: chosenGift.price,
        });
      }
      if (caseId === 'case_13') {
        user.lastFreeDailySpin = new Date();
      }
      if (caseItem.isTopup) {
        user.openedTopupCases.push(caseId);
      }
      await user.save();

      const liveSpin = new LiveSpin({
        giftId: chosenGiftId,
        caseId: caseItem.id,
      });
      await liveSpin.save();
    }

    res.json({
      giftId: chosenGiftId,
      gift: {
        name: chosenGift.name,
        price: chosenGift.price,
      },
      newBalance: isDemo ? user.balance : user.balance,
      newDiamonds: isDemo ? user.diamonds : user.diamonds,
    });
  } catch (error) {
    console.error("Ошибка в spin.js:", error.message);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

export default router;