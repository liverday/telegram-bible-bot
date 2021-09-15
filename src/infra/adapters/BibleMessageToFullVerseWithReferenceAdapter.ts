import { BibleMessage } from '@domain/BibleMessage';

export default function adaptBibleMessageToFullMessage(
    bibleMessage: BibleMessage,
): BibleMessage {
    const { reference } = bibleMessage;

    let verseAsString = '';

    if (Array.isArray(reference.verse)) {
        const [start, end] = reference.verse;
        verseAsString = `${start}-${end}`;
    } else {
        verseAsString = reference.verse.toString();
    }

    bibleMessage.verseWithReferenceMessage = `${reference.book} ${
        reference.chapter
    }:${verseAsString} (${reference.version.toUpperCase()}) \n${
        bibleMessage.verseMessage
    }`;

    return bibleMessage;
}
