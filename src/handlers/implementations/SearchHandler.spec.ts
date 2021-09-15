import { NOT_FOUND_RESULTS_MESSAGE } from '@infra/utils/bible';
import { BibleRepository } from '@modules/bible/repositories/BibleRepository';
import InMemoryBibleRepository from '@modules/bible/repositories/implementations/InMemoryBibleRepository';
import { Message } from 'node-telegram-bot-api';
import SearchHandler from './SearchHandler';

let bibleRepository: BibleRepository;
let searchHandler: SearchHandler;

describe('SearchHandler', () => {
    beforeAll(() => {
        bibleRepository = new InMemoryBibleRepository();
        searchHandler = new SearchHandler(bibleRepository);
    });

    it('should be able to search "o amor é paciente"', async () => {
        const command = '/search o amor é paciente';

        const result = await searchHandler.handle({ text: command } as Message);

        expect(result).toEqual(expect.stringContaining('o amor é paciente'));
    });

    it('should be able to return a default message when search is invalid', async () => {
        const command = '/search abcdefg';

        const result = await searchHandler.handle({ text: command } as Message);

        expect(result).toBe(NOT_FOUND_RESULTS_MESSAGE);
    });

    it('should be able to return an empty message when not text was sent', async () => {
        const command = '';

        const result = await searchHandler.handle({ text: command } as Message);

        expect(result).toBe('');
    });
});
