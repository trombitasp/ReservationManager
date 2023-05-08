import { Component, ChangeEvent } from "react";
import IResourceProviderModel from "../../models/ResourceProviderModel";
import ResourceProviderDataService from "../../services/ResourceProviderService";

type Props = {};

type State = IResourceProviderModel & {
    submitted: boolean;
};

export default class AddResourceProvider extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeMinTime = this.onChangeMinTime.bind(this);
        this.onChangeMaxTime = this.onChangeMaxTime.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveResourceProvider = this.saveResourceProvider.bind(this);
        this.newResourceProvider = this.newResourceProvider.bind(this);

        this.state = {
            id: null,
            name: "",
            minReservationTime: new Date(2000, 1, 31, 1, 0, 0, 0),     // 1 óra, 2000.01.31-et ki kell vonni belőle (mySQL nem tárol kiebbeket)
            maxReservationTime: new Date(2000, 1, 31, 23, 59, 59, 0),
            description: "",
            //resources: [],
            submitted: false
        };
    }

    onChangeName(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeMinTime(e: ChangeEvent<HTMLInputElement>) {
        let [hours, minutes] = e.target.value.split(":");    // input type="time" értékét spliteljük ketté órára és percre
        this.setState({
            minReservationTime: new Date(2000, 1, 31, +hours, +minutes, 0, 0),
        });
    }

    onChangeMaxTime(e: ChangeEvent<HTMLInputElement>) {
        let [hours, minutes] = e.target.value.split(":");    // input type="time" értékét spliteljük ketté órára és percre
        this.setState({
            maxReservationTime: new Date(2000, 1, 31, +hours, +minutes, 0, 0),
        });
    }

    onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            description: e.target.value,
        });
    }

    /*onChangeResources(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            resources: [+e.target.value],
        });
    }*/

    saveResourceProvider() {
        const data: IResourceProviderModel = {
            name: this.state.name,
            minReservationTime: this.state.minReservationTime,
            maxReservationTime: this.state.maxReservationTime,
            description: this.state.description
            //resources: this.state.resources
        };

        ResourceProviderDataService.create(data)
            .then((response: any) => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    minReservationTime: response.data.minReservationTime,
                    maxReservationTime: response.data.maxReservationTime,
                    description: response.data.description,
                    //resources: response.data.resources,
                    submitted: true
                });
                console.log(response.data + "created.");
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    newResourceProvider() {
        this.setState({
            id: null,
            name: "",
            minReservationTime: new Date(2000, 1, 31, 1, 0, 0, 0),
            maxReservationTime: new Date(2000, 1, 31, 23, 59, 59, 0),
            description: "",
            //resources: [],
            submitted: false
        });
    }

    render() {
        const { submitted, name, minReservationTime, maxReservationTime, description } = this.state;

        return (
            <div className="submit-form">
                {submitted ? (
                    <div>
                        <h4>A szolgáltató sikeresen mentésre került.</h4>
                        <button className="btn btn-success" onClick={this.newResourceProvider}>
                            Új szolgáltató felvétele
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="form-group">
                            <label htmlFor="name">Név</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                value={name}
                                onChange={this.onChangeName}
                                name="name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="minTime">Legrövidebb lehetséges foglalási idő</label>
                            <input
                                type="time"
                                className="form-control"
                                id="minTime"
                                required
                                value={minReservationTime.getHours.toString() + ":" + minReservationTime.getMinutes.toString()}
                                onChange={this.onChangeMinTime}
                                name="minTime"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="maxTime">Leghosszabb lehetséges foglalási idő</label>
                            <input
                                type="time"
                                className="form-control"
                                id="maxTime"
                                required
                                value={maxReservationTime.getHours.toString() + ":" + maxReservationTime.getMinutes.toString()}
                                onChange={this.onChangeMaxTime}
                                name="maxTime"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Leírás</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                required
                                value={description}
                                onChange={this.onChangeDescription}
                                name="description"
                            />
                        </div>

                        <button onClick={this.saveResourceProvider} className="btn btn-success">
                            Mentés
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
