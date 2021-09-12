import {
    NEW_TESTAMENT_CHAPTER_RANGE,
    OLD_TESTAMENT_CHAPTER_RANGE,
} from '@infra/utils/bible';
import { BibleRepository } from '@modules/bible/repositories/BibleRepository';
import { Message } from 'node-telegram-bot-api';
import { TelegramHandler } from '../TelegramHandler';

export default class BooksHandler implements TelegramHandler {
    private bibleRepository: BibleRepository;

    constructor(bibleRepository: BibleRepository) {
        this.bibleRepository = bibleRepository;
    }

    async handle(message: Message): Promise<string> {
        const books = this.bibleRepository.findBooks();
        const [oldTestamentStartSlice, oldTestamentEndSlice] =
            OLD_TESTAMENT_CHAPTER_RANGE;

        const [newTestamentStartSlice, newTestamentEndSlice] =
            NEW_TESTAMENT_CHAPTER_RANGE;

        const oldTestamentSlice = books.slice(
            oldTestamentStartSlice,
            oldTestamentEndSlice,
        );

        const newTestamentSlice = books.slice(
            newTestamentStartSlice,
            newTestamentEndSlice,
        );

        return `<strong>Velho testamento:</strong>

${oldTestamentSlice.map(({ name }) => name).join('\n')}

<strong>Novo testamento:</strong>

${newTestamentSlice.map(({ name }) => name).join('\n')}
`;
    }
}
