# Base image
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client
RUN yarn prisma:generate

# Build the application
RUN yarn build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Copy built files and Prisma from base
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
