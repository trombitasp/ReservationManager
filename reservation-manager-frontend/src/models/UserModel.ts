import IReservationModel from "./ReservationModel";

export default interface IUserModel {
    id?: number | null,
    name: string,
    role: string,
    //reservations: Array<Number>      // Array<IReservationModel>, ha nem csak id kell
}