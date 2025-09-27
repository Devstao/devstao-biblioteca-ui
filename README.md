# UI - Biblioteca do Devstão

## Objetivo do projeto
A ideia do projeto é criar um sistema de upload e download de arquivos PDFs (como livros) de forma simplificada para introduzir iniciantes na área de desenvolvimento focado na WEB, por esse motivo a stack é extremamente simplificada, contendo apenas HTML/CSS/JS.
Este repositório tem como objetivo manter o controle de versionamento da UI somente.

## Instalação
Clone o projeto para a pasta do apache ou para outra pasta desejada e inicie o serviço do webserver. Também é possível inicial o projeto através do PHP:

```bash
php -S localhost:8080
```

## Processo de Contribuição
Vamos seguir o processo de contribuição via fork e caso necessário, alterar para adicionar colaboradores. Passo a passo:
1. Dentro deste repositório, clique no botão **"Fork"** no canto superior direito, criando uma cópia **completa** desse repositório na sua conta (ex: `github.com/usuario-b/devstao-biblioteca-ui`.
2. Clone o **fork** para a máquina local:
```bash
git clone https://github.com/usuario-b/devstao-biblioteca-ui.git
cd devstao-biblioteca-ui 
```
3. Adicione o seu repositório original como um **"upstream remote"** (para sincronizar com as atualizações futuras).

```bash
git remote add upstream https://github.com/usuario-b/devstao-biblioteca-ui  
```
4. Quando for trabalhar em alguma tarefa nova (fix ou feature), crie uma nova branch:

```bash
git checkout -b feat/add-home-page
```
5. Após finalizar alguma(s) mudança(s), adicione todos os arquivos e faça o commit:
```bash
git add .  
git commit -m "feat: Adicionado funcionalidade Xpto"  
```

6. Faça o push das alterações:
```bash
git push origin feat/add-home-page
```
7. No GitHub, você verá uma opção para criar um **"Pull Request"** (PR) do seu fork para o seu repositório original. Clique e descreva as mudanças.

## Convenções de commit
Sempre que for realizar um commit, siga as convenções de commit:

-   `fix`  - Commits do tipo fix indicam que seu trecho de código commitado está solucionando um problema (bug fix), (se relaciona com o PATCH do versionamento semântico).
    
-   `feat`- Commits do tipo feat indicam que seu trecho de código está incluindo um novo recurso (se relaciona com o MINOR do versionamento semântico).
    
-   `docs`  - Commits do tipo docs indicam que houveram mudanças na documentação, como por exemplo no Readme do seu repositório. (Não inclui alterações em código).
    
-   `style`  - Commits do tipo style indicam que houveram alterações referentes a formatações de código, semicolons, trailing spaces, lint... (Não inclui alterações em código).
    
-   `refactor`  - Commits do tipo refactor referem-se a mudanças devido a refatorações que não alterem sua funcionalidade, como por exemplo, uma alteração no formato como é processada determinada parte da tela, mas que manteve a mesma funcionalidade, ou melhorias de performance devido a um code review.
    
-   `build`  - Commits do tipo build são utilizados quando são realizadas modificações em arquivos de build e dependências.
    
-   `test`  - Commits do tipo test são utilizados quando são realizadas alterações em testes, seja criando, alterando ou excluindo testes unitários. (Não inclui alterações em código)
    
-   `chore`  - Commits do tipo chore indicam atualizações de tarefas de build, configurações de administrador, pacotes... como por exemplo adicionar um pacote no gitignore. (Não inclui alterações em código)

Como a ideia do projeto é simular um projeto real o mais próximo possível, 

Referências:
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Padrões de Commits (Commit Patterns)](https://dev.to/renatoadorno/padroes-de-commits-commit-patterns-41co)

## Convenções de branch
Para melhor indicar a feature/fix que será trabalhada, assim como em diversos projetos a fora, vamos padronizar da seguinte forma:
`tipo-alteração/pequeno-titulo`
Exemplo:
`feat/add-i18n`

## Fluxo de desenvolvimento das branchs
Vamos seguir o seguinte fluxo simples de desenvolvimento das branchs:

main -> dev -> branch-feature

A branch de produção será a main, toda versão testada e finalizada será deixada aqui.
A branch de desenvolvimento geral, para testes e afins, ficará nesse branch (dev).
Qualquer outra tarefa será realizada na sua própria branch e entrará como pull request para a dev.

Fluxo para a prod:

branch-feature -> dev -> main
