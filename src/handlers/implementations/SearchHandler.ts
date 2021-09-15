import MessageHandler from '@domain/MessageHandler';
import adaptBibleMessagesToSearchResult from '@infra/adapters/BibleMessagesToSearchResultAdapter';
import adaptBibleMessageToFullMessage from '@infra/adapters/BibleMessageToFullVerseWithReferenceAdapter';
import { BibleRepository } from '@modules/bible/repositories/BibleRepository';
import { Message } from 'node-telegram-bot-api';

export default class SearchHandler implements MessageHandler {
    private bibleRepository: BibleRepository;

    constructor(bibleRepository: BibleRepository) {
        this.bibleRepository = bibleRepository;
    }

    async handle(message: Message): Promise<string> {
        if (!message.text) return '';

        const [, search] = message.text.split('/search');

        const trimmedSearch = search.trim();

        const searchResults =
            this.bibleRepository.searchVersesByText(trimmedSearch);

        return adaptBibleMessagesToSearchResult(
            trimmedSearch,
            searchResults.map(result => adaptBibleMessageToFullMessage(result)),
        );
    }
}
