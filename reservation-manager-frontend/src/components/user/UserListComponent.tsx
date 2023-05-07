import { Component, ChangeEvent } from "react";
import UserDataService from "../../services/UserService";
import IUserModel from "../../models/UserModel";
import IReservationModel from "../../models/ReservationModel";

type Props = {};

type State = IUserModel & {
	submitted: boolean;
};

export default class UserList extends Component<Props, State> {
	
}
