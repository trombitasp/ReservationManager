import { Component, ChangeEvent } from "react";
import UserDataService from "../../services/UserService";
import IUserModel from "../../models/UserModel";

type Props = {};

type State = IUserModel & {
	submitted: boolean;
};

export default class AddUser extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeRole = this.onChangeRole.bind(this);
		//this.onChangeReservations = this.onChangeReservations.bind(this);
		this.saveUser = this.saveUser.bind(this);
		this.newUser = this.newUser.bind(this);

		this.state = {
			id: null,
			username: "",
			password: "",
			email: "",
			roles: ["DEFAULT"],
			//reservations: [],	// new Array<IReservationModel>(), ha a teljes reservation-öket eltároljuk id helyett
			submitted: false
		};
	}

	onChangeName(e: ChangeEvent<HTMLInputElement>) {
		this.setState({
			username: e.target.value,
		});
	}

	onChangeRole(e: ChangeEvent<HTMLInputElement>) {
		this.setState({
			//roles: e.target.value,		// TODO
		});
	}

	/*onChangeReservations(e: ChangeEvent<HTMLInputElement>) {
		this.setState({
			reservations: [parseInt(e.target.value)],
		});
	}*/

	saveUser() {
		const data: IUserModel = {
			username: this.state.username,
			email: this.state.email,
			password: this.state.password,
			roles: this.state.roles
			//reservations: this.state.reservations,
		};

		UserDataService.create(data)
			.then((response: any) => {
				this.setState({
					id: response.data.id,
					username: response.data.name,
					email: response.data.email,
					password: response.data.password,
					roles: response.data.roles,
					//reservations: response.data.reservations,
					submitted: true
				});
				console.log(response.data + "created.");
			})
			.catch((e: Error) => {
				console.log(e);
			});
	}

	newUser() {
		this.setState({
			id: null,
			username: "",
			password: "",
			email: "",
			roles: ["DEFAULT"],
			//reservations: [],
			submitted: false
		});
	}

	render() {
		const { submitted, username, roles } = this.state;

		return (
		  <div className="submit-form">
			{submitted ? (
			  <div>
				<h4>A felhasználó sikeresen mentésre került.</h4>
				<button className="btn btn-outline-success" onClick={this.newUser}>
					Új felhasználó felvétele
				</button>
			  </div>
			) : (
			  <div>
				<div className="form-group">
				  <label htmlFor="username">Név</label>
				  <input
					type="text"
					className="form-control"
					id="username"
					required
					value={username}
					onChange={this.onChangeName}
					name="username"
				  />
				</div>
				<div className="form-group">
				  <label htmlFor="roles">Felhasználói jog</label>
				  <input
					type="text"
					className="form-control"
					id="roles"
					required
					value={roles[0]/* TODO: nem text kell, hanem checkboxok mondjuk*/}
					onChange={this.onChangeRole}
					name="roles"
				  />
				</div>
	
				<button onClick={this.saveUser} className="btn btn-outline-success">
				  Mentés
				</button>
			  </div>
			)}
		  </div>
		);
	}
}
