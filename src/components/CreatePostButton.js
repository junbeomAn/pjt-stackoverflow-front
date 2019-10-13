import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

class CreatePostButton extends React.Component {

  render() {
    return (
      <div>
        <Link to="/post/create">
          <Button primary>Create Post</Button>
        </Link>
      </div>
    );
  }
}


export default CreatePostButton;
