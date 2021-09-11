import 'dotenv/config';

import { makeBotProvider } from "@infra/providers/bot/factories/BotProviderFactory";

function bootstrap() {
    const botProvider = makeBotProvider();

    // this should stay alive forever
    botProvider?.receiveMessages();
}

bootstrap();
