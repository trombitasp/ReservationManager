import { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../../services/auth/AuthService";
import IUserModel from "../../models/UserModel";

type Props = {};

type State = {
    redirect: string | null,
    userReady: boolean,
    currentUser: IUserModel & { accessToken: string }
}
export default class Profile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { 
                id: null,
                username: "",
                password: "",
                email: "",
                roles: ["DEFAULT"],
                accessToken: "" 
            }
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({ redirect: "/" });
        this.setState({ currentUser: currentUser, userReady: true })
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }

        const { currentUser } = this.state;

        return (
            <div className="container">
                {(this.state.userReady) ?
                    <div>
                        <header className="jumbotron">
                            <h3>
                                <strong>{currentUser.username}</strong> Profil
                            </h3>
                        </header>
                        <p>
                            <strong>Token:</strong>{" "}
                            {currentUser.accessToken.substring(0, 20)} ...{" "}
                            {currentUser.accessToken.substring(currentUser.accessToken.length - 20)}
                        </p>
                        <p>
                            <strong>Felhasználónév:</strong>{" "}
                            {currentUser.username}
                        </p>
                        <p>
                            <strong>Email:</strong>{" "}
                            {currentUser.email}
                        </p>
                        <strong>Jogosoultságok:</strong>
                        <ul>
                            {currentUser.roles &&
                                currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                        </ul>
                    </div> : null}
            </div>
        );
    }
}