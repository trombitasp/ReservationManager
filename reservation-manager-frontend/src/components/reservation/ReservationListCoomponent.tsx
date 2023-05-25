import { Component, ChangeEvent } from "react";
import ResourceDataService from "../../services/ResourceService";
import ReservationDataService from "../../services/ReservationService";
import IReservationModel from '../../models/ReservationModel';
import IResourceModel from "../../models/ResourceModel";
import { withRouter, WithRouterProps } from "../../util/withRouter";
import IResourceProviderModel from "../../models/ResourceProviderModel";
import IUserModel from "../../models/UserModel";
import AuthService from "../../services/auth/AuthService";

interface Params {
    id: string;
}

type Props = WithRouterProps<Params>;

type State = {
    reservations: Array<IReservationModel>,
    currentReservation: IReservationModel | null,
    currentIndex: number,
    searchName: string,
    resource: IResourceModel,
    currentUser: IUserModel | undefined,
    role_admin: boolean,
    role_logged_in: boolean
};

class ReservationList extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.onChangeSearchName = this.onChangeSearchName.bind(this);
        this.retrieveReservationsById = this.retrieveReservationsById.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setCurrentResource = this.setCurrentResource.bind(this);
        this.removeAllTutorials = this.removeAllTutorials.bind(this);
        this.searchName = this.searchName.bind(this);

        this.state = {
            reservations: [],
            currentReservation: null,
            currentIndex: -1,
            searchName: "",
            resource: this.newResource(),
            currentUser: undefined,
            role_admin: false,
            role_logged_in: false
        };
        //this.setResourceById(this.props.match.params.id);
    }

    newResource() {
        let temp: IResourceModel = {
            id: null,
            name: "",
            description: "",
            resourceProvider: this.newResourceProvider()
        };
        return temp;
    }

    newResourceProvider() {
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
        this.retrieveReservationsById(this.props.match.params.id);

        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                role_logged_in: user.roles.includes("LOGGED_IN") || user.roles.includes("logged_in"),
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

    /*setResourceById(id: string) {
        ResourceDataService.findById(id)
            .then((response: any) => {
                console.log(response.data)
                this.setState({
                    resource: response.data
                })
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }*/

    retrieveReservationsById(id: string) {
        ReservationDataService.findByUserId(id)
            .then((response: any) => {
                this.setState({
                    reservations: response.data
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    refreshList() {
        this.retrieveReservationsById(this.props.match.params.id);
        this.setState({
            currentReservation: null,
            currentIndex: -1,
            resource: this.newResource()
        });
    }

    setCurrentResource(resource: IReservationModel, index: number) {
        this.setState({
            currentReservation: resource,
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
            currentReservation: null,
            currentIndex: -1
        });

        /*ReservationDataService.findByName(this.state.searchName)    // TODO: keresés legyen-e valamelyik property alapján
            .then((response: any) => {
                this.setState({
                    reservations: response.data
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });*/
    }

    render() {
        const { searchName, reservations, currentReservation, currentIndex, currentUser, role_admin, role_logged_in } = this.state;

        return (
            <div className="list row">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Keresés ??? alapján"
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
                    <h4>A Te eddigi foglalásaid </h4>
                    <ul className="list-group">
                        {reservations &&
                            reservations.map((reservation: IReservationModel, index: number) => (
                                <li className={"list-group-item " + (index === currentIndex ? "active" : "")}
                                    onClick={() => this.setCurrentResource(reservation, index)}
                                    key={index}>
                                    {reservation.description}
                                </li>
                            ))}
                    </ul>
                    {currentUser && (role_admin || role_logged_in) && (
                        <button
                            className="m-3 btn btn-sm btn-danger"
                            onClick={this.removeAllTutorials} >
                            Összes foglalási előzmény törlése
                        </button>
                    )}
                </div>
                <div className="col-md-6">
                    {currentReservation ? (
                        <div>
                            <h4>Foglalás adatai:</h4>
                            <div>
                                <label>
                                    <strong>Leírás:</strong>
                                </label>{" "}
                                {currentReservation.description}
                            </div>
                            <div>
                                <label>
                                    <strong>Foglalás kezdete:</strong>
                                </label>{" "}
                                {`${currentReservation.beginningOfReservation.toString().substring(0, 10)}, ${currentReservation.beginningOfReservation.toString().substring(11, 19)}`}
                            </div>
                            <div>
                                <label>
                                    <strong>Foglalás vége:</strong>
                                </label>{" "}
                                {`${currentReservation.endOfReservation.toString().substring(0, 10)}, ${currentReservation.endOfReservation.toString().substring(11, 19)}`}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <br />
                            <p>Kattints az egyik foglalásra a listából!</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(ReservationList);