import http from "../util/util";
import IUserModel from "../models/UserModel"
import authHeader from "./auth/AuthHeader";

class UserDataService {
	getAll() {
		return http.get<Array<IUserModel>>("/users");
	}

	findById(id: string) {
		return http.get<IUserModel>(`/users/${id}`);
	}

	findByName(name: string) {
		return http.get<Array<IUserModel>>(`/users/${name}/ /`);
	}

	findByRole(role: string) {
		return http.get<Array<IUserModel>>(`/users/ /${role}/`);
	}

	create(data: IUserModel) {
		return http.post<IUserModel>("/users", data);
	}

	update(data: IUserModel, id: number) {
		return http.put<any>(`/users/${id}`, data);
	}

	delete(id: number) {
		return http.delete<any>(`/users/${id}`);
	}

	testDefault() {
		return http.get(`/test/default`, {headers: authHeader()})
	}

	testLogged_in() {
		return http.get(`/test/logged_in`, {headers: authHeader()})
	}

	testAdmin() {
		return http.get(`/test/admin`, {headers: authHeader()})
	}

	/*deleteAll() {
	  return http.delete<any>(`/users`);
	}*/
}

export default new UserDataService();