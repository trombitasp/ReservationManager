import IReservationModel from "./ReservationModel";

export default interface IUserModel {
    id?: Number | null,
    name: string,
    role: string,
    reservations: Array<Number>      // Array<IReservationModel>, ha nem csak id kell
}