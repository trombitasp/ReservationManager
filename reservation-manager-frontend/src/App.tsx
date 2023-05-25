import React, { Component } from 'react';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddUser from './components/user/AddUserComponent';
import ResourceProviderList from './components/resourceProvider/ResourceProviderListComponent';
import UserList from './components/user/UserListComponent';
import ResourceList from './components/resource/ResourceListComponent';
import ReservationList from './components/reservation/ReservationListCoomponent';
import AddReservation from './components/reservation/AddReservationComponent';
import UserDetail from './components/user/UserDetailComponent';
import ResourceProviderDetails from './components/resourceProvider/ResourceProviderDetailsComponent';
import ResourceDetails from './components/resource/ResourceDetailsComponent';
import AuthService from './services/auth/AuthService';
import IUserModel from './models/UserModel';
import Register from './components/user/RegisterComponent';
import Profile from './components/user/ProfileComponent';
import Login from './components/user/LoginComponent';
import AddResourceProvider from './components/resourceProvider/AddResourceProviderComponent';


type Props = {};

type State = {
	role_logged_in: boolean,
	role_admin: boolean,
	currentUser: IUserModel | undefined
}

class App extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.logOut = this.logOut.bind(this);

		this.state = {
			role_logged_in: false,
			role_admin: false,
			currentUser: undefined,
		};
	}

	componentDidMount() {
		const user = AuthService.getCurrentUser();
		if (user) {
			this.setState({
				currentUser: user,
				role_logged_in: user.roles.includes("LOGGED_IN") || user.roles.includes("logged_in"),
				role_admin: user.roles.includes("ADMIN") || user.roles.includes("admin"),
			});
		}
		//EventBus.on("logout", this.logOut);	TODO: ez kell-e?
	}

	logOut() {
		AuthService.logout();
		this.setState({
			role_logged_in: false,
			role_admin: false,
			currentUser: undefined,
		});
		window.location.reload();
	}

	render() {
		const { currentUser, role_logged_in, role_admin } = this.state;

		return (
			<div>
				<nav className="navbar navbar-expand navbar-dark bg-dark">
					<div className="container-fluid">
						<Link to={"/"} className="navbar-brand mr-0 mr-md-2">
							Foglaláskezelő
						</Link>
						<div className='collapse navbar-collapse'>
							<ul className="navbar-nav mr-auto mb-2 mb-lg-0">
								<li className="nav-item">
									<Link to={"/resourceproviders"} className="nav-link">
										Szolgáltatók
									</Link>
								</li>
								<li className="nav-item">
									<Link to={"/resources"} className="nav-link">
										Összes foglalható dolog
									</Link>
								</li>
								{currentUser && (
									<li className="nav-item">
										<Link to={"/reservations/user/1"} className="nav-link">
											Korábbi foglalásaid
										</Link>
									</li>
								)}
								{currentUser && role_admin && (
									<li className="nav-item">
										<Link to={"/users"} className="nav-link">
											Felhasználók
										</Link>
									</li>
								)}
							</ul>
						</div>
						<ul className='navbar-nav d-flex'>
							<li className="nav-item">
								<Link to={"/users"} className="nav-link">
									Profil adatok / Bejelentkezés
								</Link>
							</li>
							{currentUser ? (	// profil + logout  VAGY  login + singin
								<div className="navbar-nav ml-auto">
									<li className="nav-item">
										<Link to={"/profile"} className="nav-link">
											{currentUser.username}
										</Link>
									</li>
									<li className="nav-item">
										<a href="/login" className="nav-link" onClick={this.logOut}>
											Kijelentkezés
										</a>
									</li>
								</div>
							) : (
								<div className="navbar-nav ml-auto">
									<li className="nav-item">
										<Link to={"/login"} className="nav-link">
											Bejelentkezés
										</Link>
									</li>
									<li className="nav-item">
										<Link to={"/register"} className="nav-link">
											Regisztrálás
										</Link>
									</li>
								</div>
							)}
						</ul>
					</div>
				</nav>

				<div className="container mt-3">
					<Routes>
						{['/', '/resourceproviders'].map(path => <Route key={"0"} path={path} element={<ResourceProviderList />} />)}
						<Route key={"1"} path="/adduser" element={<AddUser />} />
						<Route key={"2"} path="/users" element={<UserList />} />
						{['/resources/provider/:id', '/resources'].map(path => <Route key={"01"} path={path} element={<ResourceList />} />)}
						<Route key={"3"} path="/reservations/resource/:id" element={<AddReservation />} />
						<Route key={"4"} path="/users/:id" element={<UserDetail />} />
						<Route key={"5"} path="/resourceproviders/:id" element={<ResourceProviderDetails />} />
						<Route key={"6"} path="/resources/:id" element={<ResourceDetails />} />
						<Route key={"7"} path="/reservations/user/:id" element={<ReservationList />} />
						<Route key={"8"} path='/register' element={<Register />} />
						<Route key={"9"} path='/profile' element={<Profile />} />
						<Route key={"10"} path='/login' element={<Login />} />
						<Route key={"11"} path='/resourceproviders/new' element={<AddResourceProvider />} />
					</Routes>
				</div>
			</div>
			// TODO: /profile pathra a bejelentkezett felh. userdetail oldala





			/*<nav className="navbar navbar-inverse navbar-fixed-top">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
								data-target="#navbar"
								aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<span className="navbar-brand">Webshop</span>
					</div>
					<div id="navbar" className="navbar-collapse collapse">
						<ul className="nav navbar-nav">
							<li data-state="shop" ><a><span className="glyphicon glyphicon-th"></span></a></li>
							<li data-state="cart" ><a><span className="glyphicon glyphicon-shopping-cart"></span></a></li>
							<li data-state="chat" ><a><span className="glyphicon glyphicon-comment"></span></a></li>
						</ul>
					</div>
				</div>
			</nav>*/

			/*<div className="App">
			  <header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
				  Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
				  className="App-link"
				  href="https://reactjs.org"
				  target="_blank"
				  rel="noopener noreferrer"
				>
				  Learn React
				</a>
			  </header>
			</div>*/
		);
	}
}

export default App;
