FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pour Vite en mode developpement, il faut exposer le port 5173
EXPOSE 5173

# Commande pour lancer Vite en mode host pour que le conteneur soit accessible
CMD ["npm", "run", "dev", "--", "--host"]
