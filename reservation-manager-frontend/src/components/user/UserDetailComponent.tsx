import { Component, ChangeEvent } from "react";
import { withRouter, WithRouterProps } from "../../util/withRouter";

import UserDataService from "../../services/UserService";
import IUserModel from "../../models/UserModel";

interface RouterProps { // type for `match.params`
    id: string; // must be type `string` since value comes from the URL
}

type Props = WithRouterProps<RouterProps>;

type State = {
    currentUser: IUserModel;
    message: string;
}

class UserDetails extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.getUser = this.getUser.bind(this);
        //this.updatePublished = this.updatePublished.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

        this.state = {
            currentUser: {
                id: null,
                username: "",
                email: "",
                password: "",
                roles: ["DEFAULT"]
            },
            message: "",
        };
    }

    componentDidMount() {
        this.getUser(this.props.match.params.id);
    }

    onChangeName(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.value;
        this.setState(function (prevState) {
            return {
                currentUser: {
                    ...prevState.currentUser,
                    username: name,
                },
            };
        });
    }

    onChangeRole(e: ChangeEvent<HTMLInputElement>) {
        const role = e.target.value;

        this.setState((prevState) => ({
            currentUser: {
                ...prevState.currentUser,
                role: role,
            },
        }));
    }

    getUser(id: string) {
        UserDataService.findById(id)
            .then((response: any) => {
                this.setState({
                    currentUser: response.data,
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    /*updatePublished(status: boolean) {
        const data: IUserModel = {
            id: this.state.currentUser.id,
            title: this.state.currentUser.title,
            description: this.state.currentUser.description,
            published: status,
        };

        UserDataService.update(data, this.state.currentUser.id)
            .then((response: any) => {
                this.setState((prevState) => ({
                    currentUser: {
                        ...prevState.currentUser,
                        published: status,
                    },
                    message: "The status was updated successfully!"
                }));
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }*/

    updateUser() {
        UserDataService.update(this.state.currentUser, this.state.currentUser.id!)
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

    deleteUser() {
        UserDataService.delete(this.state.currentUser.id!)
            .then((response: any) => {
                console.log(response.data);
                this.props.history.push("/resourceproviders");
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    render() {
        const { currentUser } = this.state;

        return (
            <div>
                {currentUser ? (
                    <div className="edit-form">
                        <h4>Felhasználó adatainak szerkesztése</h4>
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Név:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={currentUser.username}
                                    onChange={this.onChangeName}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Felhasználói jog:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="role"
                                    value={currentUser.roles}
                                    onChange={this.onChangeRole}
                                />
                            </div>
                        </form>
                        {/*currentUser.published ? (
                            <button
                                className="badge badge-primary mr-2"
                                onClick={() => this.updatePublished(false)}
                            >
                                UnPublish
                            </button>
                        ) : (
                            <button
                                className="badge badge-primary mr-2"
                                onClick={() => this.updatePublished(true)}
                            >
                                Publish
                            </button>
                        )*/}
                        <button
                            type="submit"
                            className="m-3 btn btn-sm btn-outline-success"
                            onClick={this.updateUser}>
                            Mentés
                        </button>
                        <button
                            className="m-3 btn btn-sm btn-outline-danger"
                            onClick={this.deleteUser}>
                            Törlés
                        </button>
                        <button
                            className="m-3 btn btn-sm btn-outline-secondary"
                            onClick={this.props.history.back}>
                            Mégsem
                        </button>
                        <p className="greenText">{this.state.message}</p>
                    </div>
                ) : (
                    <div>
                        <br />
                        <p>Válassz egy felhasználót a listából!</p>
                    </div>
                )}
            </div>
        );
    }
}
export default withRouter(UserDetails)