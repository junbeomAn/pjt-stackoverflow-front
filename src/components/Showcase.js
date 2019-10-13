import React, {Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { isAuthenticated } from '../auth';

class Showcase extends Component {

  render() {
    return (
      <div className="home__showcase">
        <h1>언제까지 . . . <br/>고민만 할 건가요?</h1>             
          <Link to="/post/create" className="home__showcase--question-btn">
            질문하기 &gt;
          </Link>
          {
            isAuthenticated() ? 
            <Link to="/post/page/1" className="home__showcase--login-btn">
              질문보러가기 &gt;
            </Link> : 
            <a href="http://127.0.0.1:4000/glogin" className="home__showcase--login-btn">
              <Icon name="github"/>깃허브 로그인      
            </a>
          }
      </div>
    )
  }
}
export default Showcase;