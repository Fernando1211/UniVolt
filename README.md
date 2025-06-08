## Integrantes (rm):

- Fernando Henrique Vilela Aguiar (557525)
- Gabrielly Campos Macedo (558962)
- Rafael Mocoto Magalhães Seo (554992)

## Descrição do Projeto
Este projeto propõe uma solução inteligente para a gestão de pedidos de organizações voluntárias, automatizando a classificação de prioridade dos pedidos com base no conteúdo da descrição. Utiliza-se uma API de Machine Learning externa para realizar a avaliação, salvando tanto a prioridade no próprio pedido quanto o histórico dessa classificação em uma tabela de log.


📦 Sistema de Cadastro de Pedidos – React Native + Spring Boot
Esta aplicação permite o cadastro, listagem e exclusão de pedidos, vinculados a organizações existentes, com autenticação segura via token JWT. O sistema foi desenvolvido em React Native (frontend) e Spring Boot (backend) como parte de um projeto acadêmico/profissional.

📲 Funcionalidades
✅ Login com autenticação JWT

✅ Cadastro de pedidos com descrição e vínculo à organização

✅ Listagem de pedidos cadastrados

✅ Exclusão de pedidos com confirmação

✅ Requisições autenticadas via token JWT

✅ Picker dinâmico para selecionar organizações (carregadas da API)

🛠️ Tecnologias Utilizadas
Frontend (Mobile)
React Native
AsyncStorage
@react-native-picker/picker
TypeScript
Backend (API REST)
Spring Boot
Spring Security
JWT (Auth0)
JPA / Hibernate
Banco de dados: Oracle ou PostgreSQL (configurável)

🚀 Como executar o projeto
Pré-requisitos
Node.js e npm

Android Studio ou emulador

Java 17+

Banco Oracle/PostgreSQL com tabelas e entidades configuradas

Frontend
bash
Copiar
Editar
# Instalar dependências
npm install

# Iniciar aplicação
npx react-native run-android
Backend
bash
Copiar
Editar
# Compilar e iniciar a API
./mvnw spring-boot:run
🔐 Exemplo de token no frontend
O token é armazenado localmente após o login e incluído nas requisições:

ts
Copiar
Editar
const token = await AsyncStorage.getItem("token");

fetch("/pedidos", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
🧪 Estrutura do Payload
POST /pedidos
json
Copiar
Editar
{
  "descricao": "Entrega de mantimentos",
  "organizacaoId": 3
}



📌 Observações
Todas as requisições protegidas exigem um token JWT válido.

A organização deve ser previamente cadastrada no sistema.

O sistema pode ser adaptado para múltiplos perfis de usuários (ADMIN, USER).
