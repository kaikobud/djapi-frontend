import React, { Component } from 'react';

import { Form, Input, Button, Space, Typography, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import authService from '../Services/authService';

import { Link } from "react-router-dom";

const { Text } = Typography;

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            message_type: "default",
            loading: false,
        }
    }

    onFinish = (values) => {
        this.setState({
            loading: true
        });

        authService.login(values.username, values.password).then(
            (res) => {
                this.setState({
                    loading: false,
                })
                if(res.access_token) {
                    this.props.history.push("/");
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
                message.error('Login Failed! Please check inputs.');
            }
        );
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
                            <Text type={this.state.message_type}>{this.state.message}</Text>
                            <br/>
                            <br/>

                            <Form
                            name="normal_login"
                            className="login-form"
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                            scrollToFirstError
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your Username!' }]}
                                >
                                    <Input value={this.state.username} onChange={this.onChangeUsername} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                                </Form.Item>


                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Please input your Password!' }
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Link className="login-form-forgot" to="/reset">Forgot password?</Link>
                                </Form.Item>

                                <Form.Item>
                                    <Space size="large" direction="vertical" style={{ width: '100%' }}>
                                        <Button type="primary" block htmlType="submit" className="login-form-button">Login</Button>

                                        <Text >
                                            Already have an account? <Link to="/register">SignUp Now!</Link>
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
 
export default LoginPage;