import { Component, ChangeEvent } from "react";
import IResourceModel from "../../models/ResourceModel";
import ResourceDataService from "../../services/ResourceService";
import IResourceProviderModel from "../../models/ResourceProviderModel";
import ResourceProviderDataService from "../../services/ResourceProviderService";
import { withRouter, WithRouterProps } from "../../util/withRouter";
import IUserModel from "../../models/UserModel";
import AuthService from "../../services/auth/AuthService";

interface Params {
    id: string;
}

type Props = WithRouterProps<Params>;

type State = IResourceModel & {
    submitted: boolean,
    currentUser: IUserModel | undefined,
    role_admin: boolean
};

class AddResource extends Component<Props, State> {
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
            submitted: false,
            currentUser: undefined,
            role_admin: false
        };
        
    }

    componentDidMount() {
        this.getProviderById(this.props.match.params.id);
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                role_admin: user.roles.includes("ADMIN") || user.roles.includes("admin"),
            });
        }
    }
    
    getProviderById(id: string) {
        if (typeof id === 'undefined' || id.length === 0) {
            return;
        }
        ResourceProviderDataService.findById(id)
            .then((response: any) => {
                console.log(response.data)
                this.setState({
                    resourceProvider: response.data
                })
            })
            .catch((e: Error) => {
                console.log(e);
            });
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

    saveResource() {
        const data: IResourceModel = {
            name: this.state.name,
            description: this.state.description,
            resourceProvider: this.state.resourceProvider,
        };

        ResourceDataService.create(data)
            .then((response: any) => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    description: response.data.description,
                    resourceProvider: response.data.resourceProvider,
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
            submitted: false
        });
    }

    render() {
        const { submitted, name, description, currentUser, role_admin } = this.state;

        return (
            <div className="submit-form">
                <h4>Új erőforrás felvétele</h4>
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
                                disabled={!(currentUser && role_admin)}
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
                                disabled={!(currentUser && role_admin)}
                                value={description}
                                onChange={this.onChangeDescription}
                                name="description"
                            />
                        </div>
                        {(currentUser && role_admin) ? (
                            <button onClick={this.saveResource} className="mt-3 btn btn-success">
                            Mentés
                        </button>
                        ) : (
                            <div className="m-3">Új erőforrás felvételéhez admin jogosultságú bejelentkezés szükséges!</div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(AddResource);