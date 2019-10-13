import React, { Component } from 'react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { Form, Input, Header, Container, Button } from 'semantic-ui-react';

class Login extends Component {
  state = {
    email: '',
    password: '',
  }

  onSubmit = async () => { // this should be work for github login later.
    const { email, password } = this.state;
    const res = await this.props.mutate({
      variables: { email, password }
    });
    
    console.log(res);
    const { ok, user: { _id } } = res.data.login;

    localStorage.setItem('userId', _id);

    if (ok) {
      this.props.history.push('/');
    }
    else {
      console.log('invalid login');
    }    
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    })
  }

  render() {
    const { password, email } = this.props;
    console.log(this.props);
    return (
      <Container text>
      <Header as="h2">Login page</Header>
      <Form>
        <Form.Field >
          <Input onChange={this.onChange} value={email} placeholder="Email" fluid name="email"/>
        </Form.Field>
        <Form.Field >
          <Input onChange={this.onChange} value={password} type="password" placeholder="Password" fluid name="password"/>
        </Form.Field>
        <Button onClick={this.onSubmit} >Submit</Button>
      </Form>     
      
    </Container>
    )
  }
}

const loginMutation = gql`
  mutation($email:String!, $password: String!){
  login(email: $email, password: $password) {
    ok
    user {
      _id
      email
      username
    }
  }
}
`;

export default graphql(loginMutation)(Login);