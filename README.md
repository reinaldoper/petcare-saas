# 🐾 PetCare SaaS - Backend

Este projeto é uma API RESTful para gerenciamento de pet shops e clínicas veterinárias, desenvolvida com **NestJS**, **Prisma**, **Swagger** e **JWT Authentication**.

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