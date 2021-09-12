export default class AppError {
    message: string;

    constructor(message: string) {
        this.message = message;
    }

    static notRecognizedError(): AppError {
        return new AppError(
            'Desculpe, não entendi 😩. Envie a referencia completa, separada com espaços, conforme exemplo: Gênesis 4 2',
        );
    }

    static notRecognizedChapterError(): AppError {
        return new AppError(
            'Desculpe, não entendi 😩. Envie a referencia completa, separada com espaços, conforme exemplo: Gênesis 4',
        );
    }
}
