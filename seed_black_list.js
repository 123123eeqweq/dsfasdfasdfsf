import mongoose from "mongoose";
import dotenv from "dotenv";
import UserBlack from "./models/UserBlack.js";

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

const seedDB = async () => {
  try {
    await connectDB();

    // Очищаем коллекцию
    console.log("Чистим коллекции...");
    await UserBlack.deleteMany({});
    console.log("Коллекция UserBlack очищена!");

    // Блеклист
    const blacklistUserIds = [939751293, 1310421611, 933973693, 2022351879, 318475174, 6843238160, 7749902809, 8052569691, 6914502557, 6985005251, 1399528718, 6498953636, 367858545, 5278920868, 306999494, 5370511010, 808343002, 1877385945, 6968979604, 1671239590].map((id) => ({
      telegramId: String(id).trim(),
    }));

    await UserBlack.insertMany(blacklistUserIds);
    console.log(
      `Черный список закинут в базу, братан! 🎲 Залито ${blacklistUserIds.length} пользователей`
    );

    mongoose.connection.close();
    console.log("База закрыта, всё ок! 😎");
  } catch (error) {
    console.error("Косяк при заливке данных: 😵", error.message);
    process.exit(1);
  }
};

seedDB();
