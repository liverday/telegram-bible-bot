import { Reference } from './Reference';

export interface BibleMessage {
    reference: Reference;
    verseMessage: string;
    verseWithReferenceMessage?: string;
}
