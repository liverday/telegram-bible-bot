import { Book } from "@domain/Book";
import { BibleRepository } from "../BibleRepository";
import { getRandom } from "@infra/utils/random";

import bibleData from '@infra/database/data.json';
import { Reference } from "@domain/Reference";
import { BibleMessage } from "@domain/BibleMessage";

const bibleDataAsType = bibleData as Book[]

export class InMemoryBibleRepository implements BibleRepository {
    findBooks(): Book[] {
        return bibleDataAsType;
    }

    findDailyThought(): BibleMessage {
        const randomBook = getRandom(bibleDataAsType.length - 1)
        const book = bibleDataAsType[randomBook]
        const randomChapter = getRandom(book.chapters.length - 1)
        const verses = book.chapters[randomChapter]
        const randomVerse = getRandom(verses.length - 1)

        return {
            reference: {
                book: book.name,
                chapter: randomChapter,
                verse: randomVerse,
            },
            verseMessage: verses[randomVerse]
        }
    }

    findMessageByFullReference(reference: Reference): BibleMessage {
        const book = bibleDataAsType.find(book => {
            return book.name.toLocaleLowerCase() === reference.book.toLocaleLowerCase() || book.abbrev === reference.book.toLocaleLowerCase()
        })

        if (!book) {
            throw new Error('Referência não encontrada')
        }

        const chapter = book.chapters[reference.chapter - 1]
        let verses: string[] = [];
        if (Array.isArray(reference.verse)) {
            const [start, end] = reference.verse
            verses = verses.concat(chapter.slice(start - 1, end))
        } else {
            verses = [chapter[reference.verse as number]]
        }

        return {
            reference: {
                book: book.name,
                chapter: reference.chapter,
                verse: reference.verse
            },
            verseMessage: verses.map((verse, index) => {
                let result = ''

                if (Array.isArray(reference.verse)) {
                    result += `<strong>${reference.verse[0] + index}:</strong> `
                }

                result += `${verse}`

                return result;
            }).join('\n')
        }
    }
}