import http from "../util/util";
import IUserModel from "../models/UserModel"

class UserDataService {
    getAll() {
      return http.get<Array<IUserModel>>("/users");
    }
  
    findById(id: string) {
      return http.get<IUserModel>(`/users/${id}`);
    }

    findByName(name: string) {
        return http.get<Array<IUserModel>>(`/users/byname/${name}`);
    }

    findByRole(role: string) {
        return http.get<Array<IUserModel>>(`/users/byrole/${role}`);
    }
  
    create(data: IUserModel) {
      return http.post<IUserModel>("/users", data);
    }
  
    update(data: IUserModel, id: Number) {
      return http.put<any>(`/users/${id}`, data);
    }
  
    delete(id: Number) {
      return http.delete<any>(`/users/${id}`);
    }
  
    /*deleteAll() {
      return http.delete<any>(`/users`);
    }*/
  }
  
  export default new UserDataService();