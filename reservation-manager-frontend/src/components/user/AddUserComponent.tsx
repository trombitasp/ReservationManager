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
		this.onChangeReservations = this.onChangeReservations.bind(this);
		this.saveUser = this.saveUser.bind(this);
		this.newUser = this.newUser.bind(this);

		this.state = {
			id: null,
			name: "",
			role: "default",
			reservations: [],	// new Array<IReservationModel>(), ha a teljes reservation-öket eltároljuk id helyett
			submitted: false,
		};
	}

	onChangeName(e: ChangeEvent<HTMLInputElement>) {
		this.setState({
			name: e.target.value,
		});
	}

	onChangeRole(e: ChangeEvent<HTMLInputElement>) {
		this.setState({
			role: e.target.value,
		});
	}

	onChangeReservations(e: ChangeEvent<HTMLInputElement>) {
		this.setState({
			reservations: [parseInt(e.target.value)],
		});
	}

	saveUser() {
		const data: IUserModel = {
			name: this.state.name,
			role: this.state.role,
			reservations: this.state.reservations,
		};

		UserDataService.create(data)
			.then((response: any) => {
				this.setState({
					id: response.data.id,
					name: response.data.name,
					role: response.data.role,
					reservations: response.data.reservations,
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
			name: "",
			role: "default",
			reservations: [],
			submitted: false
		});
	}

	render() {
		const { submitted, name, role, reservations } = this.state;

		return (
		  <div className="submit-form">
			{submitted ? (
			  <div>
				<h4>A felhasználó sikeresen mentésre került.</h4>
				<button className="btn btn-success" onClick={this.newUser}>
					Új felhasználó felvétele
				</button>
			  </div>
			) : (
			  <div>
				<div className="form-group">
				  <label htmlFor="name">Név</label>
				  <input
					type="text"
					className="form-control"
					id="name"
					required
					value={name}
					onChange={this.onChangeName}
					name="name"
				  />
				</div>
				<div className="form-group">
				  <label htmlFor="role">Felhasználói jog</label>
				  <input
					type="text"
					className="form-control"
					id="role"
					required
					value={role}
					onChange={this.onChangeRole}
					name="role"
				  />
				</div>

	
				<button onClick={this.saveUser} className="btn btn-success">
				  Mentés
				</button>
			  </div>
			)}
		  </div>
		);
	}
}
