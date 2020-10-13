import React, { Component } from 'react';
import { Layout, Menu } from 'antd';

import {
  Switch,
  Route,
  Link,
} from "react-router-dom";

class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            currentUser: this.props.currentUser
         }
    }
    render() { 
        return ( 
            <>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>

                    {this.state.currentUser ? (
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
            </>
         );
    }
}
 
export default HeaderComponent;