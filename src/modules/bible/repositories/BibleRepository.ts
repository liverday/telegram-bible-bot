import { Book } from "@domain/Book";
import { Reference } from "@domain/Reference";
import { BibleMessage } from "@domain/BibleMessage";

export interface BibleRepository {
    findBooks(): Book[];
    findDailyThought(): BibleMessage;
    findMessageByFullReference(reference: Reference): BibleMessage;
}