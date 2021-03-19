import { Container } from 'react-bootstrap';
import './App.scss';
import CardComponent from './components/CardComponent/CardComponent';
import ProfileDetails from './components/ProfileDetails/ProfileDetails';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Container fluid>
				<h1 className="display-4 text-center">User Profile</h1>
				<Switch>
					<Route path="/:id">
						<ProfileDetails />
					</Route>
					<Route path="/">
						<CardComponent />
					</Route>
				</Switch>
			</Container>
		</Router>
	);
}

export default App;
