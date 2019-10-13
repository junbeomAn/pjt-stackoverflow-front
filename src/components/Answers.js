import React, { Component, Fragment } from "react";
import { TextArea } from "semantic-ui-react";
import gql from "graphql-tag";
import { graphql, compose, Query } from "react-apollo";
// import ReactMarkdown from "react-markdown";
import axios from "axios";
// import SplitPane from 'react-split-pane';

import getCommentsByPostIdQuery from "../queries/GetCommentsByPostId";
// import AnswerOption from './AnswerOption';
import Answer from "./Answer";
import SaveButton from './SaveButton';
import { getUserId, isAuthenticated } from "../auth";


class Answers extends Component {
  state = {
    writeStatus: false,
    contents: "",
    userId: "",
  };

  getCurrentPost = () => {
    const {
      match: {
        params: { id }
      },
      posts
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

  onAddClick = (e) => {
    if (!isAuthenticated()) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    this.setState({ writeStatus: true });
  };

  onChange = e => {
    const contents = e.target.value;
    this.setState({ contents });
  };
  onChangeWriteStatusFalse = () => {
    this.setState({ writeStatus: false });
  }

  onSubmit = async () => {
    const { account: metaAccount } = this.props;
    const { contents } = this.state;
    const postId = this.getCurrentPost()[0]._id;
    try {
      const { data: userId } = await axios.get(
        "http://localhost:4000/getUserId",
        { withCredentials: true }
      );
      await this.props.mutate({
        variables: { userId, postId, contents, metaAccount },
        refetchQueries: [{ query: getCommentsByPostIdQuery, variables: { postId }}]
      });
      
      this.setState({ contents: '' });
      this.onChangeWriteStatusFalse();
      // const { ok } = res.data.createComment;
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    getUserId().then(userId => this.setState({ userId }));
  }

  render() {
    const { writeStatus, contents, userId } = this.state;
    const { posts, loading, myContract, match, data } = this.props;
    const { _id,  } = this.getCurrentPost()[0] || [];
    // console.log(loading, posts)
    return (
      <Fragment>
        {loading ? null : (
          <Query query={getCommentsByPostIdQuery} variables={{ postId: _id }}>
            {({ loading, error, data: { getCommentsByPostId: comments }}) => {
              console.log(comments);
              return (
                loading ? 
                null :
                <div className="answer-list">
                  {!writeStatus ? (
                    <div className="answer-wrapper">
                      <div
                        className="answer answer-add"
                        onClick={this.onAddClick}
                      >
                        +
                      </div>
                    </div>
                  ) : (
                    <div className="answer-wrapper">
                      <TextArea
                        placeholder="내용을 입력하세요."
                        className="answer answer-add-write"
                        onChange={this.onChange}                        
                        value={contents}                        
                        autoFocus
                      />
                      <SaveButton name={"answer-save-btn"} onChangeStatus={this.onChangeWriteStatusFalse} onSubmit={this.onSubmit} />
                    </div>
                  )}
                  {posts.length &&
                    (comments.length
                      ? comments.map((v,i) => (         
                        <Answer 
                          key={v._id} 
                          myContract={myContract} 
                          match={match} 
                          postId={_id} 
                          comment={v} 
                          terminated={data.getPostState.terminated}
                          userId={userId}
                        /> 
                        ))
                      : null)}
                </div>
              );
            }}
          </Query>
        )}
      </Fragment>
    );
  }
}

const createCommentMutation = gql`
  mutation($userId: String!, $postId: String!, $contents: String!, $metaAccount: String!) {
    createComment(userId: $userId, postId: $postId, contents: $contents, metaAccount: $metaAccount) {
      ok
    }
  }
`;

export default compose(graphql(createCommentMutation))(Answers);
