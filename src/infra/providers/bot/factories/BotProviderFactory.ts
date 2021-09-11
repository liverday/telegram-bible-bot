import { BotProvider } from "../BotProvider";
import { TelegramBotProvider } from "../implementations/TelegramBotProvider";
import { InMemoryBibleRepository } from "@modules/bible/repositories/implementations/InMemoryBibleRepository";

import botConfig from '@config/bot'

import { DailyThoughtHandler } from "@infra/telegram/handlers/implementations/DailyThoughtHandler";
import { VerseHandler } from "@infra/telegram/handlers/implementations/VerseHandler";
import { makeCacheProvider } from "@infra/providers/cache/factories/CacheProviderFactory";

export function makeBotProvider(): BotProvider | null {
    const bibleRepository = new InMemoryBibleRepository();
    const cacheProvider = makeCacheProvider();

    if (botConfig.driver == 'telegram') {
        return new TelegramBotProvider(
            new DailyThoughtHandler(bibleRepository, cacheProvider),
            new VerseHandler(bibleRepository)
        )
    }

    return null;
}