import axios from "axios";
const baseURL =
 // host === "localhost" || host.startsWith("192.168.")
    /*?*/ `http://localhost:5000/api`                //  Dev + LAN
   // : "https://your-production-domain.com/api";//  Khi deploy

const api = axios.create({ baseURL });
export default api;