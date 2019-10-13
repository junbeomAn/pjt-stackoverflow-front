import React, { Component, Fragment } from "react";
import { Mutation } from "react-apollo";
import { Icon } from "semantic-ui-react";
import { ApolloConsumer } from "react-apollo";
import moment from "moment";
import "moment/locale/ko";

import deletePostMutation from "../mutations/DeletePost";
import terminatePostMutation from "../mutations/TerminatePost";

import getPostsWithPageQuery from "../queries/GetPostsWithPage";
import getPostStateQuery from "../queries/GetPostState";
import getPostQuery from '../queries/GetPost';

class PostOption extends Component {

  refetchPostState = () => {
    const {
      match: {
        params: { id: postId }
      }
    } = this.props;
    // console.log('refetchqueries');
    return [
      {
        query: getPostStateQuery,
        variables: { postId }
      }
    ];
  };

  refetchPosts = () => {
    const {
      match: {
        params: { page }
      }
    } = this.props;
    return [
      {
        query: getPostsWithPageQuery,
        variables: { page: parseInt(page) }
      }
    ];
  };

  onDeletePost = async (deletePost) => {
    const { postId, match: {params: {page}} } = this.props;
    await deletePost({variables: {postId}});
    this.props.history.push(`/post/page/${page}`);
  }
  
  terminatePostAndDealBreak = async (postId, terminatePost, client) => {
    const terminatable = await this.isTerminatable(client, postId);
    if (!terminatable) {
      alert("현재 마감할 수 없는 질문입니다.");
      return;
    }

    try {
      const res = terminatePost({ variables: { postId } });
      this.onDealBreak(postId);
      await res;
    } catch (err) {
      console.error(err);
    }
  };

  isTerminatable = async (client, _id) => {
    const {
      data: {
        getPost: { comments }
      }
    } = await client.query({
      query: getPostQuery,
      variables: { _id },
      fetchPolicy: 'network-only',
    });
    console.log(comments);
    const terminatable = comments.reduce((acc, v) => (v.likes < 5) && acc, true);
    console.log(terminatable);
    return terminatable;
  };

  onDealBreak = async postId => {
    const { myContract } = this.props;
    const options = {
      gas: 100000
    };

    myContract.methods.dealBreak(postId).send(options);
  };

  // componentWillMount() {
  //   this.props.setContentsState();
  // }
  
  render() {
    const {
      postId,      
      terminated,
      onChangeEditStatus,
      createdAt,
      tags,
      isMine,
    } = this.props;
    return (
      <Fragment>
      <div>
        {terminated ? (
          <div className="post-options-item post-terminated">
            Terminated
            <br /> Question
          </div>
        ) : (
          isMine &&
          <Mutation mutation={terminatePostMutation} refetchQueries={this.refetchPostState}>
            {terminatePost => (
              <ApolloConsumer >
                {client =>              
                  <div
                    className="post-options-item post-terminate"
                    onClick={() => this.terminatePostAndDealBreak(postId, terminatePost, client)}
                  >
                    Terminate
                  </div>
                }
              </ApolloConsumer>
            )}
          </Mutation>
        )}
        <div className="post-options-item post-created">
          {moment(new Date(+createdAt)).fromNow()}
        </div>
        {isMine &&
          <div className="post-edit post-options-item">
            <Icon name="edit" onClick={onChangeEditStatus} className="icon"/>
          </div>
        }
        {isMine && 
          <div className="post-delete post-options-item">
            <Mutation mutation={deletePostMutation} refetchQueries={this.refetchPosts}>
              {deletePost => 
                <Icon name="trash" onClick={() => this.onDeletePost(deletePost)} />
              }            
            </Mutation>
          </div>
        }
        </div>
        <div className="post-options-item post-tags">
            {tags.map((v,i) => <div key={v+i}>{v}</div> )}
        </div>
      </Fragment>
    );
  }
}

export default PostOption;
