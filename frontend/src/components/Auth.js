import React, { Component } from 'react';
import axios from 'axios';

class Auth extends Component {
  state = {
    isLogin: true,
  };

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
            query {
              login(email: "${email}", password: "${password}") {
                userId
                token
                tokenExpiration
              }
            }
          `,
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
              mutation {
                createUser(email: "${email}", password: "${password}") {
                  _id
                  email
                }
              }
            `,
      };
    }

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="container-fluid-lg d-flex justify-content-center pt-5">
        <div className="jumbotron">
          <form onSubmit={this.submitHandler}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                ref={this.emailEl}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                ref={this.passwordEl}
              />
            </div>
            <div className="checkbox">
              <input type="checkbox" />
              Remember me
            </div>

            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <hr />
            <button type="button" onClick={this.switchModeHandler}>
              Switch to {this.state.isLogin ? 'Signup' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default Auth;