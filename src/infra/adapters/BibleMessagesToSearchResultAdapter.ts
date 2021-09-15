import { BibleMessage } from '@domain/BibleMessage';
import {
    MAX_SEARCH_TEXT_RESULT,
    NOT_FOUND_RESULTS_MESSAGE,
} from '@infra/utils/bible';

export default function adaptBibleMessagesToSearchResult(
    search: string,
    bibleMessages: BibleMessage[],
): string {
    if (!bibleMessages.length) return NOT_FOUND_RESULTS_MESSAGE;

    let result = '';

    if (bibleMessages.length > MAX_SEARCH_TEXT_RESULT) {
        result += `Foram encontrados <strong>${bibleMessages.length} resultados</strong> para "${search}", refine sua busca para mostrar o conteúdo de versículos.`;
        return result;
    }

    result += `<strong>Foram encontrados os seguintes resultados para "${search}"</strong>:

${bibleMessages
    .map(({ verseWithReferenceMessage }) => verseWithReferenceMessage)
    .join('\n\n')}`;

    return result;
}
