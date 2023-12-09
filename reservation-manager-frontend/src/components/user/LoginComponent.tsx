import { Component } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../../services/auth/AuthService";

type Props = {};

type State = {
    redirect: string | null,
    username: string,
    password: string,
    loading: boolean,
    message: string
};

export default class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            redirect: null,
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (currentUser) {
            this.setState({ redirect: "/profile" });
        };
    }

    /*componentWillUnmount() {      // ne használd a componentWillUnmount-ot, mert egyből meghívódik valamiért, és egyből reload-olna
        console.log('redirect1');
        //window.location.reload();
    }*/

    validationSchema() {
        return Yup.object().shape({
            username: Yup.string().required("Ez a mező kötelező!"),
            password: Yup.string().required("Ez a mező kötelező!"),
        });
    }

    handleLogin(formValue: { username: string; password: string }) {
        const { username, password } = formValue;

        this.setState({
            message: "",
            loading: true
        });


        AuthService.login(username, password).then(
            () => {
                this.setState({
                    redirect: "/profile"
                });
                window.location.reload();
            },
            error => {
                const responseMessage =
                    (error.response && error.response.data && error.response.data.message) || error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: responseMessage
                });
            }
        );
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }

        const { loading, message } = this.state;

        const initialValues = {
            username: "",
            password: "",
        };

        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src={"//ssl.gstatic.com/accounts/ui/avatar_2x.png"}
                        alt="profile-img"
                        className="profile-img-card"
                    />
                    <Formik
                        initialValues={initialValues}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleLogin}>
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username">Felhasználónév</label>
                                <Field name="username" type="text" className="form-control" />
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Jelszó</label>
                                <Field name="password" type="password" className="form-control" />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <button type="submit" className="mt-3 btn btn-outline-primary btn-block" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Bejelentkezés</span>
                                </button>
                            </div>

                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                        </Form>
                    </Formik>
                </div>
            </div>
        );
    }
}