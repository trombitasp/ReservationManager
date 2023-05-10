import { Component, ChangeEvent } from "react";
import UserDataService from "../../services/UserService";
import { Link } from "react-router-dom";
import IUserModel from '../../models/UserModel';

type Props = {};

type State = {
	users: Array<IUserModel>,
	currentUser: IUserModel | null,
	currentIndex: number,
	searchName: string
};

export default class TutorialsList extends Component<Props, State>{
	constructor(props: Props) {
		super(props);
		this.onChangeSearchName = this.onChangeSearchName.bind(this);
		this.retrieveUsers = this.retrieveUsers.bind(this);
		this.refreshList = this.refreshList.bind(this);
		this.setCurrentUser = this.setCurrentUser.bind(this);
		this.removeAllTutorials = this.removeAllTutorials.bind(this);
		this.searchName = this.searchName.bind(this);

		this.state = {
			users: [],
			currentUser: null,
			currentIndex: -1,
			searchName: ""
		};
	}

	componentDidMount() {
		this.retrieveUsers();
	}

	onChangeSearchName(e: ChangeEvent<HTMLInputElement>) {
		const searchName = e.target.value;
		this.setState({
			searchName: searchName
		});
	}

	retrieveUsers() {
		UserDataService.getAll()
			.then((response: any) => {
				this.setState({
					users: response.data
				});
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
	}

	refreshList() {
		this.retrieveUsers();
		this.setState({
			currentUser: null,
			currentIndex: -1
		});
	}

	setCurrentUser(user: IUserModel, index: number) {
		this.setState({
			currentUser: user,
			currentIndex: index
		});
	}

	removeAllTutorials() {
		UserDataService.delete(1000000)		// TODO
			.then((response: any) => {
				console.log(response.data);
				this.refreshList();
			})
			.catch((e: Error) => {
				console.log(e);
			});
	}

	searchName() {
		this.setState({
			currentUser: null,
			currentIndex: -1
		});

		UserDataService.findByName(this.state.searchName)
			.then((response: any) => {
				this.setState({
					users: response.data
				});
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
	}

	render() {
		const { searchName, users, currentUser, currentIndex } = this.state;

		return (
			<div className="list row">
				<div className="col-md-8">
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control"
							placeholder="Keresés név alapján"
							value={searchName}
							onChange={this.onChangeSearchName}
						/>
						<div className="input-group-append">
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={this.searchName} >
								Keresés
							</button>
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<h4>Felhasználók listája</h4>

					<ul className="list-group">
						{ users &&
							users.map((user: IUserModel, index: number) => (
								<li
									className={ "list-group-item " + (index === currentIndex ? "active" : "") }
									onClick={ () => this.setCurrentUser(user, index) }
									key={ index }
								>
									{ user.name }
								</li>
							))}
					</ul>

					<button
						className="m-3 btn btn-sm btn-danger"
						onClick={this.removeAllTutorials} >
						Összes felhasználó törlése
					</button>
				</div>
				<div className="col-md-6">
					{currentUser ? (
						<div>
							<h4>Felhasználó adatai:</h4>
							<div>
								<label>
									<strong>Név:</strong>
								</label>{" "}
								{currentUser.name}
							</div>
							<div>
								<label>
									<strong>Felhasználói jog:</strong>
								</label>{" "}
								{currentUser.role}
							</div>
							<div>
								<label>
									<strong>Korábbi foglalások:</strong>
								</label>{" "}
								{"azok a foglalások, amiknek usere ez > 0" ? "TODO adott felhasználó foglalásainek lekérése" : "Nincs foglalás."}
							</div>

							<Link
								to={"/users/" + currentUser.id}
								className="m-3 btn btn-sm btn-warning">
								Módosít
							</Link>
						</div>
					) : (
						<div>
							<br />
							<p>Kattints az egyik felhasználóra a listából!</p>
						</div>
					)}
				</div>
			</div>
		);
	}
}