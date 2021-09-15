import { Book } from '@domain/Book';
import { Reference } from '@domain/Reference';
import { BibleMessage } from '@domain/BibleMessage';

export interface BibleRepository {
    findBooks(): Book[];
    findBookByNameOrAbbrev(nameOrAbbrev: string): Book | undefined;
    findDailyThought(): BibleMessage;
    findMessageByFullReference(reference: Reference): BibleMessage;
    findVersesByChapterAndBook(book: string, chapter: string): BibleMessage;
    searchVersesByText(search: string): BibleMessage[];
}
