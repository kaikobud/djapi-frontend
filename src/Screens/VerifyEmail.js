import React, { Component } from 'react';

import { Typography, Spin, message, Result } from 'antd';
import { Row, Col, Button } from 'antd';
import authService from '../Services/authService';
import queryString from 'query-string';

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isEmailVerified: false
        }
        this.home = this.home.bind(this)
    }

    home() {
        this.props.history.push('/home')
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
            <div className="login_form" style={{ padding: 24, minHeight: 480, paddingTop: 100 }}>
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
                                extra={[
                                    <Button type="primary" onClick={this.home}>
                                        Back to Home
                                    </Button>
                                ]}
                            />
                        </Col>
                    </Row>
                )}
            </div>
        );
    }
}
 
export default VerifyEmail;