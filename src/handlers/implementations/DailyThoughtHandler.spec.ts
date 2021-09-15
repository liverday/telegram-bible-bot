import { CacheProvider } from '@infra/providers/cache/CacheProvider';
import { BibleRepository } from '@modules/bible/repositories/BibleRepository';

import FakeCakeProvider from '@infra/providers/cache/fakes/FakeCacheProvider';
import InMemoryBibleRepository from '@modules/bible/repositories/implementations/InMemoryBibleRepository';
import { Message } from 'node-telegram-bot-api';
import DailyThoughtHandler from './DailyThoughtHandler';

let bibleRepository: BibleRepository;
let fakeCacheProvider: CacheProvider;
let dailyThoughtHandler: DailyThoughtHandler;

describe('DailyThoughtHandler', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCakeProvider();
        bibleRepository = new InMemoryBibleRepository();
        dailyThoughtHandler = new DailyThoughtHandler(
            bibleRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to get a daily though', async () => {
        const command = '/daily_thought';

        const result = await dailyThoughtHandler.handle({
            chat: {
                id: 1,
            },
            text: command,
        } as Message);

        expect(result).not.toBe('');
    });

    it('should be able to return a cached value when called twice', async () => {
        const command = '/daily_thought';
        const chatId = 1;

        const cachePut = jest.spyOn(fakeCacheProvider, 'put');
        const cacheGet = jest.spyOn(fakeCacheProvider, 'get');

        const resultOne = await dailyThoughtHandler.handle({
            chat: {
                id: chatId,
            },
            text: command,
        } as Message);

        const resultTwo = await dailyThoughtHandler.handle({
            chat: {
                id: chatId,
            },
            text: command,
        } as Message);

        expect(cachePut).toHaveBeenCalled();
        expect(cacheGet).toHaveBeenCalledTimes(2);
        expect(resultOne).toEqual(resultTwo);
    });
});
