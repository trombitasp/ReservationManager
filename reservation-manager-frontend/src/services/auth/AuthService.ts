import axios from "../../util/util";
import constants from "../../util/constants"

const API_URL = constants.AUTH_URL;

class AuthService {
    async login(username: string, password: string) {
        const response = await axios.post(API_URL + "/signin", {username, password});
        if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username: string, email: string, password: string) {
        return axios.post(API_URL + "/signup", {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);

        return null;
    }
}

export default new AuthService();