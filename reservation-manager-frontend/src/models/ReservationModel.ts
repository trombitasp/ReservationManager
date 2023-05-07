import IResourceModel from "./ResourceModel";
import IUserModel from "./UserModel";

export default interface IReservationModel {
    id?: Number | null,
    user: Number,            //  Array<IUserModel>,
    resource: Number,        //  Array<IResourceModel>,
    beginningOfReservation: Date,
    endOfReservation: Date,
    description: string
}