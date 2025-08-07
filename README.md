# 🐾 PetCare SaaS - Backend

Este projeto é uma API RESTful para gerenciamento de pet shops e clínicas veterinárias, desenvolvida com **NestJS**, **Prisma**, **Swagger** e **JWT Authentication**.
Usa API do mercado pago para assinatura do plano.

---

## 🚀 Funcionalidades

- 📅 Agendamento de consultas
- 💉 Histórico de vacinas
- 🔔 Alertas para retorno de vacinas e consultas
- 📦 Controle de estoque de produtos e vacinas
- 🐶 Gerenciamento de pets
- 👥 Cadastro e login de usuários
- 🔐 Rotas protegidas com JWT

---

## 📦 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Swagger (OpenAPI)](https://swagger.io/)
- [JWT - JSON Web Token](https://jwt.io/)
- [PostgreSQL](https://www.postgresql.org/) (ou outro banco relacional)

---

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/petcare-saas.git
cd petcare-saas
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o ambiente
Crie o arquivo .env com o seguinte conteúdo:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/petcare"
SECRET_KEY='your_secret_key_here'
PORT=3000
```

4. Gere o cliente Prisma:

```bash
npx prisma generate
```

5. Rode as migrações para criar o banco:

```bash
npx prisma migrate dev --name init
```

6. Inicie o servidor:

```bash
npm run start:dev
```

📄 Documentação Swagger
Disponível em:

```bash
http://localhost:3000/api
```

🧪 Rotas Públicas
✅ Registro de Usuário
POST /auth/register

Body JSON:

```bash
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "João PetLover"
}
```

Resposta:

```bash

{
  "id": 1,
  "name": "João PetLover",
  "email": "usuario@email.com"
}
```

🔐 Login de Usuário
POST /auth/login

Body JSON:

```bash
{
  "email": "usuario@email.com",
  "password": "senha123"
}

```

Resposta:

```bash
{
  "access_token": "jwt_token_aqui"
}
```

---

### Rotas do PaymentsController
- POST /payments/subscribe

1. Cria uma nova assinatura para o usuário com o email informado, utilizando a API do MercadoPago. 

- Proteção: Esta rota está protegida por autenticação JWT e autorização baseada em roles.
    ◦ Guarda: JwtAuthGuard (requisição deve conter token JWT válido)
    ◦ Guarda: RolesGuard (somente usuários com role ADMIN podem acessar) 

- Corpo da requisição (JSON):


```json
{
  "email": "usuario@exemplo.com"
}
```


- Validação: O corpo da requisição é validado usando zod com o schema createPaymentDtoSchema. Caso a validação falhe, um erro é lançado com a mensagem de validação.
- Resposta: Retorna a resposta da criação da assinatura no MercadoPago, que inclui detalhes da assinatura criada.
- Exemplo de uso:


```bash
curl -X POST http://localhost:3000/payments/subscribe \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com"}'
```

---


### Fluxo interno:
1. O controlador valida o corpo da requisição.
2. Chama o método createSubscription(email) do PaymentsService.
3. O serviço cria uma assinatura no MercadoPago usando o plano configurado na variável ambiente MERCADO_PAGO_PLAN_ID.
4. Retorna a resposta da API do MercadoPago para o cliente.


🔒 Rotas Protegidas
Todas as demais rotas da aplicação exigem autenticação via JWT.

➕ Cabeçalho de Autenticação:

```bash
Authorization: Bearer <access_token>
```

🐶 Exemplos de Rotas Protegidas:


- GET /pets → Listar pets
- POST /appointments → Agendar consulta
- GET /vaccine-history → Ver histórico de vacinas
- POST /alerts → Criar alerta de retorno
- GET /stock → Ver estoque de produtos
- POST /clinic → Criar Clinicas


🧰 Scripts úteis:

```bash
npm run start:dev         # Rodar em modo dev
npm run build             # Build do projeto
npx prisma studio         # Interface visual do Prisma
npx prisma migrate dev    # Criar migração
```

🧑‍💻 Autor
Feito com 💙 por Reinaldo Pereira dos Santos.