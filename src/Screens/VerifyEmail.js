import React, { Component } from 'react';

import { Form, Input, Button, Space, Typography, Spin, message, Result } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import authService from '../Services/authService';
import { Link } from 'react-router-dom';
import queryString, { parse } from 'query-string';

const { Text } = Typography;

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isEmailVerified: false
        }
    }

    componentDidMount() {
        const { location: { search } } = this.props;
        const { key } = queryString.parse(search);

        authService.verifyEmailConfirm(key).then(
            (res) => {
                this.setState({
                    loading: false,
                })
                if(res.status === 200) {
                    message.success('Success')
                    localStorage.setItem("email_verify", true);
                    this.setState({
                        isEmailVerified: true
                    })
                } else {
                    message.success('Email Verification Failed');   
                }
            },
            (error) => {
                console.log(error);
            }
        );

      }

    render() { 
        return (
            <div className="login_form">
                {this.state.loading ? (
                    <div className="loading_screen">
                        <Spin />
                    </div>
                ): (
                    <Row justify="center">
                        <Col xs={8}>
                            <Result
                                status="success"
                                title="Successfully Verified Email!"
                                subTitle="Your email is verified"
                            />
                        </Col>
                    </Row>
                )}
            </div>
        );
    }
}
 
export default VerifyEmail;