import React, { Component } from 'react';
import './App.css';

import { Layout, Menu } from 'antd';

import {
  Switch,
  Route,
} from "react-router-dom";

import AuthService from './Services/authService';

import { PrivateRoute } from './Routes/PrivateRoute';

import HomePage from './Screens/HomePage';
import LoginPage from './Screens/LoginPage';
import SignUpPage from './Screens/SignUpPage';

import PasswordReset from './Screens/PasswordReset';
import PasswordResetConfirm from './Screens/PasswordResetConfirm';
import VerifyEmail from './Screens/VerifyEmail';
import VerifyEmailNotice from './Screens/VerifyEmailNotice';

const { Footer } = Layout;


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }
  

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if(user) {
      this.setState({
        currentUser: user
      })
    }
  }

  

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined
    })
  }

  render() {
    return (
      <Layout>
        <Switch>
          <PrivateRoute exact path={["/", "/home"]} component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={SignUpPage} />
          <Route exact path="/reset" component={PasswordReset} />
          <Route exact path="/reset_confirm" component={PasswordResetConfirm} />
          <Route exact path="/verify_email" component={VerifyEmail} />
          <Route exact path="/verify_emailNotice" component={VerifyEmailNotice} />
        </Switch>

        
        <Footer style={{ textAlign: 'center' }}>©2020 Created by Kaikobud Sarker</Footer>
      </Layout>
    );
  }
}

export default App;
