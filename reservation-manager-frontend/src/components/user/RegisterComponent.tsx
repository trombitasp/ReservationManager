import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import logo from "../../logo.svg"
import AuthService from "../../services/auth/AuthService";

type Props = {};

type State = {
    username: string,
    email: string,
    password: string,
    successful: boolean,
    message: string
};

export default class Register extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);

        this.state = {
            username: "",
            email: "",
            password: "",
            successful: false,
            message: ""
        };
    }

    validationSchema() {
        return Yup.object().shape({
            username: Yup.string()
                .test(
                    "len",
                    "A felhasználónév hossza 3 és 20 karakter között kell, hogy legyen.",
                    (val: any) =>
                        val &&
                        val.toString().length >= 3 &&
                        val.toString().length <= 20
                )
                .required("Ez a mező kötelező!"),
            email: Yup.string()
                .email("A beírt érték nem egy email cím!")
                .required("Ez a mező kötelező!"),
            password: Yup.string()
                .test(
                    "len",
                    "A felhasználónév hossza 6 és 40 karakter között kell, hogy legyen.",
                    (val: any) =>
                        val &&
                        val.toString().length >= 6 &&
                        val.toString().length <= 40
                )
                .required("Ez a mező kötelező!"),
        });
    }

    handleRegister(formValue: { username: string; email: string; password: string }) {
        const { username, email, password } = formValue;

        this.setState({
            message: "",
            successful: false
        });

        AuthService.register(username, email, password)
        .then(
            response => {
                this.setState({
                    message: response.data.message,
                    successful: true
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        const { successful, message } = this.state;

        const initialValues = {
            username: "",
            email: "",
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
                        onSubmit={this.handleRegister}>
                            
                        <Form>
                            {!successful && (
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="username"> Felhasználónév </label>
                                        <Field name="username" type="text" className="form-control" />
                                        <ErrorMessage
                                            name="username"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email"> Email </label>
                                        <Field name="email" type="email" className="form-control" />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password"> Jelszó </label>
                                        <Field
                                            name="password"
                                            type="password"
                                            className="form-control"
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button type="submit" className="btn btn-outline-primary btn-block">Regisztrálás</button>
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div className="form-group">
                                    <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
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