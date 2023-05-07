import IReservationModel from "./ReservationModel";
import IResourceProviderModel from "./ResourceProviderModel";

export default interface IResourceModel {
    id?: Number | null,
    name: string,
    description: string,
    resourceProvider: Number,       //IResourceProviderModel,
    reservation: Number             //IReservationModel
}