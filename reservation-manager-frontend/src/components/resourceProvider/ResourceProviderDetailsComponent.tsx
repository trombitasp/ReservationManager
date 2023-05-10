import { Component, ChangeEvent } from "react";
import { withRouter, WithRouterProps } from "../../util/withRouter";

import ResourceProviderDataService from "../../services/ResourceProviderService";
import IResourceProviderModel from "../../models/ResourceProviderModel";

interface RouterProps { // type for `match.params`
    id: string; // must be type `string` since value comes from the URL
}

type Props = WithRouterProps<RouterProps>;

type State = {
    currentProvider: IResourceProviderModel;
    message: string;
    minHours: string;
    minMinutes: string;
    maxHours: string;
    maxMinutes: string;
}

class ResourceProviderDetails extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeMinTime = this.onChangeMinTime.bind(this);
        this.onChangeMaxTime = this.onChangeMaxTime.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.getProvider = this.getProvider.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteProvider = this.deleteProvider.bind(this);

        this.state = {
            currentProvider: {
                id: null,
                name: "",
                minReservationTime: new Date(2000, 1, 31, 1, 0, 0, 0),
                maxReservationTime: new Date(2000, 1, 31, 23, 59, 59, 0),
                description: "",
            },
            message: "",
            minHours: "00",
            minMinutes: "00",
            maxHours: "00",
            maxMinutes: "00"
        };
    }

    componentDidMount() {
        this.getProvider(this.props.match.params.id);
        this.setState({
            minHours: this.state.currentProvider.minReservationTime.getHours().toString(),
            minMinutes: this.state.currentProvider.minReservationTime.getMinutes().toString(),
            maxHours: this.state.currentProvider.maxReservationTime.getHours().toString(),
            maxMinutes: this.state.currentProvider.maxReservationTime.getMinutes().toString()
        })
    }

    onChangeName(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.value;
        this.setState(function (prevState) {
            return {
                currentProvider: {
                    ...prevState.currentProvider,
                    name: name,
                },
            };
        });
    }

    onChangeMinTime(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value === undefined) {
            return;
        }
        let [hours, minutes] = e.target.value.split(":");    // input type="time" értékét spliteljük ketté órára és percre
        const doubleDigitHours = this.toDoubleDigits(hours);
        const doubleDigitMinutes = this.toDoubleDigits(minutes);
        this.setState(function (prevState) {
            return {
                currentProvider: {
                    ...prevState.currentProvider,
                    minReservationTime: new Date(2000, 1, 31, +hours, +minutes, 0, 0),
                },
                minHours: doubleDigitHours,
                minMinutes: doubleDigitMinutes
            };
        });
    }

    onChangeMaxTime(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value === undefined) {
            return;
        }
        let [hours, minutes] = e.target.value.split(":");    // input type="time" értékét spliteljük ketté órára és percre
        const doubleDigitHours = this.toDoubleDigits(hours);
        const doubleDigitMinutes = this.toDoubleDigits(minutes);
        this.setState(function (prevState) {
            return {
                currentProvider: {
                    ...prevState.currentProvider,
                    maxReservationTime: new Date(2000, 1, 31, +hours, +minutes, 0, 0),
                },
                maxHours: doubleDigitHours,
                maxMinutes: doubleDigitMinutes
            };
        });
    }

    onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
        const description = e.target.value;
        this.setState(function (prevState) {
            return {
                currentProvider: {
                    ...prevState.currentProvider,
                    description: description,
                },
            };
        });
    }

    getProvider(id: string) {
        ResourceProviderDataService.findById(id)
            .then((response: any) => {
                this.setState({
                    currentProvider: response.data,
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    updateUser() {
        ResourceProviderDataService.update(this.state.currentProvider, this.state.currentProvider.id!)
            .then((response: any) => {
                console.log(response.data);
                this.setState({
                    message: "A felhasználó adatai frissítve.",
                });
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    deleteProvider() {
        ResourceProviderDataService.delete(this.state.currentProvider.id!)
            .then((response: any) => {
                console.log(response.data);
                this.props.history.push("/resourceproviders");
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    toDoubleDigits(num: string): string {
        if (num.length > 1) {
            return num;
        }
        return "0" + num;
    }

    render() {
        const { currentProvider } = this.state;

        return (
            <div>
                {currentProvider ? (
                    <div className="edit-form">
                        <h4>Felhasználó adatainak szerkesztése</h4>
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Név:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    required
                                    value={currentProvider.name}
                                    onChange={this.onChangeName}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="minTime">Legrövidebb lehetséges foglalási idő</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="minTime"
                                    required
                                    value={`${this.toDoubleDigits(this.state.minHours)}:${this.toDoubleDigits(this.state.minMinutes)}`}
                                    onChange={this.onChangeMinTime}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="maxTime">Leghosszabb lehetséges foglalási idő</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="maxTime"
                                    required
                                    value={`${this.toDoubleDigits(this.state.maxHours)}:${this.toDoubleDigits(this.state.maxMinutes)}`}
                                    onChange={this.onChangeMaxTime}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Leírás</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    value={currentProvider.description}
                                    onChange={this.onChangeDescription}
                                />
                            </div>
                        </form>
                        <button
                            type="submit"
                            className="m-3 btn btn-sm btn-success"
                            onClick={this.updateUser}>
                            Mentés
                        </button>
                        <button
                            className="m-3 btn btn-sm btn-danger"
                            onClick={this.deleteProvider}>
                            Törlés
                        </button>
                        <button
                            className="m-3 btn btn-sm btn-secondary"
                            onClick={this.props.history.back}>
                            Mégsem
                        </button>
                        <p className="greenText">{this.state.message}</p>
                    </div>
                ) : (
                    <div>
                        <br />
                        <p>Válassz egy szolgáltatót a listából!</p>
                    </div>
                )}
            </div>
        );
    }
}
export default withRouter(ResourceProviderDetails)