import TelegramBot from 'node-telegram-bot-api';

export default interface MessageHandler {
    handle(message: TelegramBot.Message): Promise<string>;
}
