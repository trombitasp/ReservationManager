import { Component, ChangeEvent } from "react";
import ResourceDataService from "../../services/ResourceService";
import ResourceProviderDataService from "../../services/ResourceProviderService";
import { Link } from "react-router-dom";
import IResourceModel from '../../models/ResourceModel';
import IResourceProviderModel from "../../models/ResourceProviderModel";
import { withRouter, WithRouterProps } from "../../util/withRouter";

interface Params {
    id: string;
}

type Props = WithRouterProps<Params>;

type State = {
    resources: Array<IResourceModel>,
    currentResource: IResourceModel | null,
    currentIndex: number,
    searchName: string,
    provider: IResourceProviderModel
};

class ResourceList extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.onChangeSearchName = this.onChangeSearchName.bind(this);
        this.retrieveResources = this.retrieveResources.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setCurrentResource = this.setCurrentResource.bind(this);
        this.removeAllTutorials = this.removeAllTutorials.bind(this);
        this.searchName = this.searchName.bind(this);

        this.state = {
            resources: [],
            currentResource: null,
            currentIndex: -1,
            searchName: "",
            provider: this.defaultProvider()
        };
        this.getProviderById(this.props.match.params.id);
    }

    defaultProvider(): IResourceProviderModel {
        let temp: IResourceProviderModel = {
            id: null,
            name: "",
            minReservationTime: new Date(2000, 1, 31, 1, 0, 0, 0),
            maxReservationTime: new Date(2000, 1, 31, 23, 59, 59, 0),
            description: ""
        };
        return temp;
    }
    componentDidMount() {
        this.retrieveResources();
    }

    onChangeSearchName(e: ChangeEvent<HTMLInputElement>) {
        const searchName = e.target.value;
        this.setState({
            searchName: searchName
        });
    }

    getProviderById(id: string) {
        ResourceProviderDataService.findById(id)
            .then((response: any) => {
                console.log(response.data)
                this.setState({
                    provider: response.data
                })
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    retrieveResources() {
        ResourceDataService.getAll()
            .then((response: any) => {
                this.setState({
                    resources: response.data
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    refreshList() {
        this.retrieveResources();
        this.setState({
            currentResource: null,
            currentIndex: -1
        });
    }

    setCurrentResource(resource: IResourceModel, index: number) {
        this.setState({
            currentResource: resource,
            currentIndex: index
        });
    }

    removeAllTutorials() {
        ResourceDataService.delete(1000000)		// TODO
            .then((response: any) => {
                console.log(response.data);
                this.refreshList();
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    searchName() {
        this.setState({
            currentResource: null,
            currentIndex: -1
        });

        ResourceDataService.findByName(this.state.searchName)
            .then((response: any) => {
                this.setState({
                    resources: response.data
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    render() {
        const { searchName, resources, currentResource, currentIndex } = this.state;

        return (
            <div className="list row">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Keresés név alapján"
                            value={searchName}
                            onChange={this.onChangeSearchName}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={this.searchName} >
                                Keresés
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h4>{this.state.provider.name} erőforrásai </h4>

                    <ul className="list-group">
                        {resources &&
                            resources.map((resourceProvider: IResourceModel, index: number) => (
                                <li
                                    className={"list-group-item " + (index === currentIndex ? "active" : "")}
                                    onClick={() => this.setCurrentResource(resourceProvider, index)}
                                    key={index}
                                >
                                    {resourceProvider.name}
                                </li>
                            ))}
                    </ul>
                    <button
                        className="m-3 btn btn-sm btn-danger"
                        onClick={this.removeAllTutorials} >
                        Összes erőforrás törlése
                    </button>
                </div>
                <div className="col-md-6">
                    {currentResource ? (
                        <div>
                            <h4>Erőforrás adatai:</h4>
                            <div>
                                <label>
                                    <strong>Név:</strong>
                                </label>{" "}
                                {currentResource.name}
                            </div>
                            <div>
                                <label>
                                    <strong>Leírás:</strong>
                                </label>{" "}
                                {currentResource.description}
                            </div>
                            <Link
                                to={"/resources/" + currentResource.id}
                                className="m-3 btn btn-sm btn-warning">
                                Módosít
                            </Link>
                            <Link
                                to={"/reservations/resource/" + currentResource.id}
                                className="m-3 btn btn-sm btn-success">
                                Foglalás
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <br />
                            <p>Kattints az egyik erőforrásra a listából!</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(ResourceList);