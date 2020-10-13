import React, { Component } from 'react';

import { Button, Typography, Result } from 'antd';
import { Row, Col } from 'antd';
import authService from '../Services/authService';

const { Text } = Typography;

class VerifyEmailNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
        this.logout = this.logout.bind(this)
    }

    logout() {
        authService.logout()
        this.props.history.push('/login')
    }

    componentDidMount() { }

    render() { 
        return (
            <div className="login_form" style={{ padding: 24, minHeight: 480, paddingTop: 100 }}>
                <Row justify="center">
                    <Col xs={8}>
                        <Result
                            status="warning"
                            title="Your email is not verified!"
                            subTitle="Please check your email to verify your email."
                            extra={[
                                <Button type="primary" onClick={this.logout}>
                                    Logout
                                </Button>
                            ]}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
 
export default VerifyEmailNotice;