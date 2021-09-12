import TelegramBot from 'node-telegram-bot-api';
import botConfig from '@config/bot';
import { TelegramHandler } from '@infra/telegram/handlers/TelegramHandler';
import adaptTelegramMessageFromHandler from '@infra/telegram/adapters/TelegramMessageAdapter';
import { BotProvider } from '../BotProvider';

export default class TelegramBotProvider implements BotProvider {
    private bot: TelegramBot;

    constructor(
        private dayThoughtHandler: TelegramHandler,
        private verseHandler: TelegramHandler,
        private booksHandler: TelegramHandler,
        private chapterHandler: TelegramHandler,
    ) {
        this.bot = new TelegramBot(botConfig.token as string);
    }

    receiveMessages(): void {
        this.bot.startPolling({
            polling: true,
        });

        this.startHandlers();
    }

    startHandlers(): void {
        this.bot.onText(
            /\/daily_thought/,
            adaptTelegramMessageFromHandler(this.bot, this.dayThoughtHandler),
        );
        this.bot.onText(
            /\/verse/,
            adaptTelegramMessageFromHandler(this.bot, this.verseHandler),
        );
        this.bot.onText(
            /\/books/,
            adaptTelegramMessageFromHandler(this.bot, this.booksHandler),
        );

        this.bot.onText(
            /\/chapter/,
            adaptTelegramMessageFromHandler(this.bot, this.chapterHandler),
        );
    }
}
