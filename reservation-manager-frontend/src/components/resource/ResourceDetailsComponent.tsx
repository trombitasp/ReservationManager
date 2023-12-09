import { Component, ChangeEvent } from "react";
import { withRouter, WithRouterProps } from "../../util/withRouter";

import ResourceDataService from "../../services/ResourceService";
import IResourceModel from "../../models/ResourceModel";
import IResourceProviderModel from "../../models/ResourceProviderModel";
import IUserModel from "../../models/UserModel";
import AuthService from "../../services/auth/AuthService";

interface RouterProps { // type for `match.params`
    id: string; // must be type `string` since value comes from the URL
}

type Props = WithRouterProps<RouterProps>;

type State = {
    currentResource: IResourceModel;
    message: string;
    currentUser: IUserModel | undefined,
    role_admin: boolean
}

class ResourceDetails extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.getResource = this.getResource.bind(this);
        //this.updatePublished = this.updatePublished.bind(this);
        this.updateResource = this.updateResource.bind(this);
        this.deleteResource = this.deleteResource.bind(this);

        this.state = {
            currentResource: {
                id: null,
                name: "",
                description: "",
                resourceProvider: this.newResourceProvider()
            },
            message: "",
            role_admin: false,
            currentUser: undefined
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

    componentDidMount() {
        this.getResource(this.props.match.params.id);

        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user,
                role_admin: user.roles.includes("ADMIN") || user.roles.includes("admin"),
            });
        }
    }

    onChangeName(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.value;
        this.setState(function (prevState) {
            return {
                currentResource: {
                    ...prevState.currentResource,
                    name: name,
                },
            };
        });
    }

    onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
        const description = e.target.value;

        this.setState((prevState) => ({
            currentResource: {
                ...prevState.currentResource,
                description: description,
            },
        }));
    }

    getResource(id: string) {
        ResourceDataService.findById(id)
            .then((response: any) => {
                this.setState({
                    currentResource: response.data,
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    updateResource() {
        ResourceDataService.update(this.state.currentResource, this.state.currentResource.id!)
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

    deleteResource() {
        ResourceDataService.delete(this.state.currentResource.id!)
            .then((response: any) => {
                console.log(response.data);
                this.props.history.push("/resourceproviders");
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    render() {
        const { currentResource, currentUser, role_admin } = this.state;
        return (
            <div>
                {currentResource ? (
                    <div className="edit-form">
                        <h3>Erőforrás adatainak szerkesztése</h3>
                        <h4>{currentResource.resourceProvider.name}</h4>
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Név:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    disabled={!currentUser || !role_admin}
                                    value={currentResource.name}
                                    onChange={this.onChangeName}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Leírás:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="role"
                                    disabled={!currentUser || !role_admin}
                                    value={currentResource.description}
                                    onChange={this.onChangeDescription}
                                />
                            </div>
                        </form>
                        {(currentUser && role_admin) ? (
                            <div className="d-flex justify-content-center">
                                <button
                                    type="submit"
                                    className="m-3 btn btn-sm btn-outline-success"
                                    onClick={this.updateResource}>
                                    Mentés
                                </button>
                                <button
                                    className="m-3 btn btn-sm btn-outline-danger"
                                    onClick={this.deleteResource}>
                                    Törlés
                                </button>
                                <button
                                    className="m-3 btn btn-sm btn-outline-secondary"
                                    onClick={this.props.history.back}>
                                    Mégsem
                                </button>
                            </div>
                        ) : (
                            <div>
                                Jelentkezz be további funkciókért!
                                <button
                                    className="m-3 btn btn-sm btn-outline-secondary"
                                    onClick={this.props.history.back}>
                                    Mégsem
                                </button>
                            </div>
                        )}
                        <p className="greenText">{this.state.message}</p>
                    </div>
                ) : (
                    <div>
                        <br />
                        <p>Válassz egy erőforrást a listából!</p>
                    </div>
                )}
            </div>
        );
    }
}
export default withRouter(ResourceDetails)