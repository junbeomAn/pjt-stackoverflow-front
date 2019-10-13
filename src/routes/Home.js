import React, { Component } from "react";
import SplitPane from "react-split-pane";
import { compose, graphql, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import { Input, Icon } from "semantic-ui-react";

import SideNav from "./../components/SideNav";
import TopNav from "../components/TopNav";
import LoginButton from "./../components/LoginButton";
import CreatePostButton from './../components/CreatePostButton';
import { AuthenticatedComponent } from '../auth';
import List from './../components/List';
import Showcase from './../components/Showcase'

const config = {
  alt: LoginButton,
  component: CreatePostButton,
}


class Home extends Component {

  state = {
    title: '',
    contents: '',
    createdAt: '',
    keyword: '',
  }

  onPostClick = async (client, _id) => {
    const {
      data: {
        getPost: { title, contents, createdAt }
      }
    } = await client.query({
      query: getPostQuery,
      variables: { _id }
    });
    this.setState({ title, contents, createdAt });
  };

  onKeywordSearch = (e) => {
    const { keyword } = this.state;
    if (e.key !== "Enter") {
      return ;
    }
    if (!keyword) {
      alert("검색어를 입력하세요");
      return;
    }
    this.props.history.push(`/post/${this.state.keyword}/page/1`);
  }

  onValueChange = (e) => {
    const keyword = e.target.value;
    this.setState({ keyword });
  }
 
  render() {
    const { props } = this;
    let {
      data: { getPostsWithPage: posts = [], loading },
      match: { params: { page }},
    } = this.props;
    posts = posts.slice().reverse();
    return (
      <ApolloConsumer>
        {client => (
          <div className="home">
            <SplitPane split="vertical" minSize="50%" defaultSize="50%">
              <SideNav>
                <Showcase />
                 {/*<List 
                  loading={loading}
                  posts={posts}
                  client={client}
                  // onPostClick={this.onPostClick}
                  page={page}
                 />*/}
              </SideNav>
              <main className="main__screen--home">
                <TopNav {...props} />
                {/*
                  <div className="main__screen--home--button">
                  {AuthenticatedComponent(Object.assign({ props }, config))}
                  </div>
                */}
                <div className="home-search-container">
                  <Input className="home-search" onKeyPress={this.onKeywordSearch} onChange={this.onValueChange} value={this.state.keyword} size="big" placeholder='검색어를 입력하세요' />
                </div>                
              </main>
            </SplitPane>
          </div>
        )}        
      </ApolloConsumer>
    )
  }
}

const allPostsQuery = gql`
  {
    allPosts {
      _id
      userId
      title
      contents
      createdAt
    }
  }
`;

const getPostQuery = gql`
  query($_id: String!) {
    getPost(_id: $_id) {
      title
      contents
      createdAt
    }
  }
`;
const getPostsWithPageQuery = gql`
  {
    getPostsWithPage(page: 1) {
  		_id
    	userId
      title
      contents
      createdAt
    }
  }
`;

export default compose(graphql(getPostsWithPageQuery))(Home);
