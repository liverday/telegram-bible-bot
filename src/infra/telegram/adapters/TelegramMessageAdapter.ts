import AppError from '@domain/errors/AppError';
import TelegramBot from 'node-telegram-bot-api';
import { TelegramHandler } from '../handlers/TelegramHandler';

export default function adaptTelegramMessageFromHandler(
    bot: TelegramBot,
    handler: TelegramHandler,
): (message: TelegramBot.Message) => void {
    return async (message: TelegramBot.Message) => {
        try {
            const answer = await handler.handle(message);
            if (answer.length) {
                bot.sendMessage(message.chat.id, answer, {
                    parse_mode: 'HTML',
                });
            }
        } catch (err) {
            if (err instanceof AppError) {
                bot.sendMessage(message.chat.id, err.message, {
                    parse_mode: 'HTML',
                });
            }
        }
    };
}
