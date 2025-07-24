FROM node:22-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando os arquivos
COPY . .

# Instalando as dependências
RUN npm install

# Expondo a porta 3000
EXPOSE 3000

