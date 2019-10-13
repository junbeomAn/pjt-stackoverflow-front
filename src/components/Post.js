import React, { Component, Fragment } from "react";
import { Loader, TextArea, Icon } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import { Mutation, graphql } from "react-apollo";

import PostOption from './PostOption';
import SaveButton from './SaveButton';

import updatePostMutation from "../mutations/UpdatePost";

import getPostsWithPageQuery from "../queries/GetPostsWithPage";

class Post extends Component {
  state = {
    editStatus: false,
    contents: ""
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

 

  onUpdatePost = async (updatePost) => {
    const { contents } = this.state;
    const { currPost: { _id: postId }, tags } = this.props;
    
    if (!contents) {
      alert("수정할 내용을 입력하세요.");
      return;
    }

    await updatePost({ variables: { postId, contents, tags } });
    // this.onChangeEditStatusFalse();
  };

  onChangeEditStatusTrue = () => {
    this.setState({ editStatus: true });
  };
  onChangeEditStatusFalse = () => {
    this.setState({ editStatus: false });
  };

  onChange = e => {
    const contents = e.target.value;
    this.setState({ contents });
  };

  setContentsState = () => {
    const { currPost } = this.props;
    this.setState({ contents: currPost.contents });
  }

  componentDidUpdate(prevProps, prevState) {
    const idChange = prevProps.currPost._id !== this.props.currPost._id;
    const postChange = prevProps.currPost !== this.props.currPost;

    if (idChange || postChange) {
      this.onChangeEditStatusFalse();
      this.setContentsState();    
    } 
  }
  componentDidMount() {
    this.setContentsState();
  }

  render() {
    const { posts, currPost, loading, data, match, history, myContract, userId } = this.props;
    const { editStatus, contents } = this.state;
    // const currPost = this.getCurrentPost(posts)[0]; // currpost는 유지해야함 loading중 일 경우 undefined 뜸
    // console.log(currPost);

    return (
      <Fragment>
        {loading ? (
          <Loader size="large" active inverted>
            Loading . . .
          </Loader>
        ) : posts.length ? (
          editStatus ? (
            <Mutation
              mutation={updatePostMutation}
              refetchQueries={this.refetchPosts}
            >
              {updatePost => (
                <div className="main__screen--postlist--post">
                  <TextArea
                    placeholder="내용을 입력하세요."
                    className="main__screen--post--contents"
                    onChange={this.onChange}
                    // onKeyPress={e => this.onUpdatePost(updatePost)}
                    value={contents}
                    // onBlur={this.onChangeEditStatus}
                    autoFocus
                  />
                  <SaveButton name={"post-edit-save-btn"} onChangeStatus={this.onChangeEditStatusFalse} onSubmit={() => this.onUpdatePost(updatePost)} />
                </div>
              )}
            </Mutation>
          ) : (
            <div className="main__screen--postlist--post">
              <div className="main__screen--post--contents">
                <div className="upper">{currPost.title}</div>
                <div className="lower">
                  <div className="post-options">                  
                    <PostOption 
                      terminated={data.getPostState.terminated} 
                      createdAt={currPost.createdAt} 
                      postId={currPost._id} 
                      onChangeEditStatus={this.onChangeEditStatusTrue}
                      match={match}
                      history={history}
                      tags={currPost.tags}
                      setContentsState={this.setContentsState}
                      myContract={myContract}
                      isMine={userId === currPost.userId}                      
                    />
                  </div>
                  <ReactMarkdown
                    className="post-contents"
                    source={currPost.contents}
                  />
                </div>
              </div>
            </div>
          )
        ) : (
          <h1>Oops! No results!</h1>
        )}
      </Fragment>
    );
  }
}

export default Post;
