import Gift from '../models/Gift.js';

// Функция для генерации случайного спина
const generateFakeSpin = async () => {
  try {
    // Получаем подарки из базы данных
    const gifts = await Gift.find().lean();
    // Фильтруем gift_001 (none)
    const validGifts = gifts.filter(gift => gift.giftId !== 'gift_001');
    
    if (validGifts.length === 0) {
      return null;
    }
    
    // Рассчитываем веса: обратная пропорция цены
    const weights = validGifts.map(gift => {
      const price = gift.price || 1; // Избегаем деления на 0
      return 1 / (price / 1000 + 1); // Делим на 1000 для нормализации
    });
    
    // Нормализуем веса в вероятности
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const probabilities = weights.map(weight => weight / totalWeight);
    
    // Выбираем случайный подарок
    let random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < validGifts.length; i++) {
      cumulative += probabilities[i];
      if (random <= cumulative) {
        const gift = validGifts[i];
        return {
          id: Date.now() + Math.random(),
          timestamp: new Date(),
          case: 'Fake Case',
          player: 'Анонимный игрок',
          gift: {
            id: gift.giftId,
            name: gift.name,
            image: gift.image,
            price: gift.price,
          },
        };
      }
    }
    
    // Резервный вариант
    const fallbackGift = validGifts[0];
    return {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      case: 'Fake Case',
      player: 'Анонимный игрок',
      gift: {
        id: fallbackGift.giftId,
        name: fallbackGift.name,
        image: fallbackGift.image,
        price: fallbackGift.price,
      },
    };
  } catch (error) {
    console.error('Ошибка генерации фейкового спина:', error);
    return null;
  }
};

// Хранилище последних 20 спинов
let liveSpins = [];

// Генерация и рассылка спинов
const startFakeSpinGeneration = (io) => {
  setInterval(async () => {
    const newSpin = await generateFakeSpin();
    if (newSpin) {
      liveSpins = [newSpin, ...liveSpins].slice(0, 20); // Храним последние 20
      io.emit('newLiveSpin', newSpin); // Рассылаем всем клиентам
    }
  }, Math.random() * 3000 + 2000); // 2–5 секунд
};

// Получение текущих спинов
const getLiveSpins = () => liveSpins;

export { startFakeSpinGeneration, getLiveSpins };
