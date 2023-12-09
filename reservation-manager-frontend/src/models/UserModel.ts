export default interface IUserModel {
    id?: number | null,
    username: string,
    email: string,
    password: string,
    roles: Array<string>
    //reservations: Array<Number>      // Array<IReservationModel>, ha nem csak id kell
}