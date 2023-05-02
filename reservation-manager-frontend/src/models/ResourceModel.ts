import IReservationModel from "./ReservationModel";
import IResourceProviderModel from "./ResourceProvider";

export default interface IResourceModel {
    id?: Number | null,
    name: String,
    description: String,
    resourceProvider: Array<IResourceProviderModel>,
    reservation: Array<IReservationModel>
}