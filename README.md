# digitalrepublic_backend


# Desafio de criação de uma API desevolvido com as seguintes tecnologias:
- NodeJS;
- ExpressJS;
- MongoDB;
- Insomnia ou Postman.

# Intruções de uso:

Clone o respositório e instale as dependencias com o comando npm install ou acesse o seguinte link com o deploy da aplicação:
https://backend-test-digital-republic.herokuapp.com/
  
A aplicação foi desenvolvida seguindo arquitetura MSC.
Os endpoints que foram desenvolvidos são:
- Método POST com o endpoint '/accounts' para criação de novas contas bancárias.
  Para criação de novos clientes é necessário preencher os seguintes campos:
  ```json
  {
    "name": "tipo string com minimo 2 caracteres",
    "lastName": "tipo string com minimo 2 caracteres",
    "cpf": "tipo number, com 11 numeros",
    "initialDeposit": "tipo number, com minimo de 1"
  }
  ```
 - Método GET com endpoint '/accounts' para acessar todos as contas cadastradas.
 - Método PUT com endpoint '/accounts/:accountNumber' para edição de clientes já existentes. Porém só é possível editar o campo "name" e "lastName".
 - Método DELETE com endpoint '/account/:accountNumber' para deletar um cliente especifico. Só é possivel deletar se a conta bancaria estiver com o saldo zerado.
 
 ----- ENDPOINT DEPOSITS ----
 - Método POST com endpoint '/deposits', para criação de depósitos em contas bancárias existentes.
    Para criação de novos depósitos é necessário preencher os seguintes campos:
    
  ```json
  {
    "destinationAccount": "tipo number, com uma conta bancária já cadastrada",
    "value": "tipo number, entre 1 a 2000",
  }
  ```
  
  - Método GET com endpoint '/deposits' para acessar todos os depositos efetuados.
  - Método GET com endpoint '/deposits/:accountNumber' para acessar todos os depositos efetuados para uma conta especifica.
  
  ----- ENDPOINT TRANSFERS -----
 - Método POST com endpoint '/transfers/:accountNumber', para criação de transferencia bancária entre contas, onde o "accountNumber" é referente a conta que será efetuado o débito.
    Para criação de novas transferencias é necessário preencher os seguintes campos:
  ```json
  {
    "destinationAccount": "tipo number, com uma conta bancária já cadastrada",
    "value": "tipo number, valor minimo de 1",
  }
  "PS: accountNumber também tem que ser uma conta bancaria já existente."
  ```
  
  - Método GET com endpoint '/transfers' para acessar todas as transferencias efetuadas.
  - Método GET com endpoint '/transfers/:id' para acessar umas transferencia especifica.
  - Método GET com endpoint '/transfers/receipts/:accountNumber' acessar todas as transferencias que accountNumber esteja envolvida, tanto um valor recebido quanto um valor enviado.

  # Contato
  Qualquer dúvida ou sugestão, me contate por:
  - Email: gui.couto90@yahoo.com.br
  - LinkedIn: https://www.linkedin.com/in/guicouto90/
