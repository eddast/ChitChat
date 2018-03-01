import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/site';
import propTypes from 'prop-types'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Redirect } from 'react-router';
import InitialPage from './components/containers/InitialPageNickname/InitialPage/InitialPage';
import Lobby from './components/containers/LobbyPage/Lobby/Lobby'
import Service from './services/API';

class App extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);
        Service.connect();
    }

    // Values to pass to each child component
    getChildContext() {
        return {
            routeTools: {
                redirect: Redirect
            },
            serverAPI : {
                server: Service
            },
            currentUser : {
                userName: 'nobody'
            }
        }
    }

    // Renders route paths, i.e. InitialPage as '/'
    render() {
        return RouterPaths;
    }
}

// Available paths in app
var RouterPaths = (
    <Switch>
        <Route exact path='/' component={InitialPage} />
        <Route exact path='/lobby' component={Lobby} />
        <div> 404 not found </div>
    </Switch>
);

// Format of values to pass to child component
App.childContextTypes = {

    routeTools: propTypes.shape({
        redirect: propTypes.component,
    }),

    serverAPI: propTypes.shape({
        server: propTypes.component
    }),

    currentUser: propTypes.shape({
        userName: propTypes.string
    }),
};

ReactDOM.render(<Router><App /></Router>, document.getElementById('app'));
