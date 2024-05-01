# Credential Viewer App

## Application functional overview
In my work i needed a way to manage my list of credentials to multiple servicesm Jenkins , Gitlab , Servers , Databases etc...
so i did built this app for managing my Credentials in a shape of categories and each categorie contains a list of credentials , each credential contain key and it's value . The value is encrypted and you can decrypt it and copying it . I did add support for store credentials as file and they are stored in the app for security reasons.
## why i did make this app in public and not as a service

i did make this tool public for developers because this isn't just my probleme , and a lot developers out there hqve this issue. 
This is a very important data and it should be saved in a secure envir

## Technical overview
the tech stack is simple , i did use laravel for the back end and react js for the front end and the Authentification using JWT

## Set up 
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

Set up the laravel app using docker


```bash
cd credential_viewer_api
```
```bash
conposer install # or conposer update
```
```bash
./vendor/bin/sail up
```
```bash
./vendor/bin/sail artisan migrate
```

in the .env file set these values

```bash
APP_PORT=8000
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=credentials_viewer_api
DB_USERNAME=sail
DB_PASSWORD=password
```

if you are using linux or mac it's ok , but if you use windows you will need to use wsl

i do use ubuntu and i did face some permission issues so here is the solution that worked for me :
```bash
docker exec -t <laravel container id> bash
```
```bash
chown -R sail:sail storage
```
and then exit : 
```bash
exit
```



