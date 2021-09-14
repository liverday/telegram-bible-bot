# Telegram Bible Bot

Esse projeto é um bot no [Telegram](https://telegram.org/) que lê e retorna informações sobre os livros da Bíblia Sagrada.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
## Sumário

- [Motivação](#motivations)
- [Tecnologias e os motivos de escolher elas](#techs-and-motivations)
- [Estrutura do Projeto](#project-structure)
- [Instruções de instalação](#how-to-install)
- [Comandos disponíveis](#available-commands)
- [Guia de contribuição](#contributing)
- [Roadmap](#roadmap)

<h2 id="motivations">Motivação</h2>

Eu me converti ao evangelho aos 18 anos. Nunca me veria no lugar onde estou agora, mas sei que foi Deus que me trouxe até aqui. Uma forma de ser grato a Deus é usar a tecnologia pra propagar a Palavra que me salvou e salvou minha família.

<h2 id="techs-and-motivations">Tecnologias e os motivos de escolher elas</h2>

### Runtime: NodeJS

Por extrema afinidade com aplicações JavaScript/TypeScript para Backend, escolhi o [NodeJS](https://nodejs.org).
### Linguagem: Typescript

Utilizei [Typescript](https://www.typescriptlang.org/) para o desenvolvimento desse bot por familiaridade e afinidade com a linguagem. 

### Banco de Dados: Redis

Temos um comando em específico, o [/daily_thought](#daily_thought), que tem como objetivo buscar um versículo aleatório na Bíblia e retornar ao usuário. 

A fim de que o versículo não se repita antes que o dia mude, armazeno no Redis uma chave com o seguinte formato: `thoughts:{{id_do_usuário}}:{{data_atual}}`. No dia seguinte, o valor armazenado é inválidado, sendo substituido pelo dado que foi processado hoje.

Essa é a única interação que temos atualmente que depende de um contexto de usuário, e esse é o motivo de eu utilizar Redis pra isso, para não ter que precisar criar uma [tabela](https://www.sqlshack.com/an-introduction-to-sql-tables/#:~:text=In%20this%20context%2C%20tables%20are,name%20and%20a%20data%20type.), ou uma [coleção](https://livebook.manning.com/concept/nosql/collection).

### Scrapping: Puppeter

[Puppeteer](https://github.com/puppeteer/puppeteer) deve ser a ferramenta mais conhecida no mundo JavaScript/TypeScript para realizar [Scrapping](https://www.digitalocean.com/community/tutorials/how-to-scrape-a-website-using-node-js-and-puppeteer). 

Ele é extremamente útil pois implementa todo tipo de interação que pode existir entre um usuário e um browser.

Utilizamos ele para buscar novas versões da bíblia e inserir em JSON.

### Containerização: Docker

[Docker](https://docker.com) é uma framework [Open Source](https://www.redhat.com/en/topics/open-source/what-is-open-source) usada para permitir com que aplicações sejam empacotadas em [Containers](https://www.docker.com/resources/what-container), permitindo com que uma aplicação/projeto possa ser executado sem ter que se preocupar com coisas como: Sistema operacional, Biblíotecas, Armazenamento, etc.

Utilizamos Docker para dar poder para o desenvolvimento, permitindo com que qualquer pessoa que tenha Docker instalado em seu computador, consiga executar  e contribuir para nossa aplicação.

<h2 id="project-structure">Estrutura do projeto</h2>

O projeto tem a seguinte estrutura:

```tree
.
└── [4.0K]  src                                 
    ├── [4.0K]  config                          
    ├── [4.0K]  domain                          
    │   └── [4.0K]  errors                     
    ├── [4.0K]  handlers
    │   └── [4.0K]  implementations
    ├── [4.0K]  infra
    │   ├── [4.0K]  adapters
    │   ├── [4.0K]  database
    │   ├── [4.0K]  entrypoint
    │   ├── [4.0K]  providers
    │   │   ├── [4.0K]  bot
    │   │   │   ├── [4.0K]  factories
    │   │   │   └── [4.0K]  implementations
    │   │   └── [4.0K]  cache
    │   │       ├── [4.0K]  factories
    │   │       └── [4.0K]  implementations
    │   └── [4.0K]  utils
    └── [4.0K]  modules
        └── [4.0K]  bible
            └── [4.0K]  repositories
                └── [4.0K]  implementations
```

Onde, respectivamente, equivale a:

- **src**:  Pasta base do projeto, contendo todo o core da aplicação
- **config**: Pasta que contém todos os arquivos de configurações do projeto, todo tipo de configuração que usa variável de ambiente estará aqui
- **domain**: Pasta que mapeia todas as entidades do nosso projeto, a representação dos objetos que compõe as nossas regras de negócio.
- **domain/errors**: Pasta que mapeia todos os erros utilizados na aplicação, com o objetivo de normalizá-los no tratamento de exceções.
- **handlers**: Os casos de uso da aplicação. Todo comando de um bot do telegram precisa de uma função de callback, esse callback será uma função de um Handler presente nessa pasta.
- **infra**: Todo código que de alguma forma envolve uma entidade ou domínio externo. Exemplo: O processo que inicia o bot no telegram.
- **modules**: Os módulos da aplicação divididos por domínios. Contendo: Repositórios de banco de dados, providers e handlers específicos do módulo.

<h2 id="how-to-install">Instruções de instalação</h2>

### Pré requisitos

- [Docker Engine](https://docker.com) instalado na máquina.
- [NodeJS](https://nodejs.org) instalado na sua máquina na versão 16.3.0 ou superior.
- [Yarn](https://yarnpkg.com/) instalado na sua máquina.
- [Um bot](https://core.telegram.org/bots) cadastrado no catálogo do Telegram
- Uma instância de [Redis](https://redis.io/) executada no Docker.

### Executando o Redis

Primeiro, é necessário que você rode uma instância do [Redis](https://redis.io) na sua máquina utilizando Docker:

```sh
docker run --rm -it -p 6379:6379 -d redis
```

Isso vai criar uma instância do [Redis](https://redis.io) que será exposta na porta 6379.

### Configurando as Variáveis de Ambiente

Crie um arquivo chamado `.env` e copie o conteúdo do arquivo `.env.example` para dentro dele. Em seguida, troque o conteúdo do arquivo para algo parecido com isso:

```
BOT_TOKEN={{seu_token_gerado_no_telegram}}

REDIS_HOST=localhost
REDIS_PORT=6379
```

### Instalando as dependências

Para instalar as dependências da aplicação, execute um dos comandos abaixo:

```sh
yarn
# ou
npm install 
```

### Executando a aplicação

Execute o comando abaixo:

```sh
yarn start
```

<h2 id="available-commands">Comandos disponíveis</h2>

- **/books**: Lista todos os livros da bíblia, dividido por velho e novo testamento
- **/chapter {{referencia_do_capitulo}}**: Retorna todos os versículos de um capítulo.  
Exemplo: `/chapter 1 Corintios 13`
- **/verse {{referencia_completa_do_versiculo}}**: Retorna o versículo encontrado.  
Exemplo: `/verse 1 Corintios 13 1`, ou caso queira um intervalo de versículos, utilize traço: `/verse 1 Corintios 13 1-10`
- **/daily_thought**: Retorna um versículo aleatório para o dia em que a soliticação foi feita. Essa referência só é modificada no dia seguinte.

<h2 id="contributing">Guia de contribuição</h2>

Para contribuir com o projeto, veja como [aqui](./CONTRIBUTING.md).

## Roadmap

- Automatização de testes
- Conseguir pesquisar uma citação por texto
- Crawler de novas versões da bíblia
- Comando que diga fatos históricos sobre um determinado texto ou livro
- Curiosidades sobre a bíblia
- Jogos sobre a bíblia: (quiz, encontre a citação, etc)
- Devocionais
- Criar imagens de maneira dinâmica para cada conteúdo retornado do comando `/daily_thought`