import React, { Component } from "react";
import { Table, Space, Input, Button, Switch } from 'antd';
import { HeartTwoTone, HeartFilled } from '@ant-design/icons';
import axios from 'axios';
import { Link } from "react-router-dom";

import authHeader from '../Services/authHeader';
import authService from '../Services/authService';

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
        isEmailVerified: false,
        favCheck: false, 
        isDisable: false
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
            // <a href="javascript:;" onClick={() => this.update_favourite_list(key['key'])} style={{ marginRight: 8, }} > like </a>
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
    console.log(this.state.favCheck)

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
    let userObj = authService.getCurrentUser()
    let isEmailVerified = authService.getIsEmailVerified();

    console.log(isEmailVerified)
    this.setState({
      isEmailVerified: isEmailVerified
    })

    if(isEmailVerified) {
      axios.get(API_URL + 'search_page/?q=' + '' + '&user_id=' + userObj.user.pk , { headers: authHeader() }).then(res => {
        let data = res.data;
        this.setState({
            companies: data
        })
      })
  
      axios.get(API_URL + 'favourite/', { headers: authHeader() }).then(res => {
        let data = res.data;
  
        if(data.length) {
          console.log("Here")
          this.setState({
            fav_companies: data[0].company,
            fav_id: data[0].id
          })
        } else {
          console.log("Here 2")
          this.setState({
            fav_companies: [],
          })
        }
        
      })
    } else {
      this.props.history.push("/verify_emailNotice");
    }

    
  }

  render() {
      return (
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
              {/* <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
              /> */}
                My Favourite: <Switch checked={this.state.favCheck} disabled={this.state.isDisable} onChange={this.getFavouriteOnly} />
              </Space>
              <br/>
              <Table columns={this.columns} dataSource={this.state.companies} />
            </div>
        </div>
    );
  }
}