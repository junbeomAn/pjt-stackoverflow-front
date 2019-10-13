import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import SplitPane from "react-split-pane";
import { Redirect, Link  } from "react-router-dom";
import { Modal, Icon, Input } from 'semantic-ui-react';
import Web3 from 'web3';

import SideNav from "./../components/SideNav";
import TopNav from "../components/TopNav";
import List from "./../components/List";
import Post from "./../components/Post";
import Pagination from "./../components/Pagination";
import Answers from "./../components/Answers";
import ABI from "../ABI";

import getPostWithKeywordQuery from '../queries/GetPostWithKeyword';
import getPostsWithPageQuery from '../queries/GetPostsWithPage';
import getPostStateQuery from '../queries/GetPostState';
import { getUserId } from '../auth';

class PostList extends Component {
  state = {
    title: "",
    contents: "",
    createdAt: "",
    account: '',
    myContract: {},
    searchKeyword: '',
    userId: '',
  };

  onTransactionDefaultSetting = async () => {
    if (typeof window.web3 !== 'undefined') { 
      window.web3 = new Web3(window.web3.currentProvider);         
    }

    try {
      const account = await window.web3.eth.getAccounts(); 
      const myContract = await window.web3.eth.Contract(ABI,"0x8768befc1c821b62c756e9e1a78c905ddc11395a" ,{
        defaultAccount: account[0],
        defaultGasPrice: '20000000000',
      });  
     
      this.setState({ myContract, account: account[0], });
    } 
    catch (err) {
      console.error(err);
    }
  }

  getCurrentPost = posts => {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    if (!id) {
      return posts.slice(posts.length - 1);
    }
    // console.log(id)
    const currentPost = posts.filter(v => {
      return v._id === id;
    });
    return currentPost;
  };

  // onPageClick = async client => {
  //   try {
  //     const page = parseInt(this.props.match.params.page || 1);

  //     const data = await client.query({
  //       query: getPostsWithPageQuery,
  //       variables: { page }
  //     });
  //     console.log(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  onValueChange = (e) => {
    const searchKeyword = e.target.value;
    this.setState({ searchKeyword });
  }

  onKeywordSearch = (e) => {
    const { searchKeyword } = this.state;
    if (e.key !== "Enter") {
      return ;
    }
    if (!searchKeyword) {
      alert("검색어를 입력하세요");
      return;
    }
    this.props.history.push(`/post/${searchKeyword}/page/1`);
  }

  onMakePostQuery = () => {
    const { match: { params: { keyword }}} = this.props;

    if (!keyword) {
      return getPostsWithPageQuery;
    } else {
      return getPostWithKeywordQuery;
    }
  }

  onMakePostQueryVariables = () => {
    const { match: { params: { keyword, page }}} = this.props;

    if (!keyword) {
      return {
        page: this.handleParsePageNum(page)
      }
    } else {
      return {
        page: this.handleParsePageNum(page),
        keyword
      }
    }

  }

  handleParsePageNum = page => {
    page = parseInt(page);
    if (page === undefined) {
      return 1;
    }

    if (page < 1) {
      return 1;
    } else {
      return page;
    }
  };

  componentDidMount() {
    this.onTransactionDefaultSetting();
    getUserId().then(userId => this.setState({ userId }));
  }

  render() {
    const { myContract,account, searchKeyword, userId } = this.state;
    let { match: { params: { page, id, keyword } }, match, history} = this.props;
    let posts;
    page = parseInt(page);
    return page > 0 ? (
      <Query
        query={this.onMakePostQuery()}
        variables={this.onMakePostQueryVariables()}
      >
        { ({ loading: loadingOne, error, data: { getPostsWithPage = [], getPostWithKeyword = [] } }) => {
          posts = getPostsWithPage.length ? getPostsWithPage : getPostWithKeyword;
          console.log(posts)
          if (!id && posts && !loadingOne) {
            if (!keyword) {
              return ( <Redirect  to={`/post/page/${page}/${posts[0]._id}`}/>)
            } else {
              return ( <Redirect  to={`/post/${keyword}/page/${page}/${posts[0]._id}`}/>)
            }
            
          }
          posts = posts.slice().reverse();
          const currPost = this.getCurrentPost(posts)[0]; 
          // console.log(currPost);
          return (
            <Query 
              query={getPostStateQuery}
              variables={{ postId: id || '' }}
            >
            {({ loading: loadingTwo, error, data }) => {
              
              return (                
                // <ApolloConsumer>
                //   {client => {
                //     return (
                    <div>
                      <div className="postlist">
                        <SplitPane split="vertical" minSize="50%" defaultSize="50%">
                          <SideNav>
                            <List
                              loading={loadingOne}
                              posts={posts}
                              keyword={keyword}
                              page={page}
                              postId={match.params.id}
                            />
                            <Pagination
                              page={page}
                              prevPage={page > 1}
                              nextPage={posts.length >= 10}
                            />
                          </SideNav>
                          <main className="main__screen--postlist">
                            <TopNav {...this.props} />
                            {
                              currPost &&
                              <Post
                              loading={loadingOne || loadingTwo}
                              posts={posts}
                              currPost={currPost}
                              match={match}
                              data={data} //terminated
                              myContract={myContract}
                              history={history}
                              userId={userId}
                            />
                            }
                            <Modal trigger={<div className="postlist--open-search-bar"><Icon size="small" name="search" /></div>} basic size='small'>
                              <Modal.Content>
                                <Input value={searchKeyword} onChange={this.onValueChange} onKeyPress={this.onKeywordSearch} placeholder="검색어를 입력하세요." size="huge" fluid autofocus />
                              </Modal.Content>
                            </Modal>
                            <Link to="/post/create"><div className="postlist--to-create-post">+</div></Link>
                          </main>
                        </SplitPane>
                      }
                      </div>
                      <div className="post-answer">
                        <Answers 
                          loading={loadingOne || loadingTwo} 
                          data={data} 
                          currPost={currPost} 
                          posts={posts} 
                          match={match} 
                          myContract={myContract} 
                          account={account} 
                          userId={userId} 
                        />
                      </div>
                    </div>
                //   )}}
                // </ApolloConsumer>
               )
              }}
            </Query>
          );
        }}
      </Query>
    ) : (
      <Redirect to="/post/page/1" />
    );
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

export default PostList;
