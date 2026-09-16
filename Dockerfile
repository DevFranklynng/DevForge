FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund
COPY server/package.json server/package-lock.json ./server/
RUN npm --prefix server install --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/server ./server
COPY --from=build /app/node_modules ./node_modules

# Persistent SQLite data volume (mount e.g. /data and set DATABASE_URL=file:/data/devforge.db).
VOLUME /data
ENV DATABASE_URL=file:/data/devforge.db

EXPOSE 4000
CMD ["sh", "-c", "npm --prefix server exec prisma db push && node server/dist/index.js"]