import axios from "axios";

const API_URL = "http://localhost:8000/api/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "rest_auth/login/", {
        username,
        password
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        this.isEmailVerified(response.data.user.email)

        return response.data;
      }).catch(function (error) {
        return error.response
      });
  }

  isEmailVerified(email) {
    return axios
      .get(API_URL + "is_email_verified/" + email + '/')
      .then(response => {
        console.log(response.data[0])
        if (response) {
          localStorage.setItem("email_verify", response.data[0].is_verified);
        } else {
          localStorage.setItem("email_verify", false);
        }
      })
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("email_verify");
  }

  register(username, email, password1, password2) {
    return axios.post(API_URL + "rest_auth/registration/", {
      username,
      email,
      password1,
      password2
    }).then(function (response) {
      return response.data
    }).catch(function (error) {
      return error.response
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
  getIsEmailVerified() {
    return localStorage.getItem('email_verify');;
  }

  resetPassword(email) {
    return axios.post(API_URL + "rest_auth/password/reset/", {email}).then(res => {
      return res.data
    }).catch(error => {
      return error.response
    });
  }
  
  resetPasswordConfirm(new_password1, new_password2, uid, token) {
    return axios.post(API_URL + "rest_auth/password/reset/confirm/", {
      new_password1, 
      new_password2,
      uid,
      token
    }).then(res => {
      console.log(res)
      return res.data
    }).catch(error => {
      return error
    });
  }
  
  verifyEmailConfirm(key) {
    return axios.post(API_URL + "rest_auth/account-confirm-email/", {'key': key}).then(res => {
      return res
    }).catch(error => {
      return error
    });
  }


}

export default new AuthService();