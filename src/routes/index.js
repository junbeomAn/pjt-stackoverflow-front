import React from 'react';
import { BrowserRouter, Route, Switch, } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import PostList from './PostList';
import CreatePost from './CreatePost';
import NoMatch from './NoMatch';
import Footer from '../components/Footer';

export default () => (
  <BrowserRouter>
    <Switch>      
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/rank" component={Login} />
      <Route path="/chat" component={Home} />
      <Route path="/post/create" component={CreatePost} />
      <Route exact path="/post/:keyword/page/:page/:id" component={PostList} />
      <Route exact path="/post/:keyword/page/:page" component={PostList} />
      <Route exact path="/post/page/:page/:id" component={PostList} />
      <Route exact path="/post/page/:page" component={PostList} />      
      <Route component={NoMatch} />
    </Switch>
    <Footer />
  </BrowserRouter>
)