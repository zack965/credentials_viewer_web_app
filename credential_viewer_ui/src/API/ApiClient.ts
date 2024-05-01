import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//const Base_Url_local = "http://127.0.0.1:8000/api";
const Base_Url_Dokcer_local = "http://localhost:8000/api";
//const Base_Url_online = "https://gadacademy.ma/api";

export const ApiClient = axios.create({
  baseURL: Base_Url_Dokcer_local,
  
  headers: {
    "Content-Type": "application/json",
  },
});

//gikyweny@mailinator.com



