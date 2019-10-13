import React, { Component, Fragment } from "react";
import ReactMarkdown from 'react-markdown';
import { Mutation } from "react-apollo";
import { TextArea } from "semantic-ui-react";

import AnswerOption from './AnswerOption';
import SaveButton from './SaveButton';

import updateCommentMutation from "../mutations/UpdateComment";
import getCommentsByPostIdQuery from '../queries/GetCommentsByPostId';

class Answer extends Component {

  state = {
    editStatus: false,
    contents: '',
  };

  refetchComments = () => {
    const { postId } = this.props;
    // console.log('refetchqueries');
    return [
      {
        query: getCommentsByPostIdQuery,
        variables: { postId }
      }
    ];
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

  onUpdateComment = async (updateComment) => {
    const { contents } = this.state;
    const { postId, comment: { _id: commentId } } = this.props;
   
    if (!contents) {
      alert('수정할 내용을 입력하세요.');
      return;
    }

    await updateComment({ variables: { postId, commentId, contents }});
  }

  componentDidMount() {
    // console.log('setstate')
    const {comment: {contents}} = this.props;
    this.setState({ contents });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.comment.contents !== this.props.comment.contents) {
      this.onChangeEditStatusFalse();
    }
  }

  render() {
    const { myContract, match, postId, comment, terminated, userId} = this.props;
    const { editStatus, contents } = this.state;
    return (
      <Fragment>
      {editStatus ? 
        <Mutation mutation={updateCommentMutation} refetchQueries={this.refetchComments}>
          {updateComment => 
          <div className="answer-wrapper">
            <TextArea 
              placeholder="내용을 입력하세요"
              className="answer answer-add-write"
              onChange={this.onChange}
              // onKeyPress={(e) => this.onUpdateComment(updateComment, e)}
              value={contents}
              // onBlur={this.onChangeEditStatus}
              autoFocus
            />
            <SaveButton name={"answer-edit-save-btn"} onChangeStatus={this.onChangeEditStatusFalse} onSubmit={() => this.onUpdateComment(updateComment)} />
          </div>
        }          
        </Mutation> : 
        <div className="answer-wrapper">
          <div className="answer">
            <div className="answer-option">
              <AnswerOption
                myContract={myContract}
                match={match}
                postId={postId}
                comment={comment}
                terminated={terminated}
                onChangeEditStatusTrue={this.onChangeEditStatusTrue}
                isMine={userId === comment.userId}
              />
            </div>     
              <ReactMarkdown
              className="answer-contents"
              key={comment._id}
              source={comment.contents}
            />
          </div>  
        </div>   
      }
      </Fragment>
    );
  }
}

export default Answer;
