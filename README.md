# Credential Viewer App
As a software engineer, managing credentials securely is vital for various tasks. That's why I built the Credential Viewer App, a web-based solution to securely store and manage your credentials locally. Here's what makes it special:
## Introduction 
I created this web app to meet my specific needs. Now, I'm opening it up for everyone! Leave your requirements in the comments, and I'll tailor it to fit your needs. It's open-source and Dockerized, offering you the flexibility to manage your credentials in a secure way.

## Functional Overview:
The app organizes credentials into categories for easy access. Each credential is securely stored with its own key and encrypted value. Files are stored directly in the filesystem, ensuring maximum security. Need more features? Just let me know or contribute directly on GitHub.
## Technical overview
Built with Laravel for the backend and React.js for the frontend, the app ensures a smooth user experience. Authentication is handled using JWT, ensuring the security of your data at every step.
Ready to take control of your credentials? Try it out now and let me know your thoughts!


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

Locally in ubuntu i get this error of permission denied so i use this command : 
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
