import { Book } from '@domain/Book';
import getRandom from '@infra/utils/random';

import bibleData from '@infra/database/data.json';
import { Reference } from '@domain/Reference';
import { BibleMessage } from '@domain/BibleMessage';
import AppError from '@domain/errors/AppError';
import { BibleRepository } from '../BibleRepository';

export default class InMemoryBibleRepository implements BibleRepository {
    private parsedBibleData: Book[];

    constructor() {
        this.parsedBibleData = bibleData as Book[];
    }

    findBooks(): Book[] {
        return this.parsedBibleData;
    }

    findDailyThought(): BibleMessage {
        const randomBook = getRandom(this.parsedBibleData.length - 1);
        const book = this.parsedBibleData[randomBook];
        const randomChapter = getRandom(book.chapters.length - 1);
        const verses = book.chapters[randomChapter];
        const randomVerse = getRandom(verses.length - 1);

        return {
            reference: {
                book: book.name,
                chapter: randomChapter,
                verse: randomVerse,
            },
            verseMessage: verses[randomVerse],
        };
    }

    findMessageByFullReference(reference: Reference): BibleMessage {
        const book = this.parsedBibleData.find(bookItem => {
            return (
                bookItem.name.toLocaleLowerCase() ===
                    reference.book.toLocaleLowerCase() ||
                bookItem.abbrev === reference.book.toLocaleLowerCase()
            );
        });

        if (!book) {
            throw AppError.notRecognizedError();
        }

        const chapter = book.chapters[reference.chapter - 1];

        if (!chapter) {
            throw AppError.notRecognizedError();
        }

        let verses: string[] = [];
        if (Array.isArray(reference.verse)) {
            const [start, end] = reference.verse;
            verses = verses.concat(chapter.slice(start - 1, end));
        } else {
            const verse = chapter[reference.verse as number];
            if (!verse) throw AppError.notRecognizedError();

            verses = [verse];
        }

        return {
            reference: {
                book: book.name,
                chapter: reference.chapter,
                verse: reference.verse,
            },
            verseMessage: verses
                .map((verse, index) => {
                    let result = '';

                    if (Array.isArray(reference.verse)) {
                        result += `<strong>${
                            reference.verse[0] + index
                        }:</strong> `;
                    }

                    result += `${verse}`;

                    return result;
                })
                .join('\n'),
        };
    }
}
