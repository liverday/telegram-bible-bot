import { adaptBibleMessageToFullMessage } from '@infra/adapters/FullBibleMessageAdapter';
import { CacheProvider } from '@infra/providers/cache/CacheProvider';
import { TelegramHandler }  from '@infra/telegram/handlers/TelegramHandler';
import { BibleRepository } from '@modules/bible/repositories/BibleRepository';
import { format } from 'date-fns';
import TelegramBot from 'node-telegram-bot-api';

export class DailyThoughtHandler implements TelegramHandler {
    constructor(
        private bibleRepository: BibleRepository,
        private cacheProvider: CacheProvider
    ) { }

    async handle(message: TelegramBot.Message): Promise<string> {
        const { id } = message.chat
        const currentDate = format(new Date(), 'yyyy-MM-dd');
        const cachePrefix = `thoughts:${id}`;
        const cacheKey = `${cachePrefix}:${currentDate}`

        const cachedThought = await this.cacheProvider.get<string>(cacheKey);

        if (cachedThought) {
            return cachedThought;
        }

        this.cacheProvider.removeAll(cachePrefix)

        const { verseWithReferenceMessage }= adaptBibleMessageToFullMessage(this.bibleRepository.findDailyThought())

        this.cacheProvider.put(cacheKey, verseWithReferenceMessage)

        return verseWithReferenceMessage!
    }
}