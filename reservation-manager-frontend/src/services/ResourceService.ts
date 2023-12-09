import http from "../util/util";
import IResourceModel from "../models/ResourceModel"

class ResourceDataService {
    getAll() {
      return http.get<Array<IResourceModel>>("/resources");
    }
  
    findById(id: string) {
      return http.get<IResourceModel>(`/resources/${id}`);
    }

    findByName(name: string) {
        return http.get<Array<IResourceModel>>(`/resources/${name}/ / /`);
    }

    findByDescription(description: string) {
        return http.get<Array<IResourceModel>>(`/resources/ / /${description}/`);
    }

    findByProviderId(id: string) {
      return http.get<Array<IResourceModel>>(`/resources/ /${id}/ /`);
  }
  
    create(data: IResourceModel) {
      return http.post<IResourceModel>("/resources", data);
    }
  
    update(data: IResourceModel, id: Number) {
      return http.put<any>(`/resources/${id}`, data);
    }
  
    delete(id: Number) {
      return http.delete<any>(`/resources/${id}`);
    }
  
    /*deleteAll() {
      return http.delete<any>(`/resources`);
    }*/
  }
  
  export default new ResourceDataService();