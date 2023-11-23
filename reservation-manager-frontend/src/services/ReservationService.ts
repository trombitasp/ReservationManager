import http from "../util/util";
import IReservationModel from "../models/ReservationModel"

class ReservationDataService {
	getAll() {
		return http.get<Array<IReservationModel>>("/reservations/ / /");
	}

	findById(id: string) {
		return http.get<IReservationModel>(`/reservations/${id}/ /`);
	}

	findByUserId(userId: string) {
		return http.get<Array<IReservationModel>>(`/reservations/ /${userId}/`);
		return http.get<Array<IReservationModel>>(`/reservations/byuser/${userId}`);
	}

	create(data: IReservationModel) {
		return http.post<IReservationModel>("/reservations", data);
	}

	update(data: IReservationModel, id: Number) {
		return http.put<any>(`/reservations/${id}`, data);
	}

	delete(id: Number) {
		return http.delete<any>(`/reservations/${id}`);
	}

	/*deleteAll() {
	  return http.delete<any>(`/reservations`);
	}*/
}

export default new ReservationDataService();