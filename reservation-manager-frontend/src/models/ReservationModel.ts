import IResourceModel from "./ResourceModel";
import IUserModel from "./UserModel";

export default interface IReservationModel {
    id?: Number | null,
    user: IUserModel,            //  Array<IUserModel>,
    resource: IResourceModel,        //  Array<IResourceModel>,
    beginningOfReservation: Date,
    endOfReservation: Date,
    description: string
}