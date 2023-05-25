import { Component, ChangeEvent } from "react";
import ResourceProviderDataService from "../../services/ResourceProviderService";
import { Link, Route, Routes } from "react-router-dom";
import IResourceProviderModel from '../../models/ResourceProviderModel';
import ResourceList from "../resource/ResourceListComponent";
import IUserModel from "../../models/UserModel";
import AuthService from "../../services/auth/AuthService";

type Props = {};

type State = {
    resourceProviders: Array<IResourceProviderModel>,
    currentProvider: IResourceProviderModel | null,
    currentIndex: number,
    searchName: string,
    currentUser: IUserModel | undefined,
    role_admin: boolean
};

export default class ResourceProviderList extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.onChangeSearchName = this.onChangeSearchName.bind(this);
        this.retrieveResourceProviders = this.retrieveResourceProviders.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setCurrentProvider = this.setCurrentProvider.bind(this);
        this.removeAllTutorials = this.removeAllTutorials.bind(this);
        this.searchName = this.searchName.bind(this);

        this.state = {
            resourceProviders: [],
            currentProvider: null,
            currentIndex: -1,
            searchName: "",
            currentUser: undefined,
            role_admin: false
        };
    }

    componentDidMount() {
        this.retrieveResourceProviders();
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                // role_logged_in: user.roles.includes("LOGGED_IN") || user.roles.includes("logged_in"),
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

    retrieveResourceProviders() {
        ResourceProviderDataService.getAll()
            .then((response: any) => {
                this.setState({
                    resourceProviders: response.data
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    refreshList() {
        this.retrieveResourceProviders();
        this.setState({
            currentProvider: null,
            currentIndex: -1
        });
    }

    setCurrentProvider(resourceProvider: IResourceProviderModel, index: number) {
        let min = new Date(resourceProvider.minReservationTime);
        let max = new Date(resourceProvider.maxReservationTime);
        resourceProvider.maxReservationTime = max;
        resourceProvider.minReservationTime = min;
        this.setState({
            currentProvider: resourceProvider,
            currentIndex: index
        });
    }

    removeAllTutorials() {
        ResourceProviderDataService.delete(1000000)		// TODO
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
            currentProvider: null,
            currentIndex: -1
        });

        if (typeof this.state.searchName === 'undefined' || this.state.searchName.length === 0) {
            this.retrieveResourceProviders();
        } else {
            ResourceProviderDataService.findByName(this.state.searchName)
                .then((response: any) => {
                    this.setState({
                        resourceProviders: response.data
                    });
                    console.log(response.data);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        }
    }

    render() {
        const { searchName, resourceProviders, currentProvider, currentIndex, currentUser, role_admin } = this.state;

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
                    <h4>Szolgáltatók listája</h4>
                    {currentUser && role_admin && (
                        <Link
                            to={"/resourceproviders/new"}
                            className="m-3 btn btn-sm btn-primary">
                            Új szolgáltató felvétele
                        </Link>
                    )}
                    <ul className="list-group">
                        {resourceProviders &&
                            resourceProviders.map((resourceProvider: IResourceProviderModel, index: number) => (
                                <li className={"list-group-item " + (index === currentIndex ? "active" : "")}
                                    onClick={() => this.setCurrentProvider(resourceProvider, index)}
                                    key={index}>
                                    {resourceProvider.name}
                                </li>
                            ))}
                    </ul>
                    {role_admin && currentUser && (
                        <button
                            className="m-3 btn btn-sm btn-danger"
                            onClick={this.removeAllTutorials} >
                            Összes szolgáltató törlése
                        </button>
                    )}
                </div>
                <div className="col-md-6">
                    {currentProvider ? (
                        <div>
                            <h4>Szolgáltató adatai:</h4>
                            <div>
                                <label>
                                    <strong>Név:</strong>
                                </label>{" "}
                                {currentProvider.name}
                            </div>
                            <div>
                                <label>
                                    <strong>Leírás:</strong>
                                </label>{" "}
                                {currentProvider.description}
                            </div>
                            <div>
                                <label>
                                    <strong>Minimális foglalási idő:</strong>
                                </label>{" "}
                                {`${currentProvider.minReservationTime.getHours()} óra ${currentProvider.minReservationTime.getMinutes()} perc ${currentProvider.minReservationTime.getSeconds()} másodperc`}
                            </div>
                            <div>
                                <label>
                                    <strong>Maximális foglalási idő:</strong>
                                </label>{" "}
                                {`${currentProvider.maxReservationTime.getHours()} óra ${currentProvider.maxReservationTime.getMinutes()} perc ${currentProvider.maxReservationTime.getSeconds()} másodperc`}
                            </div>

                            {currentUser && role_admin && (
                                <Link
                                    to={"/resourceproviders/" + currentProvider.id}
                                    className="btn btn-sm btn-warning">
                                    Módosít
                                </Link>
                            )}
                            <Link
                                to={"/resources/provider/" + currentProvider.id}
                                className="m-3 btn btn-sm btn-success">
                                Erőforrások
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <br />
                            <p>Kattints az egyik szolgáltatóra a listából vagy vegyél fel újat!</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}