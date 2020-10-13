import React, { Component } from 'react';

import { Form, Input, Button, Space, Typography, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import authService from '../Services/authService';
import { Link } from 'react-router-dom';

const { Text } = Typography;

class PasswordReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            message_type: "default",
            loading: false
        }
    }

    onFinish = (values) => {
        this.setState({
            loading: true
        });

        authService.resetPassword(values.email).then(
            (res) => {
                this.setState({
                    loading: false,
                })
                if(res) {
                    message.success('Email has been sent! Please check your Email');
                    
                    this.props.history.push('/');
                } else {
                    message.success('Email sent failed');   
                }
            },
            (error) => {
                console.log(error);
            }
        );
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error("Please check input");
    };

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
                            <Form
                                name="password_reset"
                                className="login-form"
                                onFinish={this.onFinish}
                                onFinishFailed={this.onFinishFailed}
                                scrollToFirstError
                            >


                                <Form.Item
                                    name="email"
                                    hasFeedback
                                    rules={[
                                        { type: 'email', message: 'The input is not valid E-mail!', },
                                        { required: true, message: 'Please input your E-mail!', },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                                </Form.Item>

                                

                                <Form.Item>
                                    <Space size="large" direction="vertical" style={{ width: '100%' }}>
                                        <Button type="primary" block htmlType="submit" className="login-form-button">Send Reset Email</Button>

                                        <Text >
                                            Already have an account? <Link to="/login">Login</Link> | Don't have an account? <Link to="/register">SignUp Now</Link>
                                        </Text>
                                    </Space>
                                    
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                )}
            </div>
        );
    }
}
 
export default PasswordReset;