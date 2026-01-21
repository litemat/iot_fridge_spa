# ==================================
# СТАДИЯ 1: СБОРКА ПРИЛОЖЕНИЯ (BUILDER)
# ==================================
FROM node:20-alpine AS builder

WORKDIR /app 

# Копируем файлы манифеста
COPY package*.json ./ 
COPY tsconfig.json ./

# НАСТРОЙКА NPM ПРОТИВ ТАЙМАУТОВ (ETIMEDOUT Fix)
# Увеличиваем тайм-аут до 10 минут и количество попыток до 5
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-factor 2
RUN npm config set fetch-retry-mintimeout 10000
RUN npm config set fetch-retry-maxtimeout 600000

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . . 

# Запускаем сборку
# Используем /bin/sh -c для явного вызова скрипта
RUN /bin/sh -c "npm run build"


# ==================================
# СТАДИЯ 2: ЗАПУСК ПРИЛОЖЕНИЯ (PRODUCTION)
# ==================================
FROM nginx:alpine

# Копируем конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем статику
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]