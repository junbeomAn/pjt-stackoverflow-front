import React, { Component, Fragment } from 'react'
import { Link } from "react-router-dom";
import { Loader } from 'semantic-ui-react';
import moment from "moment";
import "moment/locale/ko";

class List extends Component {  

  onMakeClickLink = (page, id) => {
    const { keyword } =this.props;
    if (!keyword) {
      return `/post/page/${page || 1}/${id}`;
    } else {
      return `/post/${keyword}/page/${page || 1}/${id}`
    }
  }

  render() {
    const { loading, posts, client, onPostClick, page, postId } = this.props;
    
    return (
      <Fragment>
        {loading ? (
          <Loader size="large" active inverted>Loading . . .</Loader>
        ) : posts.length ? (
          posts.map(p => (
            <Link
              to={this.onMakeClickLink(page, p._id)}
              key={p._id}
              // onClick={() => onPostClick(client, p._id)}
            >
              <div className={postId === p._id ? "side__nav--item active" : "side__nav--item"}>
                <div className="item-title">{p.title}</div>
                <div className="item-info">
                  <div>
                    { `${p.reward} 이더`}
                  </div>
                  <div>|</div>
                  <div>
                    {moment(new Date(+p.createdAt)).fromNow()}  
                  </div>                  
                </div>
              </div>
            </Link>
          ))
        ) : <h1>Oops! No results!</h1>}
      </Fragment>
    )
  }
}

export default List;