import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";
axios.interceptors.request.use((config) => {
    const value = localStorage.getItem("token");
    if (value) {
        const token = JSON.parse(value).token;
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
})

export default axios;