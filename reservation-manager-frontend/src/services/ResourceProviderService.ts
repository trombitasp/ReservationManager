import http from "../util/util";
import IResourceProviderModel from "../models/ResourceProviderModel"
import authHeader from "./auth/AuthHeader";

class ResourceProviderDataService {
    getAll() {
      return http.get<Array<IResourceProviderModel>>("/resourceproviders");
    }
  
    findById(id: string) {
      return http.get<IResourceProviderModel>(`/resourceproviders/${id}`);
    }

    findByName(name: string) {
        return http.get<Array<IResourceProviderModel>>(`/resourceproviders/byname/${name}`);
    }

    findByDescription(description: string) {
        return http.get<Array<IResourceProviderModel>>(`/resourceproviders/bydescription/${description}`);
    }
  
    create(data: IResourceProviderModel) {
      return http.post<IResourceProviderModel>("/resourceproviders", data, {headers: authHeader()});
    }
  
    update(data: IResourceProviderModel, id: Number) {
      return http.put<any>(`/resourceproviders/${id}`, data);
    }
  
    delete(id: Number) {
      return http.delete<any>(`/resourceproviders/${id}`);
    }
  
    /*deleteAll() {
      return http.delete<any>(`/resourceproviders`);
    }*/
  }
  
  export default new ResourceProviderDataService();