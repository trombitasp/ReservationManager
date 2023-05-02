import IReservationModel from "./ReservationModel";

export default interface IUserModel {
    id?: Number | null,
    name: String,
    role: String,
    reservations: Array<IReservationModel>
}