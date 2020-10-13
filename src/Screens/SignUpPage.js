import React, { Component } from 'react';

import { Form, Input, Button, Space, Typography, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import authService from '../Services/authService';
import { Link } from 'react-router-dom';

const { Text } = Typography;

class SignUpPage extends Component {
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

        authService.register(values.username, values.email, values.password1, values.password2).then(
            (res) => {
                this.setState({
                    loading: false,
                })
                if(res.access_token) {
                    this.props.history.push("/");
                    message.success('SignUp Success, Please Login to Continue');
                } else {
                    let error_obj = res.data;
                    Object.keys(error_obj).forEach(function (item) {
                        message.error(error_obj[item])
                    });
                    
                }
                
            },
            (error) => {
                this.setState({
                    loading: false,
                })
                message.error('Registration Failed! Please check inputs.');
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
                                name="normal_signup"
                                className="login-form"
                                onFinish={this.onFinish}
                                onFinishFailed={this.onFinishFailed}
                                scrollToFirstError
                            >

                                <Form.Item
                                    name="username"
                                    rules={[
                                        { required: true, message: 'Please input your Username!' }
                                    ]}
                                >
                                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                                </Form.Item>

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

                                <Form.Item
                                    name="password1"
                                    rules={[
                                        { required: true, message: 'Please input your Password!' },
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                            if (!value || value.length >= 8) {
                                                return Promise.resolve();
                                            }
                                
                                            return Promise.reject('Password must be minumum 8 characters, including numbers and character combination.');
                                            },
                                        }),
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Password"
                                    />
                                </Form.Item>
                                
                                <Form.Item
                                    name="password2"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                        if (!value || getFieldValue('password1') === value) {
                                            return Promise.resolve();
                                        }
                            
                                        return Promise.reject('The two passwords that you entered do not match!');
                                        },
                                    }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Confirm Password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Link className="login-form-forgot" to="/reset">Forgot password?</Link>
                                </Form.Item>

                                <Form.Item>
                                    <Space size="large" direction="vertical" style={{ width: '100%' }}>
                                        <Button type="primary" block htmlType="submit" className="login-form-button">SignUp</Button>

                                        <Text >
                                            Already have an account? <Link to="/login">Login Now!</Link>
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
 
export default SignUpPage;