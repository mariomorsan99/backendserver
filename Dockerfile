FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN  npm install --save express mongodb
RUN npm install mongoose
# RUN npm install bcrypt
EXPOSE 3000
CMD [ "node" , "app.js" ]