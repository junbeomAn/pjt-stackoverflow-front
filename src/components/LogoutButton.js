import React, { Component } from "react";
import axios from "axios";

class LogoutButton extends Component {
  onClick = () => {
    axios
      .get("http://localhost:4000/logout", { withCredentials: true })
      .then(({ data: { redirectURL} }) => { 
        console.log(redirectURL);
        this.props.history.push(redirectURL);
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <React.Fragment>
        <li className="header__nav--logout" onClick={this.onClick}>logout</li>
      </React.Fragment>
    );
  }
}

export default LogoutButton;
