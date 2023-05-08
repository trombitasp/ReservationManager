import { Component, ChangeEvent } from "react";
import IResourceModel from "../../models/ResourceModel";
import ResourceDataService from "../../services/ResourceService";
import IResourceProviderModel from "../../models/ResourceProviderModel";

type Props = {};

type State = IResourceModel & {
    submitted: boolean;
};

export default class AddResource extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveResource = this.saveResource.bind(this);
        this.newResource = this.newResource.bind(this);
        this.newResourceProvider = this.newResourceProvider.bind(this);

        this.state = {
            id: null,
            name: "",
            description: "",
            resourceProvider: this.newResourceProvider(),
            //reservation: -1,
            submitted: false
        };
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

    onChangeName(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: e.target.value,
        });
    }

    onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            description: e.target.value,
        });
    }

    /*onChangeResourceProvider(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            resourceProvider: [+e.target.value],
        });
    }
    OnChangeReservations(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            reservation: [+e.target.value],
        });
    }*/

    saveResource() {
        const data: IResourceModel = {
            name: this.state.name,
            description: this.state.description,
            resourceProvider: this.state.resourceProvider,
            //reservation: this.state.reservation
        };

        ResourceDataService.create(data)
            .then((response: any) => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    description: response.data.description,
                    resourceProvider: response.data.resourceProvider,
                    //reservation: response.data.reservation,
                    submitted: true
                });
                console.log(response.data + "created.");
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    newResource() {
        this.setState({
            id: null,
            name: "",
            description: "",
            resourceProvider: this.newResourceProvider(),
            //reservation: -1,
            submitted: false
        });
    }

    render() {
        const { submitted, name,  description } = this.state;

        return (
            <div className="submit-form">
                {submitted ? (
                    <div>
                        <h4>A foglalható erőforrás sikeresen mentésre került.</h4>
                        <button className="btn btn-success" onClick={this.newResource}>
                            Új erőforrás felvétele
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


                        <button onClick={this.saveResource} className="btn btn-success">
                            Mentés
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
