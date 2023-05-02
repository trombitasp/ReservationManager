import IResourceModel from "./ResourceModel";
import IUserModel from "./UserModel";

export default interface IReservationModel {
    id?: Number | null,
    user: Array<IUserModel>,
    resource: Array<IResourceModel>,
    beginningOfReservation: Date,
    endOfReservation: Date,
    description: String
}