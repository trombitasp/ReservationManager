import React, { Component } from 'react';
import logo from './logo.svg';
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

class App extends Component {
	render() {

		return (
			<div>
				<nav className="navbar navbar-expand navbar-dark bg-dark">
					<a href="/" className="navbar-brand">
						Foglaláskezelő
					</a>
					<div className="navbar-nav mr-auto">
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
						<li className="nav-item">
							<Link to={"/reservations/user/1"} className="nav-link">
								Korábbi foglalásaid
							</Link>
						</li>
						<li className="nav-item">
							<Link to={"/users"} className="nav-link">
								Felhasználók
							</Link>
						</li>
						<li className="nav-item">
							<Link to={"/users"} className="nav-link">
								Profil adatok / Bejelentkezés
							</Link>
						</li>
					</div>
				</nav>

				<div className="container mt-3">
					<Routes>
						{['/', '/resourceproviders'].map(path => <Route path={path} element={<ResourceProviderList/>} />)}
						<Route path="/adduser" element={<AddUser/>} />
						<Route path="/users" element={<UserList/>} />
						{['/resources/provider/:id', '/resources'].map(path => <Route path={path} element={<ResourceList/>} />)}
						<Route path="/reservations/resource/:id" element={<AddReservation/>} />
						<Route path="/users/:id" element={<UserDetail/>} />
						<Route path="/resourceproviders/:id" element={<ResourceProviderDetails/>} />
						<Route path="/resources/:id" element={<ResourceDetails/>} />
						<Route path="/reservations/user/:id" element={<ReservationList/>}/>
					</Routes>
				</div>
			</div>

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
