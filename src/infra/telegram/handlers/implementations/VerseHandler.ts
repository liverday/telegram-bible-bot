import { Reference } from "@domain/Reference";
import { adaptBibleMessageToFullMessage } from "@infra/adapters/FullBibleMessageAdapter";
import { BibleRepository } from "@modules/bible/repositories/BibleRepository";
import TelegramBot from "node-telegram-bot-api";
import { TelegramHandler } from "../TelegramHandler";

export class VerseHandler implements TelegramHandler {
    constructor(
        private bibleRepository: BibleRepository
    ) { }

    async handle(message: TelegramBot.Message): Promise<string> {
        const [, fullReference] = message.text!.split('/verse')

        const dividedReferenceBySpace = fullReference.trim().split(' ');

        let book, chapter, verse
        if (dividedReferenceBySpace.length == 0)
            return 'Desculpe, não entendi. Envie a referencia completa, separada com espaços, conforme exemplo: Gn 4 2';
        else if (dividedReferenceBySpace.length == 1)
            book = dividedReferenceBySpace[0], chapter = '1', verse = '1'
        else if (dividedReferenceBySpace.length == 2) {
            [book, chapter] = dividedReferenceBySpace, verse = '1'
        } else if (dividedReferenceBySpace.length == 3) {
            [book, chapter, verse] = dividedReferenceBySpace
        } else if (dividedReferenceBySpace.length == 4) {
            book = `${dividedReferenceBySpace[0]} ${dividedReferenceBySpace[1]}`, 
            chapter = dividedReferenceBySpace[2], verse = dividedReferenceBySpace[3]
        } else {
            return 'Desculpe, não entendi. Envie a referencia completa, separada com espaços, conforme exemplo: Gn 4 2';
        }

        if (verse.includes('-')) {
            verse = verse.split('-').map(item => parseInt(item))
        } else {
            verse = parseInt(verse)
        }

        const reference: Reference = {
            book,
            chapter: parseInt(chapter),
            verse
        }

        const { verseWithReferenceMessage } = adaptBibleMessageToFullMessage(this.bibleRepository.findMessageByFullReference(reference))

        return verseWithReferenceMessage!
    }
}