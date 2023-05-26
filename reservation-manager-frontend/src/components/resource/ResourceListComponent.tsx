import { Component, ChangeEvent } from "react";
import ResourceDataService from "../../services/ResourceService";
import ResourceProviderDataService from "../../services/ResourceProviderService";
import { Link } from "react-router-dom";
import IResourceModel from '../../models/ResourceModel';
import IResourceProviderModel from "../../models/ResourceProviderModel";
import { withRouter, WithRouterProps } from "../../util/withRouter";
import IUserModel from "../../models/UserModel";
import AuthService from "../../services/auth/AuthService";

interface Params {
    id: string;
}

type Props = WithRouterProps<Params>;

type State = {
    resources: Array<IResourceModel>,
    currentResource: IResourceModel | null,
    currentIndex: number,
    searchName: string,
    provider: IResourceProviderModel,
    currentUser: IUserModel | undefined,
    role_admin: boolean
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
            provider: this.defaultProvider(),
            currentUser: undefined,
            role_admin: false
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

        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                role_admin: user.roles.includes("ADMIN") || user.roles.includes("admin"),
            });
        }
    }

    onChangeSearchName(e: ChangeEvent<HTMLInputElement>) {
        const searchName = e.target.value;
        this.setState({
            searchName: searchName
        });
    }

    getProviderById(id: string) {
        if (typeof id === 'undefined' || id.length === 0) {  // ha nincs id, akkor az összes resource-ot meg kell jeleníteni
            return;
        }
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
        // ha nincs provider, akkor minden resource kell, egyébként csak az adott providerhez tartozók
        if (!this.props.match.params.id) {
            ResourceDataService.getAll()        // TODO: nem az összes kell (csak ha ninsc provider.id), hanem az adott provider resource-ai
                .then((response: any) => {
                    this.setState({
                        resources: response.data
                    });
                    console.log(response.data);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        } else {
            ResourceDataService.findByProviderId(this.props.match.params.id)
                .then((response: any) => {
                    this.setState({
                        resources: response.data
                    });
                    console.log(response.data);
                })
                .catch((e: Error) => {
                    console.log(e);
                })
        }
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

        if (typeof this.state.searchName === 'undefined' || this.state.searchName.length === 0) {
            this.retrieveResources();
        } else {
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
    }

    render() {
        const { searchName, resources, currentResource, currentIndex, currentUser, role_admin } = this.state;

        return (
            <div className="list row">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Keresés név alapján"
                            value={searchName}
                            onBlur={this.searchName}
                            onChange={this.onChangeSearchName}
                        />
                        <div className="input-group-append mx-3">
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
                    {this.state.provider.name === "" ? (
                        <h4> Összes erőforrás </h4>
                    ) : (
                        <h4>{this.state.provider.name} erőforrásai </h4>
                    )}
                    {currentUser && role_admin && (
                        <Link
                            to={"/resources/new/" + this.props.match.params.id}
                            className="m-3 btn btn-sm btn-primary">
                            Új erőforrás felvétele
                        </Link>
                    )}
                    <ul className="list-group">
                        {resources &&
                            resources.map((resourceProvider: IResourceModel, index: number) => (
                                <li className={"list-group-item " + (index === currentIndex ? "active" : "")}
                                    onClick={() => this.setCurrentResource(resourceProvider, index)}
                                    key={index}>
                                    {resourceProvider.name}
                                </li>
                            ))}
                    </ul>
                    {currentUser && role_admin && (
                        <button
                            className="m-3 btn btn-sm btn-danger"
                            onClick={this.removeAllTutorials} >
                            Összes erőforrás törlése
                        </button>
                    )}
                </div>
                <div className="col-md-6">
                    {currentResource ? (
                        <div>
                            <h4>Erőforrás adatai:</h4>
                            <div>
                                <label>
                                    <strong>Szolgáltató:</strong>
                                </label>{" "}
                                {currentResource.resourceProvider.name}
                            </div>
                            <div>
                                <label>
                                    <strong>Név:</strong>
                                </label>{" "}
                                {currentResource.name}
                            </div>
                            <div className="mb-3">
                                <label>
                                    <strong>Leírás:</strong>
                                </label>{" "}
                                {currentResource.description}
                            </div>
                            {currentUser && role_admin && (
                                <Link
                                    to={"/resources/" + currentResource.id}
                                    className="btn btn-sm btn-warning">
                                    Módosít
                                </Link>
                            )}
                            {(currentUser && role_admin) ? (
                                <div>
                                    <Link
                                        to={"/resources/" + currentResource.id}
                                        className="btn btn-sm btn-warning">
                                        Módosít
                                    </Link>
                                    <Link
                                        to={"/reservations/resource/" + currentResource.id}
                                        className="m-3 btn btn-sm btn-success">
                                        Foglalás
                                    </Link>
                                </div>
                            ) : (
                                <span className="redText"><strong>Jelentkezz be foglalás leadásához!</strong></span>
                            )}

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