import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

import 'semantic-ui-css/semantic.min.css';
import * as serviceWorker from './serviceWorker';
import Routes from './routes';
import './css/index.css';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
})

const App = (
  <ApolloProvider client={client}>    
    <Routes />
  </ApolloProvider>
);


ReactDOM.render(App , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
