import IResourceModel from "./ResourceModel";

export default interface IResourceProviderModel {
    id?: Number | null,
    name: string,
    minReservationTime: Date,
    maxReservationTime: Date,
    description: string,
    //resources: Array<Number>        // Array<IResourceModel>, ha nem id-k kellenek
}