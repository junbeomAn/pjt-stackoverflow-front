import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
// import { ApolloConsumer } from "react-apollo";
// import gql from "graphql-tag";

class LoginButton extends React.Component {

  render() {
    return (
      <div>
        <a href="http://127.0.0.1:4000/glogin">
          <Button primary>Login or Create</Button>
        </a>
      </div>
    );
  }
}


export default LoginButton;
