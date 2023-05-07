import { Component, ChangeEvent } from "react";
import ReservationDataService from "../../services/ReservationService";
import IReservatonModel from "../../models/ReservationModel";

type Props = {};

type State = IReservatonModel & {
    submitted: boolean;
};

export default class AddReservation extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeBeginningOfReservation = this.onChangeBeginningOfReservation.bind(this);
        this.onChangeEndOfReservation = this.onChangeEndOfReservation.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveReservation = this.saveReservation.bind(this);
        this.newReservation = this.newReservation.bind(this);

        this.state = {
            id: null,
            user: -1,
            resource: -1,
            beginningOfReservation: new Date(2000, 1, 1, 0, 0, 0, 0),
            endOfReservation: new Date(2000, 1, 1, 0, 0, 1, 0),
            description: "",
            submitted: false,
        };
    }

    onChangeBeginningOfReservation(e: ChangeEvent<HTMLInputElement>) {
        // input type="datetime-local" értékét spliteljük évre, hónapra, napra, órára és percre
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
            user: -1,
            resource: -1,
            beginningOfReservation: new Date(2023, 1, 31, 1, 0, 0, 0),
            endOfReservation: new Date(2023, 1, 31, 1, 0, 0, 0),
            description: "",
            submitted: false
        });
    }

    render() {
        const { submitted, user, resource, beginningOfReservation, endOfReservation, description } = this.state;

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
                        <div className="form-group">
                            <label htmlFor="beginning">Foglalási idő kezdete</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="beginning"
                                required
                                value={`${beginningOfReservation.getFullYear()}-${beginningOfReservation.getMonth()}-${beginningOfReservation.getDay()}T${beginningOfReservation.getHours()}:${beginningOfReservation.getMinutes()}`}
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
                                value={`${endOfReservation.getFullYear()}-${endOfReservation.getMonth()}-${endOfReservation.getDay()}T${endOfReservation.getHours()}:${endOfReservation.getMinutes()}`}
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
                                value={description}
                                onChange={this.onChangeDescription}
                                name="name"
                            />
                        </div>

                        <button onClick={this.saveReservation} className="btn btn-success">
                            Mentés
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
