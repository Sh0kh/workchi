import axios from 'axios';

axios.defaults.baseURL = 'https://601b03a43818.ngrok-free.app';

// Перехватчик ответа
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear(); // Очистка localStorage
            window.location.href = "/login"; // Переход на страницу логина
        }
        return Promise.reject(error);
    }
);

export default axios;
