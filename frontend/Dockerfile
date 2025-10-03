FROM node:20.19.0

WORKDIR /app

# dependencies
COPY package*.json ./
RUN npm install

# copy code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
