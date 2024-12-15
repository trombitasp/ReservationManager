export default interface IResourceProviderModel {
    id?: Number | null,
    name: string,
    minReservationTime: Date,
    maxReservationTime: Date,
    description: string,
    image: Blob
    //resources: Array<Number>        // Array<IResourceModel>, ha nem id-k kellenek
}