import { Component, ChangeEvent } from "react";
import ReservationDataService from "../../services/ReservationService";
import ResourceDataService from "../../services/ResourceService";
import IReservatonModel from "../../models/ReservationModel";
import IUserModel from "../../models/UserModel";
import IResourceModel from "../../models/ResourceModel";
import IResourceProviderModel from "../../models/ResourceProviderModel";
import { withRouter, WithRouterProps } from "../../util/withRouter";
import AuthService from "../../services/auth/AuthService";

interface Params {
    id: string;
}

type Props = WithRouterProps<Params>;

type State = IReservatonModel & {
    submitted: boolean
    currentUser: IUserModel | null
    redirect: string | null
    role_admin: boolean
    role_logged_in: boolean
};

class AddReservation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeBeginningOfReservation = this.onChangeBeginningOfReservation.bind(this);
        this.onChangeEndOfReservation = this.onChangeEndOfReservation.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveReservation = this.saveReservation.bind(this);
        this.newReservation = this.newReservation.bind(this);

        this.state = {
            id: null,
            user: this.newUser(),
            resource: this.newResource(),
            beginningOfReservation: new Date(),
            endOfReservation: new Date(),
            description: "",
            submitted: false,
            currentUser: this.newUser(),
            redirect: null,
            role_admin: false,
            role_logged_in: false
        };
        this.setResourceById(this.props.match.params.id);
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

    newUser() {
        let temp: IUserModel = {    // TODO: ehelyett 0, "", "", majd valahogyan el kell kérni a bejelentkezett felh.-t
            id: -1,
            username: "",
            email: "",
            password: "",
            roles: ["DEFAULT"]
        };
        return temp;
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (!user) this.setState({ redirect: "/" });
        this.setState({
            currentUser: user,
            user: user,
            role_logged_in: user.roles.includes("LOGGED_IN") || user.roles.includes("logged_in"),
            role_admin: user.roles.includes("ADMIN") || user.roles.includes("admin"),
        })
    }

    setResourceById(id: string) {
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
    }

    onChangeBeginningOfReservation(e: ChangeEvent<HTMLInputElement>) {
        // input type="datetime-local" értékét spliteljük évre, hónapra, napra, órára és percre
        console.log(e.target.value);
        let [date, time] = e.target.value.split("T");
        let [y, m, d] = date.split("-");
        let [hours, minutes] = time.split(":");
        this.setState({
            beginningOfReservation: new Date(+y, +m, +d, +hours, +minutes, 0, 0),
        });
    }

    onChangeEndOfReservation(e: ChangeEvent<HTMLInputElement>) {
        // input type="datetime-local" értékét spliteljük évre, hónapra, napra, órára és percre
        let [date, time] = e.target.value.split("T");
        let [y, m, d] = date.split("-");
        let [hours, minutes] = time.split(":");
        this.setState({
            endOfReservation: new Date(+y, +m, +d, +hours, +minutes, 0, 0),
        });
    }

    onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            description: e.target.value,
        });
    }

    saveReservation() {
        const data: IReservatonModel = {
            user: this.state.user,
            resource: this.state.resource,
            beginningOfReservation: this.state.beginningOfReservation,
            endOfReservation: this.state.endOfReservation,
            description: this.state.description,
        };

        ReservationDataService.create(data)
            .then((response: any) => {
                this.setState({
                    id: response.data.id,
                    user: response.data.user,
                    resource: response.data.resource,
                    beginningOfReservation: response.data.beginningOfReservation,
                    endOfReservation: response.data.endOfReservation,
                    description: response.data.description,
                    submitted: true
                });
                console.log(response.data + "created.");
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    newReservation() {
        this.setState({
            id: null,
            user: this.newUser(),
            resource: this.newResource(),
            beginningOfReservation: new Date(),
            endOfReservation: new Date(),
            description: "",
            submitted: false
        });
    }

    getDateTime_yyyyMMddhhmm(date: Date): string {
        var months: string;
        if (date.getMonth() > 9) {
            months = date.getMonth().toString();
        } else {
            months = `0${date.getMonth().toString()}`;
        }
        var days: string;
        if (date.getDay() > 9) {
            days = date.getDay().toString();
        } else {
            days = `0${date.getDay().toString()}`;
        }
        var hours: string;
        if (date.getHours() > 9) {
            hours = date.getHours().toString();
        } else {
            hours = `0${date.getHours().toString()}`;
        }
        var minutes: string;
        if (date.getMinutes() > 9) {
            minutes = date.getMinutes().toString();
        } else {
            minutes = `0${date.getMinutes().toString()}`;
        }
        return `${date.getFullYear()}-${months}-${days}T${hours}:${minutes}`;
    }

    render() {
        const { submitted, beginningOfReservation, endOfReservation, description, currentUser, role_admin, role_logged_in } = this.state;

        return (
            <div className="submit-form">
                {submitted ? (
                    <div>
                        <h4>A foglalás sikeresen mentésre került.</h4>
                        <button className="btn btn-success" onClick={this.newReservation}>
                            Új foglalás felvétele
                        </button>
                    </div>
                ) : (   // TODO: a provider min és max reservationTime-ja alapján validálni kell!
                    <div>
                        <h3>{this.state.resource.resourceProvider.name} </h3>
                        <h4>{this.state.resource.name} </h4>
                        <div className="form-group">
                            <label htmlFor="beginning">Foglalási idő kezdete</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="beginning"
                                required
                                disabled={!(currentUser && (role_admin || role_logged_in))}
                                value={this.getDateTime_yyyyMMddhhmm(beginningOfReservation)}
                                onChange={this.onChangeBeginningOfReservation}
                                name="beginning"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end">Foglalási idő vége</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="end"
                                required
                                disabled={!(currentUser && (role_admin || role_logged_in))}
                                value={this.getDateTime_yyyyMMddhhmm(endOfReservation)}
                                onChange={this.onChangeEndOfReservation}
                                name="end"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Leírás</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                disabled={!(currentUser && (role_admin || role_logged_in))}
                                value={description}
                                onChange={this.onChangeDescription}
                                name="name"
                            />
                        </div>
                        {(currentUser && (role_admin || role_logged_in)) ? (
                            <div className="d-flex justify-content-center">
                                <button onClick={this.saveReservation} className="m-3 btn btn-sm btn-success">
                                    Mentés
                                </button>
                                <button
                                    className="m-3 btn btn-sm btn-secondary"
                                    onClick={this.props.history.back}>
                                    Mégsem
                                </button>
                            </div>
                        ) : (
                            <div>
                                Jelentkezz be további funkciókért!
                                <button
                                    className="m-3 btn btn-sm btn-secondary"
                                    onClick={this.props.history.back}>
                                    Mégsem
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(AddReservation);