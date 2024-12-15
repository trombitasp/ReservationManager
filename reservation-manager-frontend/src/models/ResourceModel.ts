import IResourceProviderModel from "./ResourceProviderModel";

export default interface IResourceModel {
    id?: Number | null,
    name: string,
    description: string,
    resourceProvider: IResourceProviderModel
}