import AppError from '@domain/errors/AppError';
import TelegramBot from 'node-telegram-bot-api';
import MessageHandler from '@domain/MessageHandler';

export default function adaptTelegramMessageFromHandler(
    bot: TelegramBot,
    handler: MessageHandler,
): (message: TelegramBot.Message) => void {
    return async (message: TelegramBot.Message) => {
        try {
            const answer = await handler.handle(message);
            if (answer.length) {
                const chunks = answer.match(/([^]{1,4096}\B)/g);

                chunks?.forEach((chunk, index) => {
                    setTimeout(() => {
                        bot.sendMessage(message.chat.id, chunk, {
                            parse_mode: 'HTML',
                        });
                    }, index * 200);
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
