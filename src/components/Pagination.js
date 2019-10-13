import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class Pagination extends Component {  

  render() {
    const { page, prevPage, nextPage } = this.props;
    return (
      <div className="pagination__wrapper">
        <ul className="pagination">
          {
            prevPage && 
            <Link to={`/post/page/${page-1}`}>
              <li ><span className="pagination--arrow">&lt;</span>prev</li>
            </Link>
          }
          {
            nextPage &&
            <Link to={`/post/page/${page+1}`}>
              <li >next<span className="pagination--arrow">&gt;</span></li>
            </Link>
          }
        </ul>
      </div>
    )
  }
}

export default Pagination;