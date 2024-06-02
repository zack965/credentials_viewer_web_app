# Credential Viewer App
## Introduction 
In my work i needed a way to manage my list of credentials to multiple services like Jenkins , Gitlab , Servers and Databases etc... , so i did create this web app for doing so , i did built this app based on my needs so there's not many features but i am sure your needs are different from mine so if you want more features just open an issue or send a PR.
I want to make it open source so other peolple can benefit from it and store he's own credentials in he's prefered envirement, it os dockerized so you can run it on your server or your local machine etc..

## Application functional overview
In a sinple words this app can store your credentials in shape of categories , and each category can have multiple credentials , and each credential has it's own key and encrypted value, the value could be a file and it is stored directly on the app.

## Technical overview
the tech stack is simple , i did use laravel for the back end and react js for the front end and the Authentification using JWT

### Set up 
after you cloning the projet you will see two folder , the first folder credential_viewer_api store the laravel app , and credential_viewer_ui store the react js app.
Set up the react js app without docker

```bash
cd credential_viewer_ui
```
```bash
npm i 
```
```bash
npm run dev
```


Set up the react js app with docker

```bash
cd credential_viewer_ui
```
```bash
docker build . -t credential_viewer_ui
```
```bash
docker run -d -p 8080:8080  credential_viewer_ui
```


Set up the laravel app

```bash
cd credential_viewer_api
```
```bash
conposer install # or conposer update
```
```bash
cp .env.example .env
```
```bash
php artisan key:generate
```

```bash
php artisan migrate
```
```bash
php artisan serv
```

Set up the laravel app using docker


```bash
cd credential_viewer_api
```
```bash
cp .env.example .env
```

locally i get this error of permission denied so i use this command : 
```bash
sudo chmod -R 777 storage
```

in the .env file set these values

```bash
APP_NAME=CredentialViewer
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=credentials_viewer_api
DB_USERNAME=root
DB_PASSWORD=assipti_opp_assipti
APP_KEY=base64:QjHYFRGfXAp3j+pD9K7MNkbUKS2+uZaRCgaJPuKtYu8=
```

```bash
docker compose up --build -d 
```

i need to migrate the database so we will do that from the container 

```bash
docker exec -it CredentialViewer bash 
```
```bash
php artisn migrate
```
