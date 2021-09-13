import AppError from '@domain/errors/AppError';
import adaptBibleMessageToFullMessage from '@infra/adapters/BibleMessageToFullVerseWithReferenceAdapter';
import { BibleRepository } from '@modules/bible/repositories/BibleRepository';
import { Message } from 'node-telegram-bot-api';
import MessageHandler from '@domain/MessageHandler';

export default class ChapterHandler implements MessageHandler {
    private bibleRepository: BibleRepository;

    constructor(bibleRepository: BibleRepository) {
        this.bibleRepository = bibleRepository;
    }

    async handle(message: Message): Promise<string> {
        const [, reference] = (message.text as string).split('/chapter');

        const dividedReferenceBySpace = reference.trim().split(' ');

        const referenceLen = dividedReferenceBySpace.length;

        if (![2, 3].includes(referenceLen))
            throw AppError.notRecognizedChapterError();

        let book;
        let chapter;

        if (referenceLen === 2) {
            [book, chapter] = dividedReferenceBySpace;
        } else {
            [book, chapter] = [
                `${dividedReferenceBySpace[0]} ${dividedReferenceBySpace[1]}`,
                dividedReferenceBySpace[2],
            ];
        }

        const { verseWithReferenceMessage } = adaptBibleMessageToFullMessage(
            this.bibleRepository.findVersesByChapterAndBook(book, chapter),
        );

        return verseWithReferenceMessage as string;
    }
}
