import { Component, ChangeEvent } from "react";
import ResourceProviderDataService from "../../services/ResourceProviderService";
import { Link } from "react-router-dom";
import IResourceProviderModel from '../../models/ResourceProviderModel';

type Props = {};

type State = {
	resourceProviders: Array<IResourceProviderModel>,
	currentProvider: IResourceProviderModel | null,
	currentIndex: number,
	searchName: string
};

export default class ResourceProviderList extends Component<Props, State>{
	constructor(props: Props) {
		super(props);
		this.onChangeSearchName = this.onChangeSearchName.bind(this);
		this.retrieveResourceProviders = this.retrieveResourceProviders.bind(this);
		this.refreshList = this.refreshList.bind(this);
		this.setCurrentProvider = this.setCurrentProvider.bind(this);
		this.removeAllTutorials = this.removeAllTutorials.bind(this);
		this.searchName = this.searchName.bind(this);

		this.state = {
			resourceProviders: [],
			currentProvider: null,
			currentIndex: -1,
			searchName: ""
		};
	}

	componentDidMount() {
		this.retrieveResourceProviders();
	}

	onChangeSearchName(e: ChangeEvent<HTMLInputElement>) {
		const searchName = e.target.value;
		this.setState({
			searchName: searchName
		});
	}

	retrieveResourceProviders() {
		ResourceProviderDataService.getAll()
			.then((response: any) => {
				this.setState({
					resourceProviders: response.data
				});
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
	}

	refreshList() {
		this.retrieveResourceProviders();
		this.setState({
			currentProvider: null,
			currentIndex: -1
		});
	}

	setCurrentProvider(resourceProvider: IResourceProviderModel, index: number) {
		this.setState({
			currentProvider: resourceProvider,
			currentIndex: index
		});
	}

	removeAllTutorials() {
		ResourceProviderDataService.delete(1000000)		// TODO
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
			currentProvider: null,
			currentIndex: -1
		});

		ResourceProviderDataService.findByName(this.state.searchName)
			.then((response: any) => {
				this.setState({
					resourceProviders: response.data
				});
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
	}

	render() {
		const { searchName, resourceProviders, currentProvider, currentIndex } = this.state;

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
					<h4>Szolgáltatók listája</h4>

					<ul className="list-group">
						{ users &&
							users.map((resourceProvider: IResourceProviderModel, index: number) => (
								<li
									className={ "list-group-item " + (index === currentIndex ? "active" : "") }
									onClick={ () => this.setCurrentProvider(resourceProvider, index) }
									key={ index }
								>
									{ resourceProvider.name }
								</li>
							))}
					</ul>

					<button
						className="m-3 btn btn-sm btn-danger"
						onClick={this.removeAllTutorials} >
						Összes szolgáltató törlése
					</button>
				</div>
				<div className="col-md-6">
					{currentProvider ? (
						<div>
							<h4>Szolgáltató adatai:</h4>
							<div>
								<label>
									<strong>Név:</strong>
								</label>{" "}
								{currentProvider.name}
							</div>
                            { /* TODO min és max fogl. idő*/}
							<div>
								<label>
									<strong>Foglalható erőforrások:</strong>
								</label>{" "}
								{currentProvider.resources.length > 0 ? "TODO adott szolgáltató erőforrásainak lekérése" : "Nincs erőforrás."}
							</div>

							<Link
								to={"/users/" + currentProvider.id}
								className="badge badge-warning">
								Módosít
							</Link>
						</div>
					) : (
						<div>
							<br />
							<p>Kattints az egyik szolgáltatóra a listából!</p>
						</div>
					)}
				</div>
			</div>
		);
	}
}