FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Set environment variables for build time
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 