import IResourceModel from "./ResourceModel";

export default interface IResourceProviderModel {
    id?: Number | null,
    name: String,
    minReservationTime: Date,
    maxReservationTime: Date,
    description: String,
    resources: Array<IResourceModel>
}