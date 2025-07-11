import dotenv from "dotenv";
import crypto from "crypto";
import { isValid } from "@telegram-apps/init-data-node";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Проверяем, что заголовок Authorization существует
  //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //     return res.status(401).json({
  //       message: "Ошибка авторизации",
  //     });
  //   }

  // Извлекаем initData из заголовка (удаляем "Bearer ")
  let initData = authHeader.replace("Bearer ", "");

  //   if (initData === "none") {
  //     return res.status(401).json({
  //       message: "Ошибка авторизации",
  //     });
  //   }

  //   if (initData === process.env.SECRET_KEY) {
  //     next();
  //     return;
  //   }

  const botToken = process.env.TELEGRAM_MAIN_BOT_TOKEN;

  try {
    initData = JSON.parse(initData);
  } catch (error) {
    console.error("Ошибка парсинга initData:", error);
    return res.status(400).json({ message: "Неверный формат данных" });
  }

  console.log(initData);

  // Получаем данные из тела запроса
  const [data_check_string, hash] = initData;

  // Проверяем, что данные получены
  if (!data_check_string || !hash) {
    return res
      .status(400)
      .json({ success: false, message: "Недостаточно данных" });
  }

  console.log(data_check_string);
  console.log(hash);

  try {
    // Создаем секретный ключ
    const secret_key = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    // Вычисляем хэш от data_check_string с использованием секретного ключа
    const check_hash = crypto
      .createHmac("sha256", secret_key)
      .update(data_check_string)
      .digest("hex");

    console.log(new URLSearchParams(initData));

    console.log(isValid(initData + "hash=" + hash, botToken));

    // Сравниваем хэши
    if (
      crypto.timingSafeEqual(
        Buffer.from(check_hash, "hex"),
        Buffer.from(hash, "hex")
      )
    ) {
      console.log("Проверка initData прошла успешно");
      return res.json({ success: true }); // Пользователь прошел проверку
    } else {
      console.log("Проверка initData не прошла");
      return res.json({ success: false }); // Пользователь не прошел проверку
    }
  } catch (error) {
    console.error("Ошибка проверки initData:", error);
    return res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};

// import {
//   validateAndParseInitData,
//   getBotTokenSecretKey,
// } from "@gramio/init-data";
// import crypto from "crypto";

// Middleware для проверки Telegram initData
// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers["authorization"];

//   // Проверяем, что заголовок Authorization существует
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       message: "Ошибка авторизации",
//     });
//   }

//   // Извлекаем initData из заголовка (удаляем "Bearer ")
//   let initData = authHeader.replace("Bearer ", "");

//   if (initData === process.env.SECRET_KEY) {
//     next();
//     return;
//   }

//   jwt.verify(token, config.jwtSecret, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });

//   initData = JSON.parse(initData);
//   console.log(initData);

// Проверяем, что initData не пустой
//   if (!initData) {
//     return res.status(401).json({ message: "Ошибка авторизации" });
//   }

//   try {
// Проверяем валидность initData
// const botToken = process.env.TELEGRAM_MAIN_BOT_TOKEN;
// const secretKey = getBotTokenSecretKey(botToken);

// const result = validateAndParseInitData(initData, secretKey);
// const result = verifyTelegramInitData(initData);

// if (!result) {
//   return res.status(401).json({ message: "Невалидная авторизация" });
// }

// req.user = result.user; // Сохраняем данные пользователя в req.user для использования в маршрутах

//     next();
//   } catch (error) {
//     console.error("Ошибка проверки initData:", error);
//     return res.status(401).json({ message: "Ошибка проверки" });
//   }
// };

// function verifyTelegramInitData(initData) {
//   //   return initData && initData.user.id;
//   return true;
// }

// function verifyTelegramInitData(initData) {
//   try {
//     // Ваш секретный ключ, полученный от @BotFather
//     const botToken = String(process.env.TELEGRAM_MAIN_BOT_TOKEN).trim(); // Замените на ваш токен бота
//     const secretKey = crypto
//       .createHmac("sha256", "WebAppData")
//       .update(botToken)
//       .digest();

//     // Формируем dataCheckString
//     const dataCheckString = Object.keys(initData)
//       .filter((key) => key !== "hash") // Игнорируем hash и signature
//       .sort() // Сортируем ключи по алфавиту
//       .map((key) => {
//         if (key === "user") {
//           // Сериализуем user в JSON без пробелов
//           return `${key}=${JSON.stringify(initData[key], null, 0)}`;
//         }
//         return `${key}=${initData[key]}`;
//       })
//       .join("\n");

//     // Вычисляем HMAC-SHA256
//     const computedHash = crypto
//       .createHmac("sha256", secretKey)
//       .update(dataCheckString)
//       .digest("hex");

//     // Логи для диагностики
//     console.log("dataCheckString:", dataCheckString);
//     console.log("Computed hash:", computedHash);
//     console.log("Received hash:", initData.hash);

//     return computedHash === initData.hash;
//   } catch (error) {
//     console.error("Error verifying initData:", error);
//     return false;
//   }
// }

export default authMiddleware;
