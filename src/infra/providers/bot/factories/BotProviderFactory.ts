import InMemoryBibleRepository from '@modules/bible/repositories/implementations/InMemoryBibleRepository';

import botConfig from '@config/bot';

import DailyThoughtHandler from 'src/handlers/implementations/DailyThoughtHandler';
import VerseHandler from 'src/handlers/implementations/VerseHandler';
import BooksHandler from 'src/handlers/implementations/BooksHandler';
import ChapterHandler from 'src/handlers/implementations/ChapterHandler';
import SearchHandler from 'src/handlers/implementations/SearchHandler';

import makeCacheProvider from '@infra/providers/cache/factories/CacheProviderFactory';

import TelegramBotProvider from '../implementations/TelegramBotProvider';

import { BotProvider } from '../BotProvider';

export default function makeBotProvider(): BotProvider | null {
    const bibleRepository = new InMemoryBibleRepository();
    const cacheProvider = makeCacheProvider();

    if (botConfig.driver === 'telegram') {
        return new TelegramBotProvider(
            new DailyThoughtHandler(bibleRepository, cacheProvider),
            new VerseHandler(bibleRepository),
            new BooksHandler(bibleRepository),
            new ChapterHandler(bibleRepository),
            new SearchHandler(bibleRepository),
        );
    }

    return null;
}
