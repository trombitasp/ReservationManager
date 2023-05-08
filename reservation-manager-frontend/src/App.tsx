import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddUser from './components/user/AddUserComponent';
import ResourceProviderList from './components/resourceProvider/ResourceProviderListComponent';
import UserListComponent from './components/user/UserListComponent';


class App extends Component {
	render() {

		return (
			<div>
				<nav className="navbar navbar-expand navbar-dark bg-dark">
					<a href="/tutorials" className="navbar-brand">
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
							<Link to={"/reservations"} className="nav-link">
								Korábbi foglalások általad
							</Link>
						</li>
						<li className="nav-item">
							<Link to={"/users"} className="nav-link">
								Profil adatok / Bejelentkezés
							</Link>
						</li>
						<li className="nav-item">
							<Link to={"/users"} className="nav-link">
								Felhasználók
							</Link>
						</li>
					</div>
				</nav>

				<div className="container mt-3">
					
					<Routes>
						{['/', '/resourceproviders'].map(path => <Route path={path} element={<ResourceProviderList/>} />)}
						<Route path="/adduser" element={<AddUser/>} />
						<Route path="/users" element={<UserListComponent/>} />
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
