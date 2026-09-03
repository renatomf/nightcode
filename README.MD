NightCode
A terminal-based AI coding agent.

Plan, chat, and build inside your local project with a Bun-powered CLI, Hono API, Prisma ORM, Clerk auth, and AI SDK streaming.


Bun  OpenTUI  React  Hono  Neon  Clerk  Polar  CodeRabbit  Sentry  Railway

## Sobre o projeto

**Nightcode** é uma aplicação que reproduz a experiência de um editor/IDE de código moderno, com um agente de IA integrado para ajudar o desenvolvedor a escrever, revisar e entender código mais rápido. Este README foi construído seguindo o mesmo padrão usado no projeto irmão **[nextjs-polaris](https://github.com/renatomf/nextjs-polaris)**.

> ⚠️ **Nota de transparência:** não consegui acessar automaticamente o conteúdo do repositório `renatomf/nightcode` (o GitHub retornou 404 para o meu acesso, mesmo com o repositório público). Por isso, esta versão do README é um **template estrutural** — a seção de arquitetura, stack e funcionalidades abaixo está com placeholders para você preencher com os dados reais (`package.json`, pastas do projeto, etc.). Assim que você colar essas informações aqui no chat, eu atualizo o arquivo com os detalhes exatos do seu projeto.

## Principais funcionalidades

- [ ] _Preencher: ex. editor de código com syntax highlighting_
- [ ] _Preencher: ex. agente de IA para chat/geração de código_
- [ ] _Preencher: ex. autenticação de usuários_
- [ ] _Preencher: ex. persistência de projetos/arquivos_
- [ ] _Preencher: ex. execução de código / preview em tempo real_

## Tech Stack

| Camada | Tecnologia |
|---|---|
| Framework | _preencher (ex. Next.js, Vite, etc.)_ |
| UI | _preencher_ |
| Editor de código | _preencher (ex. CodeMirror, Monaco)_ |
| IA | _preencher (ex. AI SDK + provider)_ |
| Backend / dados | _preencher_ |
| Autenticação | _preencher_ |
| Linguagem | _preencher_ |

## Arquitetura

```mermaid
flowchart TB
    User(["Usuário"])

    subgraph Client["Frontend"]
        UI["Interface / Editor de Código"]
        Store["Estado da aplicação"]
        UI --- Store
    end

    Auth[["Autenticação"]]
    Backend[("Backend / Banco de dados")]
    Jobs[["Processamento em background"]]
    AI["Agente de IA"]
    Monitor[["Monitoramento de erros"]]

    User --> UI
    UI -- login/sessão --> Auth
    UI -- leitura/escrita de dados --> Backend
    UI -- prompts do agente --> AI

    Backend -- dispara eventos --> Jobs
    Jobs -- executa tarefas --> AI

    UI -.erros/traces.-> Monitor
    Backend -.erros/traces.-> Monitor
```

**Como funciona o fluxo (placeholder — ajustar com a implementação real):**

1. O usuário interage com a interface do editor no navegador.
2. A camada de **autenticação** protege sessões e rotas.
3. O **backend** persiste dados (arquivos, projetos, histórico) e sincroniza com o cliente.
4. Tarefas mais pesadas ou assíncronas são delegadas a um **processador em background**.
5. O **agente de IA** processa prompts do usuário e pode acionar ferramentas externas.
6. Erros e métricas de todas as camadas são reportados a uma ferramenta de **monitoramento**.

> Assim que você me passar o `package.json` e a estrutura de pastas reais do `nightcode`, eu troco esse diagrama genérico por um específico — com os nomes reais das tecnologias e as setas refletindo o fluxo de dados real do projeto.

## Estrutura do projeto

```
nightcode/
├── (preencher com as pastas reais do repositório)
├── package.json
└── README.md
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor em modo produção |
| `npm run lint` | Roda o linter no projeto |

## Roadmap

- [ ] Preencher stack e dependências reais
- [ ] Detalhar rotas/telas principais
- [ ] Documentar o fluxo do agente de IA
- [ ] Adicionar testes automatizados
- [ ] Definir licença do projeto
