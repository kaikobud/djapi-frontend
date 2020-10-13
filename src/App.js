import React, { Component } from 'react';
import './App.css';

import { Layout, Menu } from 'antd';

import {
  Switch,
  Route,
  Link,
} from "react-router-dom";

import AuthService from './Services/authService';

import { PrivateRoute } from './Routes/PrivateRoute';

import HomePage from './Screens/HomePage';
import LoginPage from './Screens/LoginPage';
import SignUpPage from './Screens/SignUpPage';
import FavouritePage from './Screens/FavouritePage';

import PasswordReset from './Screens/PasswordReset';
import PasswordResetConfirm from './Screens/PasswordResetConfirm';
import VerifyEmail from './Screens/VerifyEmail';
import VerifyEmailNotice from './Screens/VerifyEmailNotice';

const { Header, Content, Footer } = Layout;


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      isEmailVerified: false
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    let isEmailVerified = AuthService.getIsEmailVerified();

    console.log(user)
    console.log(isEmailVerified)


    if (user) {
      this.setState({
        currentUser: user,
        isEmailVerified: isEmailVerified
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined
    })
  }

  render() {
    const { currentUser } = this.state;

    return (
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>

            {currentUser ? (
                <>
                  <Menu.Item key="2">
                    <Link to={"/home"} className="nav-link">
                      Home
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="1">
                    <Link to={"/login"} className="nav-link" onClick={this.logOut}>
                      Logout
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="10">
                    {this.state.currentUser.user.email} (Verified: {this.state.isEmailVerified})
                  </Menu.Item>
                </>
                
              ) : (
                <>
                  <Menu.Item key="3">
                    <Link to={"/login"} className="nav-link">
                      Login
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <Link to={"/register"} className="nav-link">
                      Sign Up
                    </Link>
                  </Menu.Item>
                </>
              )}

          </Menu>
        </Header>
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <Switch>
              <PrivateRoute exact path={["/", "/home"]} component={HomePage} />
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/register" component={SignUpPage} />
              <PrivateRoute exact path="/fav" component={FavouritePage} />
              <Route exact path="/reset" component={PasswordReset} />
              <Route exact path="/reset_confirm" component={PasswordResetConfirm} />
              <Route exact path="/verify_email" component={VerifyEmail} />
              <Route exact path="/verify_emailNotice" component={VerifyEmailNotice} />
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2020 Created by Kaikobud Sarker</Footer>
      </Layout>
    );
  }
}

export default App;
