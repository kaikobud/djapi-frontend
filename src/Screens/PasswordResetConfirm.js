import React, { Component } from 'react';

import { Form, Input, Button, Space, Typography, Spin, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import authService from '../Services/authService';
import { Link } from 'react-router-dom';
import queryString, { parse } from 'query-string';

const { Text } = Typography;

class PasswordReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            message_type: "default",
            loading: false,
            uid: '',
            token: '',
        }
    }

    onFinish = (values) => {
        this.setState({
            loading: true
        });

        authService.resetPasswordConfirm(values.new_password1, values.new_password2, this.state.uid, this.state.token).then(
            (res) => {
                this.setState({
                    loading: false,
                })
                if(res.hasOwnProperty('detail')) {
                    this.props.history.push('/');
                    message.success("Password reset successful, Please login")
                } else if(res.status === 400) {
                    this.props.history.push('/');

                    if(res.data.hasOwnProperty('token')) {
                        message.error("Invalid Token")
                    } else if(res.data.hasOwnProperty('new_password2')) {
                        message.error(res.data.new_password2[0])
                    } else {
                        message.error("Password reset failed, please try again")
                    }
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

    componentDidMount() {
        const { location: { search } } = this.props;
        const { uid, token } = queryString.parse(search);

        this.setState({
            uid: uid,
            token: token
        })
    }
    

    render() { 
        return (
            <div className="login_form" style={{ padding: 24, minHeight: 480, paddingTop: 100 }}>
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
                                    name="new_password1"
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
                                    name="new_password2"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                        if (!value || getFieldValue('new_password1') === value) {
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
                                    <Space size="large" direction="vertical" style={{ width: '100%' }}>
                                        <Button type="primary" block htmlType="submit" className="login-form-button">Confirm Password Reset</Button>

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