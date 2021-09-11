import TelegramBot from 'node-telegram-bot-api';

export interface TelegramHandler {
    handle(message: TelegramBot.Message): Promise<string>;
}
