from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# Токен бота
TOKEN = "7345865087:AAHrT0gmadvsFz7tZLA9_EkxbYwvulqZW9g"  # Убедись, что заменил на свой токен!

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Приветственное сообщение и клавиатура
    welcome_message = "🎁 Open cases, upgrade your gifts and have fun with all TGRun features!"
    keyboard = [
        [InlineKeyboardButton("Our channel📰", url="https://t.me/tgrun_official")],
        [InlineKeyboardButton("Play🎮", url="https://t.me/tgrun_official_bot?startapp")],
        [InlineKeyboardButton("Support📞", url="https://t.me/TGRUN_support23")],
        [InlineKeyboardButton("Rules📋", web_app={"url": "https://tgrun.xyz/rules.html"})],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(welcome_message, reply_markup=reply_markup)

def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print("Бот запущен и ждёт сообщений...")
    app.run_polling()

if __name__ == '__main__':
    main()
