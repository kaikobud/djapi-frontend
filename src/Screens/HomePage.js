import React, { Component } from "react";
import { Table, Space, Input, Button, Switch } from 'antd';
import { HeartTwoTone, HeartFilled } from '@ant-design/icons';
import axios from 'axios';

import authHeader from '../Services/authHeader';
import authService from '../Services/authService';

import { Layout, Menu } from 'antd';

import { Link } from "react-router-dom";

const { Header, Content } = Layout;

const { Search } = Input;


const API_URL = 'http://localhost:8000/api/';

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
        companies: [],
        query: '',
        loading: false,
        fav_companies: [],
        fav_id: 0,
        favCheck: false, 
        isDisable: false,
        currrentUser: undefined,
        currentUserEmail: undefined,
        is_verified: false
    };

    this.search = this.search.bind(this);
    this.update_favourite_list = this.update_favourite_list.bind(this);
    this.getFavouriteOnly = this.getFavouriteOnly.bind(this);
  }

  columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Employee Size',
        key: 'employee_size',
        dataIndex: 'employee_size',
      },
      {
        title: 'Phone',
        key: 'phone',
        dataIndex: 'phone',
      },
      {
        title: 'Website',
        key: 'website',
        dataIndex: 'website',
      },
      {
        title: 'Favourite',
        key: 'favourite',
        dataIndex: 'favourite',
        render: (favoutite, key) => (
          <Space size="middle">
            {favoutite ? (
            <Button shape="circle" icon={<HeartFilled className="fav_icon" onClick={() => this.update_favourite_list(key['key'])} />} />
            ): (
            <Button shape="circle" icon={<HeartTwoTone twoToneColor="#eb2f96" onClick={() => this.update_favourite_list(key['key'])} />} />
            )}
          </Space>
        ),
      },
  ];

  search(e) {
    let userObj = authService.getCurrentUser()
    let query = e.target.value;
    if (query.length > 0) {
      this.setState({
        isDisable: true
      })
    } else {
      this.setState({
        isDisable: false
      })
    }
    this.setState({
        query: query,
        loading: true
    })
    axios.get(API_URL + 'search_page/?q=' + query + '&user_id=' + userObj.user.pk , { headers: authHeader() }).then(res => {
        let data = res.data;
        this.setState({
            companies: data,
            loading: false
        })
    })
  }

  update_favourite_list(key, favourite) {
    this.setState({
      loading: true
    })

    let fav_companies = this.state.fav_companies

    let userObj = authService.getCurrentUser()
    let updated_fav_companies = []
    
    if(fav_companies.length) {
      if (fav_companies.includes(key)) {
        updated_fav_companies = fav_companies.filter(item => item !== key)
      } else {
        fav_companies.push(key)
        updated_fav_companies = fav_companies
      }
  
      let data = {
        'user': userObj.user.pk,
        'company': updated_fav_companies
      }
  
      if (updated_fav_companies.length > 0) {
        axios.put(API_URL + 'favourite/' + this.state.fav_id + '/', data, { headers: authHeader() }).then(res => {
          if(res.data.id) {

            axios.get(API_URL + 'search_page/?q=' + this.state.query + '&user_id=' + userObj.user.pk , { headers: authHeader() }).then(res => {
              let data = res.data;
              this.setState({
                  companies: data,
                  favCheck: false
              })
            })

            this.setState({
              fav_companies: updated_fav_companies,
            })
          } else {
            console.log("Failed to get response")
          }
          
        })
      } else {
        axios.delete(API_URL + 'favourite/' + this.state.fav_id + '/',{ headers: authHeader() }).then(res => {
          if(res.status === 204 ) {
            axios.get(API_URL + 'search_page/?q=' + this.state.query + '&user_id=' + userObj.user.pk , { headers: authHeader() }).then(res => {
              let data = res.data;
              this.setState({
                  companies: data
              })
            })

            this.setState({
              loading: false,
              fav_companies: updated_fav_companies
            })
          } else {
            console.log("Failed to get response")
          }
          
        })
      }
    } else {
      let data = {
        'user': userObj.user.pk,
        'company': [key]
      }

      axios.post(API_URL + 'favourite/' , data, { headers: authHeader() }).then(res => {
        if(res.data.id) {
          axios.get(API_URL + 'search_page/?q=' + this.state.query + '&user_id=' + userObj.user.pk , { headers: authHeader() }).then(res => {
            let data = res.data;
            this.setState({
                companies: data
            })
          })

          this.setState({
            loading: false,
            fav_companies: res.data.company,
            fav_id: res.data.id
          })
        } else {
          console.log("Failed to get response")
        }
        
      })
    }

    

  }

  getFavouriteOnly(){
    let userObj = authService.getCurrentUser()
    
    if (!this.state.favCheck) {
      axios.get(API_URL + 'search_page/?q=' + this.state.query + '&user_id=' + userObj.user.pk , { headers: authHeader() }).then(res => {
        let data = res.data;
        let temp = data.filter(function(o) { return o.favourite !== 0; })
        this.setState({
            companies: temp,
            favCheck: true
        })
      })
    } else {
      axios.get(API_URL + 'search_page/?q=' + this.state.query + '&user_id=' + userObj.user.pk , { headers: authHeader() }).then(res => {
        let data = res.data;
        this.setState({
          companies: data,
          favCheck: false
        })
      })
    }
    
  }


  componentDidMount() {
    const user = authService.getCurrentUser();
    if(user) {
      this.setState({
        currrentUser: user,
        currentUserEmail: user.user.email
      })
      this.props.history.push('/')
    }

    authService.isEmailVerified(user.user.email).then( is_verified => {
      this.setState({
        is_verified: is_verified
      })
      
      if(is_verified) {
        axios.get(API_URL + 'search_page/?q=' + '' + '&user_id=' + user.user.pk , { headers: authHeader() }).then(res => {
          let data = res.data;
          this.setState({
              companies: data,
              is_verified: is_verified
          })
        })
    
        axios.get(API_URL + 'favourite/', { headers: authHeader() }).then(res => {
          let data = res.data;
    
          if(data.length) {
            this.setState({
              fav_companies: data[0].company,
              fav_id: data[0].id
            })
          } else {
            this.setState({
              fav_companies: [],
            })
          }
          
        })
      } else {
        this.props.history.push("/verify_emailNotice");
      }

    } )
    
  }

  render() {
      return (
        <>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>

              {this.state.currrentUser ? (
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
                      {this.state.currentUserEmail} (Verified: {this.state.is_verified.toString()} )
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
            <div className="site-layout-background" style={{ padding: 24, minHeight: 480 }}>
              <div className="login_form">
                <div className="">
                    <Search
                        placeholder="Type to Search"
                        autoFocus={true}
                        enterButton="Search"
                        size="large"
                        onChange={e => this.search(e)}
                    />
                    <br/>
                    <br/>
                    <Space align="center" style={{ marginBottom: 16 }}>
                      My Favourite: <Switch checked={this.state.favCheck} disabled={this.state.isDisable} onChange={this.getFavouriteOnly} />
                    </Space>
                    <br/>
                    <Table columns={this.columns} dataSource={this.state.companies} />
                  </div>
              </div>
            </div>
          </Content>
        </>
    );
  }
}