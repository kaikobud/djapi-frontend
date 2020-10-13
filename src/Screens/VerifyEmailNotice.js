import React, { Component } from 'react';

import { Form, Input, Button, Space, Typography, Spin, message, Result } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import authService from '../Services/authService';
import { Link } from 'react-router-dom';
import queryString, { parse } from 'query-string';

const { Text } = Typography;

class VerifyEmailNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    componentDidMount() {

    }

    render() { 
        return (
            <div className="login_form">
                <Row justify="center">
                    <Col xs={8}>
                        <Result
                            status="warning"
                            title="Your email is not verified!"
                            subTitle="Please check your email to verify your email."
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
 
export default VerifyEmailNotice;