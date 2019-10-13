import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from './LogoutButton';
import { isAuthenticated } from './../auth';

const TopNav = ({history, match}) => {
  return (
    <div className="header">
      <ul className="header__nav">
        <Link to="/">
          <li>Home</li>
        </Link>
        <Link to="/post/page/1">
          <li>Post</li>
        </Link>
        <Link to="/">
          <li>About</li>
        </Link>
        <Link to="/">
          <li>Rank</li>
        </Link>        
        {
          isAuthenticated() ? 
          <LogoutButton history={history} /> : 
          (
            // match.url === '/' ? 
            // <li className="filled-transparent-space">Login</li> :
            <a href="http://127.0.0.1:4000/glogin" ><li>Login</li></a>
          )
        }        
      </ul>
    </div>
  );
};

export default TopNav;
