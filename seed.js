import mongoose from "mongoose";
import dotenv from "dotenv";
import Gift from "./models/Gift.js";
import Case from "./models/Case.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB подключена, братан! 🚀");
  } catch (error) {
    console.error("MongoDB не хочет дружить: 😢", error.message);
    process.exit(1);
  }
};

console.log("Скрипт seed.js запущен!");
const seedDB = async () => {
  try {
    await connectDB();

    // Очищаем коллекции
    console.log("Чистим коллекции...");
    await Gift.deleteMany({});
    console.log("Коллекция Gift очищена!");
    await Case.deleteMany({});
    console.log("Коллекция Case очищена!");

    // Подарки
    const gifts = [
      { giftId: "gift_001", name: "heart", image: "https://cdn.changes.tg/gifts/originals/5170145012310081615/Original.png", price: 15 },
      { giftId: "gift_002", name: "teddy-bear", image: "https://cdn.changes.tg/gifts/originals/5170233102089322756/Original.png", price: 15 },
      { giftId: "gift_003", name: "flower", image: "https://cdn.changes.tg/gifts/originals/5168103777563050263/Original.png", price: 25 },
      { giftId: "gift_004", name: "gift", image: "https://cdn.changes.tg/gifts/originals/5170250947678437525/Original.png", price: 25 },
      { giftId: "gift_005", name: "cup", image: "https://cdn.changes.tg/gifts/originals/5168043875654172773/Original.png", price: 50 },
      { giftId: "gift_006", name: "cake", image: "https://cdn.changes.tg/gifts/originals/5170144170496491616/Original.png", price: 50 },
      { giftId: "gift_007", name: "flowers", image: "https://cdn.changes.tg/gifts/originals/5170314324215857265/Original.png", price: 50 },
      { giftId: "gift_008", name: "rocket", image: "https://cdn.changes.tg/gifts/originals/5170564780938756245/Original.png", price: 50 },
      { giftId: "gift_009", name: "champagne", image: "https://cdn.changes.tg/gifts/originals/6028601630662853006/Original.png", price: 50 },
      { giftId: "gift_010", name: "diamond", image: "https://cdn.changes.tg/gifts/originals/5170521118301225164/Original.png", price: 100 },
      { giftId: "gift_011", name: "ring", image: "https://cdn.changes.tg/gifts/originals/5170690322832818290/Original.png", price: 100 },
      { giftId: "gift_012", name: "desk-calendar", image: "https://cdn.changes.tg/gifts/originals/5782988952268964995/Original.png", price: 300 },
      { giftId: "gift_013", name: "lol-pop", image: "https://cdn.changes.tg/gifts/originals/5170594532177215681/Original.png", price: 350 },
      { giftId: "gift_014", name: "b-day-candle", image: "https://cdn.changes.tg/gifts/originals/5782984811920491178/Original.png", price: 375 },
      { giftId: "gift_015", name: "lunar-snake", image: "https://cdn.changes.tg/gifts/originals/6028426950047957932/Original.png", price: 400 },
      { giftId: "gift_016", name: "xmas-stocking", image: "https://cdn.changes.tg/gifts/originals/6003767644426076664/Original.png", price: 400 },
      { giftId: "gift_018", name: "winter-wreath", image: "https://cdn.changes.tg/gifts/originals/5983259145522906006/Original.png", price: 500 },
      { giftId: "gift_021", name: "pet-snake", image: "https://cdn.changes.tg/gifts/originals/6023917088358269866/Original.png", price: 500 },
      { giftId: "gift_024", name: "homemade-cake", image: "https://cdn.changes.tg/gifts/originals/5783075783622787539/Original.png", price: 550 },
      { giftId: "gift_026", name: "jester-hat", image: "https://cdn.changes.tg/gifts/originals/5933590374185435592/Original.png", price: 600 },
      { giftId: "gift_028", name: "big-year", image: "https://cdn.changes.tg/gifts/originals/6028283532500009446/Original.png", price: 600 },
      { giftId: "gift_029", name: "hypno-lollipop", image: "https://cdn.changes.tg/gifts/originals/5825895989088617224/Original.png", price: 600 },
      { giftId: "gift_032", name: "tama-gadget", image: "https://cdn.changes.tg/gifts/originals/6023752243218481939/Original.png", price: 700 },
      { giftId: "gift_033", name: "easter-egg", image: "https://cdn.changes.tg/gifts/originals/5773668482394620318/Original.png", price: 850 },
      { giftId: "gift_035", name: "snow-mittens", image: "https://cdn.changes.tg/gifts/originals/5980789805615678057/Original.png", price: 900 },
      { giftId: "gift_036", name: "snow-globe", image: "https://cdn.changes.tg/gifts/originals/5981132629905245483/Original.png", price: 900 },
      { giftId: "gift_037", name: "star-notepad", image: "https://cdn.changes.tg/gifts/originals/5936017773737018241/Original.png", price: 900 },
      { giftId: "gift_038", name: "witch-hat", image: "https://cdn.changes.tg/gifts/originals/5821384757304362229/Original.png", price: 900 },
      { giftId: "gift_039", name: "restless-jar", image: "https://cdn.changes.tg/gifts/originals/5870784783948186838/Original.png", price: 930 },
      { giftId: "gift_040", name: "lush-bouquet", image: "https://cdn.changes.tg/gifts/originals/5871002671934079382/Original.png", price: 950 },
      { giftId: "gift_044", name: "eternal-candle", image: "https://cdn.changes.tg/gifts/originals/5821205665758053411/Original.png", price: 1100 },
      { giftId: "gift_045", name: "bow-tie", image: "https://cdn.changes.tg/gifts/originals/5895544372761461960/Original.png", price: 1100 },
      { giftId: "gift_046", name: "jelly-bunny", image: "https://cdn.changes.tg/gifts/originals/5915502858152706668/Original.png", price: 1100 },
      { giftId: "gift_047", name: "bunny-muffin", image: "https://cdn.changes.tg/gifts/originals/5935936766358847989/Original.png", price: 1200 },
      { giftId: "gift_049", name: "berry-box", image: "https://cdn.changes.tg/gifts/originals/5882252952218894938/Original.png", price: 1300 },
      { giftId: "gift_050", name: "hanging-star", image: "https://cdn.changes.tg/gifts/originals/5915733223018594841/Original.png", price: 1300 },
      { giftId: "gift_051", name: "sleigh-bell", image: "https://cdn.changes.tg/gifts/originals/5981026247860290310/Original.png", price: 2000 },
      { giftId: "gift_053", name: "trapped-heart", image: "https://cdn.changes.tg/gifts/originals/5841391256135008713/Original.png", price: 2400 },
      { giftId: "gift_054", name: "crystal-ball", image: "https://cdn.changes.tg/gifts/originals/5841336413697606412/Original.png", price: 2400 },
      { giftId: "gift_055", name: "record-player", image: "https://cdn.changes.tg/gifts/originals/5856973938650776169/Original.png", price: 2500 },
      { giftId: "gift_057", name: "skull-flower", image: "https://cdn.changes.tg/gifts/originals/5839038009193792264/Original.png", price: 2500 },
      { giftId: "gift_058", name: "top-hat", image: "https://cdn.changes.tg/gifts/originals/5897593557492957738/Original.png", price: 2800 },
      { giftId: "gift_059", name: "love-candle", image: "https://cdn.changes.tg/gifts/originals/5915550639663874519/Original.png", price: 2800 },
      { giftId: "gift_060", name: "mad-pumpkin", image: "https://cdn.changes.tg/gifts/originals/5841632504448025405/Original.png", price: 4000 },
      { giftId: "gift_061", name: "eternal-rose", image: "https://cdn.changes.tg/gifts/originals/5882125812596999035/Original.png", price: 4400 },
      { giftId: "gift_062", name: "voodoo-doll", image: "https://cdn.changes.tg/gifts/originals/5836780359634649414/Original.png", price: 4800 },
      { giftId: "gift_063", name: "diamond-ring", image: "https://cdn.changes.tg/gifts/originals/5868503709637411929/Original.png", price: 4800 },
      { giftId: "gift_064", name: "toy-bear", image: "https://cdn.changes.tg/gifts/originals/5868220813026526561/Original.png", price: 7000 },
      { giftId: "gift_065", name: "neko-helmet", image: "https://cdn.changes.tg/gifts/originals/5933793770951673155/Original.png", price: 9200 },
      { giftId: "gift_066", name: "signet-ring", image: "https://cdn.changes.tg/gifts/originals/5936085638515261992/Original.png", price: 9200 },
      { giftId: "gift_067", name: "vintage-cigar", image: "https://cdn.changes.tg/gifts/originals/5857140566201991735/Original.png", price: 9500 },
      { giftId: "gift_068", name: "kissed-frog", image: "https://cdn.changes.tg/gifts/originals/5845776576658015084/Original.png", price: 10000 },
      { giftId: "gift_069", name: "electric-skull", image: "https://cdn.changes.tg/gifts/originals/5846192273657692751/Original.png", price: 10200 },
      { giftId: "gift_070", name: "swiss-watch", image: "https://cdn.changes.tg/gifts/originals/5936043693864651359/Original.png", price: 10500 },
      { giftId: "gift_072", name: "scared-cat", image: "https://cdn.changes.tg/gifts/originals/5837059369300132790/Original.png", price: 15000 },
      { giftId: "gift_073", name: "bonded-ring", image: "https://cdn.changes.tg/gifts/originals/5870661333703197240/Original.png", price: 23000 },
      { giftId: "gift_074", name: "genie-lamp", image: "https://cdn.changes.tg/gifts/originals/5933531623327795414/Original.png", price: 24000 },
      { giftId: "gift_075", name: "ion-gem", image: "https://cdn.changes.tg/gifts/originals/5843762284240831056/Original.png", price: 26000 },
      { giftId: "gift_076", name: "mini-oscar", image: "https://cdn.changes.tg/gifts/originals/5879737836550226478/Original.png", price: 28000 },
      { giftId: "gift_078", name: "loot-bag", image: "https://cdn.changes.tg/gifts/originals/5868659926187901653/Original.png", price: 32000 },
      { giftId: "gift_081", name: "nail-bracelet", image: "https://cdn.changes.tg/gifts/originals/5870720080265871962/Original.png", price: 50000 },
    ];

    // Кейсы
    const cases = [
      // Бесплатный кейс
      {
        caseId: "case_1",
        name: "Бесплатный",
        image: "https://i.ibb.co/4ZmXTz9q/133.png",
        price: 0,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_001", probability: 0.681 },
          { giftId: "gift_002", probability: 0.1545 },
          { giftId: "gift_003", probability: 0.1545 },
          { giftId: "gift_004", probability: 0.004 },
          { giftId: "gift_005", probability: 0.004 },
          { giftId: "gift_006", probability: 0.001 },
          { giftId: "gift_007", probability: 0.001 },
          { giftId: "gift_010", probability: 0.0001 },
          { giftId: "gift_021", probability: 0.00001 },
        ],
      },
      // Кейсы с возрастающей стоимостью
      {
        caseId: "case_2",
        name: "Базовый",
        image: "https://i.ibb.co/gbwf81MV/1.png",
        price: 50,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_002", probability: 0.40 },
          { giftId: "gift_003", probability: 0.30 },
          { giftId: "gift_010", probability: 0.20 },
          { giftId: "gift_011", probability: 0.05 },
          { giftId: "gift_012", probability: 0.01 },
        ],
        // RTP: (0.4*15 + 0.3*25 + 0.2*100 + 0.05*100 + 0.01*300) / 50 * 100 = 61.5%
        // Окупаемость: teddy-bear (15), flower (25) с шансом 0.7
      },
      {
        caseId: "case_3",
        name: "Средний",
        image: "https://i.ibb.co/Y4vmdpBr/2.png",
        price: 200,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_001", probability: 0.40 },
          { giftId: "gift_007", probability: 0.30 },
          { giftId: "gift_013", probability: 0.20 },
          { giftId: "gift_014", probability: 0.05 },
          { giftId: "gift_015", probability: 0.009 },
          { giftId: "gift_032", probability: 0.001 },
        ],
        // RTP: (0.4*15 + 0.3*50 + 0.2*350 + 0.05*375 + 0.009*400 + 0.001*700) / 200 * 100 = 62.55%
        // Окупаемость: heart (15), flowers (50) с шансом 0.7
      },
      {
        caseId: "case_4",
        name: "Сладкий",
        image: "https://i.ibb.co/KcfNPvbB/11.png",
        price: 350,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_006", probability: 0.50 },
          { giftId: "gift_024", probability: 0.30 },
          { giftId: "gift_047", probability: 0.15 },
          { giftId: "gift_049", probability: 0.05 },
        ],
        // RTP: (0.5*50 + 0.3*550 + 0.15*1200 + 0.05*1300) / 350 * 100 = 61.43%
        // Окупаемость: cake (50), homemade-cake (550) с шансом 0.8
      },
      {
        caseId: "case_5",
        name: "Зимний",
        image: "https://i.ibb.co/xKCjZvVD/9.png",
        price: 450,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_009", probability: 0.40 },
          { giftId: "gift_016", probability: 0.30 },
          { giftId: "gift_018", probability: 0.20 },
          { giftId: "gift_035", probability: 0.05 },
          { giftId: "gift_036", probability: 0.01 },
        ],
        // RTP: (0.4*50 + 0.3*400 + 0.2*500 + 0.05*900 + 0.01*900) / 450 * 100 = 62.22%
        // Окупаемость: champagne (50), xmas-stocking (400) с шансом 0.7
      },
      {
        caseId: "case_6",
        name: "Праздничный",
        image: "https://i.ibb.co/8Lq1ygqG/3.png",
        price: 500,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_009", probability: 0.40 },
          { giftId: "gift_008", probability: 0.30 },
          { giftId: "gift_016", probability: 0.20 },
          { giftId: "gift_033", probability: 0.05 },
          { giftId: "gift_037", probability: 0.009 },
          { giftId: "gift_045", probability: 0.005 },
          { giftId: "gift_055", probability: 0.001 },
        ],
        // RTP: (0.4*50 + 0.3*50 + 0.2*400 + 0.05*850 + 0.009*900 + 0.005*1100 + 0.001*2500) / 500 * 100 = 63.15%
        // Окупаемость: champagne (50), rocket (50), xmas-stocking (400) с шансом 0.9
      },
      {
        caseId: "case_7",
        name: "Цветочный",
        image: "https://i.ibb.co/HfMgb9hv/8.png",
        price: 700,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_007", probability: 0.50 },
          { giftId: "gift_040", probability: 0.30 },
          { giftId: "gift_057", probability: 0.15 },
          { giftId: "gift_061", probability: 0.05 },
        ],
        // RTP: (0.5*50 + 0.3*950 + 0.15*2500 + 0.05*4400) / 700 * 100 = 61.79%
        // Окупаемость: flowers (50), lush-bouquet (950) с шансом 0.8
      },
      {
        caseId: "case_8",
        name: "Украшения",
        image: "https://i.ibb.co/pBB7j65d/13.png",
        price: 700,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_011", probability: 0.40 },
          { giftId: "gift_026", probability: 0.30 },
          { giftId: "gift_045", probability: 0.20 },
          { giftId: "gift_058", probability: 0.05 },
          { giftId: "gift_063", probability: 0.01 },
        ],
        // RTP: (0.4*100 + 0.3*600 + 0.2*1100 + 0.05*2800 + 0.01*4800) / 700 * 100 = 62.86%
        // Окупаемость: ring (100), jester-hat (600) с шансом 0.7
      },
      {
        caseId: "case_9",
        name: "Элитный",
        image: "https://i.ibb.co/fdKBFPmZ/4.png",
        price: 1200,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_014", probability: 0.40 },
          { giftId: "gift_024", probability: 0.30 },
          { giftId: "gift_038", probability: 0.20 },
          { giftId: "gift_050", probability: 0.05 },
          { giftId: "gift_053", probability: 0.009 },
          { giftId: "gift_056", probability: 0.005 },
          { giftId: "gift_057", probability: 0.001 },
        ],
        // RTP: (0.4*375 + 0.3*550 + 0.2*900 + 0.05*1300 + 0.009*2400 + 0.005*2500 + 0.001*2500) / 1200 * 100 = 62.69%
        // Окупаемость: b-day-candle (375), homemade-cake (550) с шансом 0.7
      },
      {
        caseId: "case_10",
        name: "Мистический",
        image: "https://i.ibb.co/RpGY7X1x/10.png",
        price: 1500,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_029", probability: 0.40 },
          { giftId: "gift_038", probability: 0.30 },
          { giftId: "gift_044", probability: 0.15 },
          { giftId: "gift_052", probability: 0.05 },
          { giftId: "gift_053", probability: 0.03 },
          { giftId: "gift_054", probability: 0.02 },
          { giftId: "gift_057", probability: 0.008 },
          { giftId: "gift_060", probability: 0.001 },
          { giftId: "gift_069", probability: 0.0009 },
          { giftId: "gift_072", probability: 0.0001 },
        ],
        // RTP: (0.4*600 + 0.3*900 + 0.15*1100 + 0.05*2100 + 0.03*2400 + 0.02*2400 + 0.008*2500 + 0.001*4000 + 0.0009*10200 + 0.0001*15000) / 1500 * 100 = 63.64%
        // Окупаемость: hypno-lollipop (600), witch-hat (900) с шансом 0.7
      },
      {
        caseId: "case_11",
        name: "Роскошный",
        image: "https://i.ibb.co/5g2Bw2Lz/5.png",
        price: 2800,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_028", probability: 0.40 },
          { giftId: "gift_039", probability: 0.30 },
          { giftId: "gift_046", probability: 0.20 },
          { giftId: "gift_058", probability: 0.05 },
          { giftId: "gift_061", probability: 0.009 },
          { giftId: "gift_062", probability: 0.005 },
          { giftId: "gift_064", probability: 0.001 },
        ],
        // RTP: (0.4*600 + 0.3*930 + 0.2*1100 + 0.05*2800 + 0.009*4400 + 0.005*4800 + 0.001*7000) / 2800 * 100 = 64.05%
        // Окупаемость: big-year (600), restless-jar (930), jelly-bunny (1100) с шансом 0.9
      },
      {
        caseId: "case_12",
        name: "Легендарный",
        image: "https://i.ibb.co/G3s6VxKM/6.png",
        price: 6000,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_040", probability: 0.40 },
          { giftId: "gift_059", probability: 0.30 },
          { giftId: "gift_065", probability: 0.20 },
          { giftId: "gift_067", probability: 0.05 },
          { giftId: "gift_068", probability: 0.01 },
        ],
        // RTP: (0.4*950 + 0.3*2800 + 0.2*9200 + 0.05*9500 + 0.01*10000) / 6000 * 100 = 61.83%
        // Окупаемость: lush-bouquet (950), love-candle (2800) с шансом 0.7
      },
      {
        caseId: "case_13",
        name: "Золотой",
        image: "https://i.ibb.co/TfcL3RB/12.png",
        price: 7500,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_005", probability: 0.40 },
          { giftId: "gift_051", probability: 0.30 },
          { giftId: "gift_066", probability: 0.20 },
          { giftId: "gift_070", probability: 0.05 },
          { giftId: "gift_073", probability: 0.009 },
          { giftId: "gift_074", probability: 0.005 },
          { giftId: "gift_076", probability: 0.001 },
        ],
        // RTP: (0.4*50 + 0.3*2000 + 0.2*9200 + 0.05*10500 + 0.009*23000 + 0.005*24000 + 0.001*28000) / 7500 * 100 = 64.07%
        // Окупаемость: cup (50), sleigh-bell (2000) с шансом 0.7
      },
      {
        caseId: "case_14",
        name: "Королевский",
        image: "https://i.ibb.co/VYsk8w2S/7.png",
        price: 15000,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_060", probability: 0.40 },
          { giftId: "gift_070", probability: 0.30 },
          { giftId: "gift_075", probability: 0.20 },
          { giftId: "gift_076", probability: 0.05 },
          { giftId: "gift_078", probability: 0.009 },
          { giftId: "gift_081", probability: 0.001 },
        ],
        // RTP: (0.4*4000 + 0.3*10500 + 0.2*26000 + 0.05*28000 + 0.009*32000 + 0.001*50000) / 15000 * 100 = 63.05%
        // Окупаемость: mad-pumpkin (4000), swiss-watch (10500) с шансом 0.7
      },
    ];

    await Gift.insertMany(gifts);
    console.log(
      `Подарки закинуты в базу, братан! 🎁 Залито ${gifts.length} штук`
    );

    await Case.insertMany(cases);
    console.log(
      `Кейсы закинуты в базу, братан! 🎲 Залито ${cases.length} штук`
    );

    mongoose.connection.close();
    console.log("База закрыта, всё ок! 😎");
  } catch (error) {
    console.error("Косяк при заливке данных: 😵", error.message);
    process.exit(1);
  }
};

seedDB();