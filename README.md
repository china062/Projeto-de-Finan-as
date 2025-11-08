<p style="font-size: 24px;">Sistema de Finanças (PROJETO PESSOAL)</p>

Tendo em conta que sou um programador iniciante, estou realizando esse projeto para entender algumas sintaxes de JavaScript e como realizar a implementação real de um banco de dados simulando
um "dia a dia" de um programa verdadeiro.

para inicialiar a aplicação é necessario dar um:
node server.js (na pasta do projeto)

A primeira parte foi um commit com o inicial do sistema, implementei as seguintes funções:

-Tela de Login

-Tela de Cadastro com method POST para o banco de dados, alem de uma criptografia de senha da biblioteca CryptoJS (Message-Digest Algorithm 5)

-Banco de Dados local (sqlite, sqlite3)

Segunda parte (segundo commit) adicionei as seguintes funções/tabelas:

-Tela principal da finança com valor do saldo atual, valor do saldo de entrada total adicionado e o valor total de saida, além de mostrar as ultimas transações feitas (seja entrada ou saida)

-Tela de Registrar Gastos para o usuario (depositar ou retirar saldo)

-Tela de Perfil aonde mostra apenas uma mensagem de boas vindas com um botão que redireciona para a pagina de registrar saldo e um botão de sair da conta

-No banco de dados criei duas tabela a de usuarios que contem todas as informações e uma tabela de transações aonde tem um relacionamento para cada usuario (então cada conta tem um relacionamento com suas transações, no caso cada conta possui um valor.

No momento é isso, provavelmente irei tentar fazer melhorias no futuro.
