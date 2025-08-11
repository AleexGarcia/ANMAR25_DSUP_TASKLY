# Stage 1: build
FROM node:22-alpine AS builder

WORKDIR /usr/src/api

# Copia só os arquivos de package para instalar dependências antes do código (melhor cache)
COPY package*.json ./

RUN npm install --quiet --no-optional --no-fund --loglevel=error

# Copia o restante do código após instalar dependências
COPY . .

RUN npm run build

# Stage 2: runtime
FROM node:22-alpine

WORKDIR /usr/src/api

# Copia só package.json e package-lock.json para instalar só prod deps
COPY package*.json ./

RUN npm install --production --quiet --no-optional --no-fund --loglevel=error

# Copia o build da stage builder
COPY --from=builder /usr/src/api/dist ./dist

# Copia o .env.production para dentro do container
COPY --from=builder /usr/src/api/.env.production .env

EXPOSE 3000

CMD ["node", "dist/main"]
