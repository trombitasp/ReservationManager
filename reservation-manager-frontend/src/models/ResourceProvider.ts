export default interface IResourceProviderModel {
    id?: Number | null,
    name: String,
    minReservationTime: Date,
    maxReservationTime: Date,
    description: String,
    resources:
}