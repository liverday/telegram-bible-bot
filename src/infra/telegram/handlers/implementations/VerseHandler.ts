import AppError from '@domain/errors/AppError';
import { Reference } from '@domain/Reference';
import adaptBibleMessageToFullMessage from '@infra/adapters/FullBibleMessageAdapter';
import { BibleRepository } from '@modules/bible/repositories/BibleRepository';
import TelegramBot from 'node-telegram-bot-api';
import { TelegramHandler } from '../TelegramHandler';

export default class VerseHandler implements TelegramHandler {
    private bibleRepository: BibleRepository;

    constructor(bibleRepository: BibleRepository) {
        this.bibleRepository = bibleRepository;
    }

    async handle(message: TelegramBot.Message): Promise<string> {
        if (!message.text) return '';

        const [, fullReference] = message.text?.split('/verse');

        const dividedReferenceBySpace = fullReference.trim().split(' ');

        let book;
        let chapter;
        let verse;
        if (dividedReferenceBySpace.length === 0)
            throw AppError.notRecognizedError();
        if (dividedReferenceBySpace.length === 1) {
            [book] = dividedReferenceBySpace;
            chapter = '1';
            verse = '1';
        } else if (dividedReferenceBySpace.length === 2) {
            [book, chapter] = dividedReferenceBySpace;
            verse = '1';
        } else if (dividedReferenceBySpace.length === 3) {
            [book, chapter, verse] = dividedReferenceBySpace;
        } else if (dividedReferenceBySpace.length === 4) {
            book = `${dividedReferenceBySpace[0]} ${dividedReferenceBySpace[1]}`;
            [, , chapter, verse] = dividedReferenceBySpace;
        } else {
            throw AppError.notRecognizedError();
        }

        if (verse.includes('-')) {
            verse = verse.split('-').map(item => parseInt(item, 10));
        } else {
            verse = parseInt(verse, 10);
        }

        const reference: Reference = {
            book,
            chapter: parseInt(chapter, 10),
            verse,
        };

        const { verseWithReferenceMessage } = adaptBibleMessageToFullMessage(
            this.bibleRepository.findMessageByFullReference(reference),
        );

        return verseWithReferenceMessage as string;
    }
}
