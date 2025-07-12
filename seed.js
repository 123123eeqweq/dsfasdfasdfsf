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
      {
        giftId: "gift_001",
        name: "none",
        image: "https://i.ibb.co/rKFThFTb/1.png",
        price: 0,
      },
      {
        giftId: "gift_002",
        name: "heart",
        image: "https://i.ibb.co/HDdFFZDv/2.png",
        price: 15,
      },
      {
        giftId: "gift_003",
        name: "teddy",
        image: "https://i.ibb.co/9kpSzzkJ/3.png",
        price: 15,
      },
      {
        giftId: "gift_004",
        name: "gift",
        image: "https://i.ibb.co/8D61Rr8S/4.png",
        price: 25,
      },
      {
        giftId: "gift_005",
        name: "flower",
        image: "https://i.ibb.co/rGhcb711/5.png",
        price: 25,
      },
      {
        giftId: "gift_006",
        name: "cake",
        image: "https://i.ibb.co/7JF8d78c/6.png",
        price: 50,
      },
      {
        giftId: "gift_007",
        name: "flowers",
        image: "https://i.ibb.co/0pJVBG3y/7.png",
        price: 50,
      },
      {
        giftId: "gift_008",
        name: "rocket",
        image: "https://i.ibb.co/Y4hN8C8P/8.png",
        price: 50,
      },
      {
        giftId: "gift_009",
        name: "ton01",
        image: "https://i.ibb.co/fYVmFpw1/9.png",
        price: 50,
      },
      {
        giftId: "gift_010",
        name: "cup",
        image: "https://i.ibb.co/BVhLZQNH/10.png",
        price: 100,
      },
      {
        giftId: "gift_011",
        name: "ring",
        image: "https://i.ibb.co/8gJHBdGp/11.png",
        price: 100,
      },
      {
        giftId: "gift_012",
        name: "diamond",
        image: "https://i.ibb.co/cXtgD23q/12.png",
        price: 100,
      },
      {
        giftId: "gift_013",
        name: "ton1",
        image: "https://i.ibb.co/7JtqMqLc/13.png",
        price: 100,
      },
      {
        giftId: "gift_014",
        name: "rings",
        image: "https://i.ibb.co/wN0NV2Z7/14.png",
        price: 470,
      },
      {
        giftId: "gift_015",
        name: "lolipop",
        image: "https://i.ibb.co/1JXp2gHw/15.png",
        price: 390,
      },
      {
        giftId: "gift_016",
        name: "happybday",
        image: "https://i.ibb.co/5WDMfMtr/16.png",
        price: 300,
      },
      {
        giftId: "gift_017",
        name: "coockie",
        image: "https://i.ibb.co/k2qxgJzL/17.png",
        price: 550,
      },
      {
        giftId: "gift_018",
        name: "jester",
        image: "https://i.ibb.co/Jjc29QPj/18.png",
        price: 510,
      },
      {
        giftId: "gift_019",
        name: "partysparkle",
        image: "https://i.ibb.co/3ywVyzpw/19.png",
        price: 540,
      },
      {
        giftId: "gift_020",
        name: "ton5",
        image: "https://i.ibb.co/przMx3Q1/20.png",
        price: 500,
      },
      {
        giftId: "gift_021",
        name: "notepad",
        image: "https://i.ibb.co/842WdtP6/21.png",
        price: 800,
      },
      {
        giftId: "gift_022",
        name: "tgpremium1m",
        image: "https://i.ibb.co/s9LQ8kPX/22.png",
        price: 1000,
      },
      {
        giftId: "gift_023",
        name: "hat",
        image: "https://i.ibb.co/1GS02K1V/23.png",
        price: 2800,
      },
      {
        giftId: "gift_024",
        name: "potion",
        image: "https://i.ibb.co/4gNQ2cps/24.png",
        price: 2800,
      },
      {
        giftId: "gift_025",
        name: "tgpremium3m",
        image: "https://i.ibb.co/KzQW3T41/25.png",
        price: 2500,
      },
      {
        giftId: "gift_026",
        name: "ton25",
        image: "https://i.ibb.co/pBc6qcMX/26.png",
        price: 2500,
      },
      {
        giftId: "gift_027",
        name: "vodoo",
        image: "https://i.ibb.co/tMnk1S2V/27.png",
        price: 4700,
      },
      {
        giftId: "gift_028",
        name: "helmet",
        image: "https://i.ibb.co/RkXGFBb2/28.png",
        price: 8000,
      },
      {
        giftId: "gift_029",
        name: "swisswatch",
        image: "https://i.ibb.co/9HDYNmWS/29.png",
        price: 12000,
      },
      {
        giftId: "gift_030",
        name: "signetring",
        image: "https://i.ibb.co/JFbLy7rL/30.png",
        price: 8800,
      },
      {
        giftId: "gift_031",
        name: "cigar",
        image: "https://i.ibb.co/jvbGBntj/31.png",
        price: 10000,
      },
      {
        giftId: "gift_032",
        name: "genielamp",
        image: "https://i.ibb.co/Nd8qPWZc/32.png",
        price: 16300,
      },
      {
        giftId: "gift_033",
        name: "lootbag",
        image: "https://i.ibb.co/hFCD03SJ/33.png",
        price: 38900,
      },
      {
        giftId: "gift_034",
        name: "astralshard",
        image: "https://i.ibb.co/fg9gSWL/34.png",
        price: 38100,
      },
      {
        giftId: "gift_035",
        name: "preciouspeach",
        image: "https://i.ibb.co/zHQjzfGr/35.png",
        price: 53000,
      },
      {
        giftId: "gift_036",
        name: "durovscap",
        image: "https://i.ibb.co/wFykmQQz/36.png",
        price: 95000,
      },
      {
        giftId: "gift_037",
        name: "plushpepe",
        image: "https://i.ibb.co/tpCLQWzM/37.png",
        price: 900000,
      },
      // new
      {
        giftId: "gift_038",
        name: "heroic_helmet",
        image: "https://i.ibb.co/VWd9RY3n/123123123123.png",
        price: 75000,
      },
      {
        giftId: "gift_039",
        name: "jack_in_the_box",
        image: "https://i.ibb.co/6c6r4kvP/13123123.png",
        price: 800,
      },
      {
        giftId: "gift_040",
        name: "light_sword",
        image: "https://i.ibb.co/4RvZcsrV/34234234234.png",
        price: 900,
      },
      {
        giftId: "gift_041",
        name: "restless-jar",
        image: "https://i.ibb.co/yFCLmk8N/2234234234234.png",
        price: 1000,
      },
      {
        giftId: "gift_042",
        name: "bow-tie",
        image: "https://i.ibb.co/bM3sXYdc/wwerwerwer.png",
        price: 1000,
      },
      {
        giftId: "gift_043",
        name: "lunar-snake",
        image: "https://i.ibb.co/60V0ZDpz/22025.png",
        price: 375,
      },
      {
        giftId: "gift_044",
        name: "diamond-ring",
        image: "https://i.ibb.co/Lz4qWFnR/image.png",
        price: 5300,
      },
      {
        giftId: "gift_045",
        name: "easter-egg",
        image: "https://i.ibb.co/Z6617d0f/image.png",
        price: 800,
      },
      {
        giftId: "gift_046",
        name: "tama-gadget",
        image: "https://i.ibb.co/4RmHk7kd/image.png",
        price: 600,
      },
      {
        giftId: "gift_047",
        name: "xmas-stocking",
        image: "https://i.ibb.co/B2MzwXMD/image.png",
        price: 390,
      },
      {
        giftId: "gift_048",
        name: "cookie-heart",
        image: "https://i.ibb.co/JRyhyg0R/image.png",
        price: 500,
      },
      {
        giftId: "gift_049",
        name: "big-year",
        image: "https://i.ibb.co/Wp78TmS4/2025.png",
        price: 600,
      },
      {
        giftId: "gift_050",
        name: "candy-cane",
        image: "https://i.ibb.co/nqBKNWqP/image.png",
        price: 400,
      },
    ];

    // Кейсы
    const cases = [
      {
        caseId: "case_1",
        name: "Стартер",
        image: "https://i.ibb.co/cXtgD23q/12.png",
        price: 25,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_002", probability: 0.39 },
          { giftId: "gift_003", probability: 0.39 },
          { giftId: "gift_004", probability: 0.18 },
          { giftId: "gift_010", probability: 0.03 },
          { giftId: "gift_011", probability: 0.005 },
          { giftId: "gift_012", probability: 0.005 },
        ],
        // rtp 60.3%
      },
      {
        caseId: "case_2",
        name: "Новичок",
        image: "https://i.ibb.co/5WDMfMtr/16.png",
        price: 100,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_003", probability: 0.41 },
          { giftId: "gift_005", probability: 0.41 },
          { giftId: "gift_006", probability: 0.15 },
          { giftId: "gift_013", probability: 0.022 },
          { giftId: "gift_011", probability: 0.012 },
          { giftId: "gift_015", probability: 0.0025 },
          { giftId: "gift_016", probability: 0.0025 },
        ],
        // rtp 62.75%
      },
      {
        caseId: "case_3",
        name: "Работяга",
        image: "https://i.ibb.co/1GS02K1V/23.png",
        price: 250,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_007", probability: 0.497 },
          { giftId: "gift_008", probability: 0.447 },
          { giftId: "gift_014", probability: 0.018 },
          { giftId: "gift_015", probability: 0.018 },
          { giftId: "gift_018", probability: 0.0199 },
          { giftId: "gift_023", probability: 0.0001 },
        ],
        // rtp 66.412%
      },
      {
        caseId: "case_4",
        name: "Серьезный",
        image: "https://i.ibb.co/tMnk1S2V/27.png",
        price: 500,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_008", probability: 0.4 },
          { giftId: "gift_012", probability: 0.3 },
          { giftId: "gift_013", probability: 0.2 },
          { giftId: "gift_016", probability: 0.05 },
          { giftId: "gift_020", probability: 0.046 },
          { giftId: "gift_021", probability: 0.0015 },
          { giftId: "gift_024", probability: 0.0015 },
          { giftId: "gift_026", probability: 0.001 },
          { giftId: "gift_027", probability: 0.001 },
        ],
        // rtp 62.3%
      },
      {
        caseId: "case_5",
        name: "Продвинутый",
        image: "https://i.ibb.co/JFbLy7rL/30.png",
        price: 1200,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_012", probability: 0.35 },
          { giftId: "gift_014", probability: 0.25 },
          { giftId: "gift_015", probability: 0.2 },
          { giftId: "gift_021", probability: 0.1 },
          { giftId: "gift_022", probability: 0.096 },
          { giftId: "gift_025", probability: 0.001 },
          { giftId: "gift_028", probability: 0.001 },
          { giftId: "gift_029", probability: 0.001 },
          { giftId: "gift_030", probability: 0.001 },
        ],
        // rtp 64.458%
      },
      {
        caseId: "case_6",
        name: "NFT кейс",
        image: "https://i.ibb.co/9HDYNmWS/29.png",
        price: 1500,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_015", probability: 0.3 },
          { giftId: "gift_016", probability: 0.3 },
          { giftId: "gift_017", probability: 0.2 },
          { giftId: "gift_018", probability: 0.1 },
          { giftId: "gift_019", probability: 0.094 },
          { giftId: "gift_023", probability: 0.002 },
          { giftId: "gift_024", probability: 0.0015 },
          { giftId: "gift_027", probability: 0.001 },
          { giftId: "gift_028", probability: 0.0008 },
          { giftId: "gift_029", probability: 0.0004 },
          { giftId: "gift_030", probability: 0.0006 },
          { giftId: "gift_031", probability: 0.0006 },
        ],
        // rtp 64.45%
      },
      {
        caseId: "case_7",
        name: "Богатый",
        image: "https://i.ibb.co/Nd8qPWZc/32.png",
        price: 2500,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_008", probability: 0.5 },
          { giftId: "gift_017", probability: 0.3 },
          { giftId: "gift_021", probability: 0.1 },
          { giftId: "gift_023", probability: 0.096 },
          { giftId: "gift_024", probability: 0.001 },
          { giftId: "gift_029", probability: 0.001 },
          { giftId: "gift_030", probability: 0.001 },
          { giftId: "gift_031", probability: 0.001 },
          { giftId: "gift_032", probability: 0.001 },
        ],
        // rtp 65.84%
      },
      {
        caseId: "case_8",
        name: "Чемпион",
        image: "https://i.ibb.co/hFCD03SJ/33.png",
        price: 5000,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_013", probability: 0.4 },
          { giftId: "gift_019", probability: 0.3 },
          { giftId: "gift_024", probability: 0.15 },
          { giftId: "gift_027", probability: 0.1 },
          { giftId: "gift_030", probability: 0.046 },
          { giftId: "gift_031", probability: 0.0015 },
          { giftId: "gift_032", probability: 0.0015 },
          { giftId: "gift_033", probability: 0.001 },
          { giftId: "gift_034", probability: 0.0005 },
        ],
        // rtp 66.81%
      },
      {
        caseId: "case_9",
        name: "Титан",
        image: "https://i.ibb.co/tpCLQWzM/37.png",
        price: 10000,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_023", probability: 0.5 },
          { giftId: "gift_026", probability: 0.3 },
          { giftId: "gift_027", probability: 0.149 },
          { giftId: "gift_028", probability: 0.05 },
          { giftId: "gift_034", probability: 0.001 },
          { giftId: "gift_035", probability: 0 },
          { giftId: "gift_036", probability: 0 },
          { giftId: "gift_037", probability: 0 },
        ],
        // rtp 64.81%
      },
      {
        caseId: "case_10",
        name: "Pepe Хантер",
        image: "https://i.ibb.co/C5QbpMqW/10-2.png",
        price: 25,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_001", probability: 1 },
          { giftId: "gift_037", probability: 0 },
        ],
      },
      {
        caseId: "case_11",
        name: "Durovs cap Хантер",
        image: "https://i.ibb.co/DHG7z7Dk/11-2.png",
        price: 20,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_001", probability: 1 },
          { giftId: "gift_036", probability: 0 },
        ],
      },
      {
        caseId: "case_12",
        name: "Precious Peach Хантер",
        image: "https://i.ibb.co/svJK9nCz/12-2.png",
        price: 15,
        diamondPrice: 0,
        isTopup: false,
        isReferral: false,
        items: [
          { giftId: "gift_001", probability: 1 },
          { giftId: "gift_035", probability: 0 },
        ],
      },
      {
        caseId: "case_13",
        name: "Бесплатный",
        image: "https://i.ibb.co/842WdtP6/21.png",
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
      {
        caseId: "case_14",
        name: "За 500 пополнений",
        image: "https://i.ibb.co/przMx3Q1/20.png",
        price: 0,
        diamondPrice: 0,
        isTopup: true,
        isReferral: false,
        items: [
          { giftId: "gift_007", probability: 0.3 },
          { giftId: "gift_008", probability: 0.25 },
          { giftId: "gift_009", probability: 0.2 },
          { giftId: "gift_010", probability: 0.1 },
          { giftId: "gift_011", probability: 0.1 },
          { giftId: "gift_017", probability: 0.02 },
          { giftId: "gift_018", probability: 0.015 },
          { giftId: "gift_019", probability: 0.01 },
          { giftId: "gift_020", probability: 0.005 },
        ],
      },
      {
        caseId: "case_15",
        name: "За 1000 пополнений",
        image: "https://i.ibb.co/RkXGFBb2/28.png",
        price: 0,
        diamondPrice: 0,
        isTopup: true,
        isReferral: false,
        items: [
          { giftId: "gift_011", probability: 0.25 },
          { giftId: "gift_012", probability: 0.25 },
          { giftId: "gift_013", probability: 0.2 },
          { giftId: "gift_014", probability: 0.15 },
          { giftId: "gift_015", probability: 0.08 },
          { giftId: "gift_016", probability: 0.05 },
          { giftId: "gift_017", probability: 0.01 },
          { giftId: "gift_027", probability: 0.005 },
          { giftId: "gift_028", probability: 0.005 },
        ],
      },
      {
        caseId: "case_16",
        name: "За 5000 пополнений",
        image: "https://i.ibb.co/jvbGBntj/31.png",
        price: 0,
        diamondPrice: 0,
        isTopup: true,
        isReferral: false,
        items: [
          { giftId: "gift_015", probability: 0.2 },
          { giftId: "gift_016", probability: 0.2 },
          { giftId: "gift_017", probability: 0.15 },
          { giftId: "gift_018", probability: 0.15 },
          { giftId: "gift_019", probability: 0.1 },
          { giftId: "gift_020", probability: 0.1 },
          { giftId: "gift_023", probability: 0.05 },
          { giftId: "gift_024", probability: 0.03 },
          { giftId: "gift_031", probability: 0.02 },
        ],
      },
      {
        caseId: "case_17",
        name: "За 10000 пополнений",
        image: "https://i.ibb.co/tpCLQWzM/37.png",
        price: 0,
        diamondPrice: 0,
        isTopup: true,
        isReferral: false,
        items: [
          { giftId: "gift_017", probability: 0.2 },
          { giftId: "gift_023", probability: 0.15 },
          { giftId: "gift_024", probability: 0.1 },
          { giftId: "gift_025", probability: 0.1 },
          { giftId: "gift_026", probability: 0.1 },
          { giftId: "gift_027", probability: 0.08 },
          { giftId: "gift_028", probability: 0.08 },
          { giftId: "gift_029", probability: 0.05 },
          { giftId: "gift_030", probability: 0.05 },
          { giftId: "gift_031", probability: 0.03 },
          { giftId: "gift_032", probability: 0.02 },
          { giftId: "gift_033", probability: 0.02 },
          { giftId: "gift_034", probability: 0.01 },
          { giftId: "gift_035", probability: 0 },
          { giftId: "gift_036", probability: 0 },
          { giftId: "gift_037", probability: 0 },
        ],
      },
      {
        caseId: "case_18",
        name: "15 Рефералов",
        image: "https://i.ibb.co/przMx3Q1/20.png",
        price: 0,
        diamondPrice: 15,
        isTopup: false,
        isReferral: true,
        items: [
          { giftId: "gift_002", probability: 0.475 },
          { giftId: "gift_005", probability: 0.475 },
          { giftId: "gift_010", probability: 0.0245 },
          { giftId: "gift_015", probability: 0.0245 },
          { giftId: "gift_020", probability: 0.001 },
        ],
      },
      {
        caseId: "case_19",
        name: "50 Рефералов",
        image: "https://i.ibb.co/JFbLy7rL/30.png",
        price: 0,
        diamondPrice: 50,
        isTopup: false,
        isReferral: true,
        items: [
          { giftId: "gift_008", probability: 0.95 },
          { giftId: "gift_012", probability: 0.0163 },
          { giftId: "gift_016", probability: 0.0163 },
          { giftId: "gift_021", probability: 0.0164 },
          { giftId: "gift_025", probability: 0.0005 },
          { giftId: "gift_030", probability: 0 },
        ],
      },
      {
        caseId: "case_20",
        name: "150 Рефералов",
        image: "https://i.ibb.co/tpCLQWzM/37.png",
        price: 0,
        diamondPrice: 150,
        isTopup: false,
        isReferral: true,
        items: [
          { giftId: "gift_015", probability: 0.475 },
          { giftId: "gift_018", probability: 0.475 },
          { giftId: "gift_023", probability: 0.0245 },
          { giftId: "gift_027", probability: 0.0245 },
          { giftId: "gift_032", probability: 0 },
          { giftId: "gift_035", probability: 0 },
          { giftId: "gift_037", probability: 0 },
        ],
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
