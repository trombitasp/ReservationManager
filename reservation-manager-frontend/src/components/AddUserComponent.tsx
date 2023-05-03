import { Component, ChangeEvent } from "react";
import UserDataService from "../services/UserService";
import IUserModel from '../models/UserModel';
import IReservationModel from "../models/ReservationModel";

type Props = {};

type State = IUserModel & {
  submitted: boolean
};

export default class AddUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.newUser = this.newUser.bind(this);

    this.state = {
      id: null,
      name: "",
      role: "default",
      reservations: new Array<IReservationModel>(),
      submitted: false
    };
  }

  onChangeName(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeRole(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      role: e.target.value
    });
  }

  saveUser() {
    const data: IUserModel = {
      name: this.state.name,
      role: this.state.role,
      reservations: new Array<IReservationModel>()
    };

    TutorialDataService.create(data)
      .then((response: any) => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          published: response.data.published,
          submitted: true
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  newUser() {
    this.setState({
      id: null,
      title: "",
      description: "",
      published: false,
      submitted: false
    });
  }

  render() {
    // ...
  }
}