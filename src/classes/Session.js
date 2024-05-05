// Code from "scratchcloud" package but modified to use axios

const axios = require('axios');

const cookie = {
  parse: c => {
    let cookies = {};
    c.split(';').forEach(item => {
      if(['Domain', 'expires', 'Path', 'Max-Age'].includes(item.split('=')[0].trim())) {} else
      if(item.indexOf('=') != -1)
        cookies[item.split('=')[0].trim()] = item.split('=')[1].trim()
    });
    return cookies;
  }
}

class Session {
  constructor(username = process.env.USERNAME, password = process.env.PASSWORD, callback) {
    this.cookie = "";
    if(!process.env.TOKEN && !this.token) {
      this.getInitCookie(() => {
        this.getCSRFToken(() => {
          this.construct(username, password, callback);
        });
      });
    } else {
      this.construct(username, password, callback);
    }
  }

  construct(username, password, callback) {
    let self = this;
    axios.post('https://scratch.mit.edu/accounts/login/', {
      username: username,
      password: password,
      useMessages: true
    }, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'referer': 'https://scratch.mit.edu',
        'X-CSRFToken': self.token || process.env.TOKEN || 'a',
        'Cookie': self.cookie,
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "origin": "https://scratch.mit.edu/",
        "sec-ch-ua": "\" Not;A Brand\;v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
        "sec-ch-ua-mobile": "?0",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36"
      }
    }).then(response => {
      let cookies = cookie.parse(response.headers['set-cookie']);
      self.session = cookies.scratchsessionsid;
      self.token = cookies.scratchcsrftoken.split('"').join('');
      return response.data;
    }).then(data => {
      self.username = data[0].username;
      callback(this);
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  getInitCookie(callback) {
    const self = this;
    axios.get("https://scratch.mit.edu/").then(response => {
      if(response.headers['set-cookie']) {
        let cookies = cookie.parse(response.headers['set-cookie']);
        for(let key in cookies) {
          if(cookies[key] !== '') self.cookie += key + "=" + cookies[key] + "; ";
        }
      }
      callback();
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  getCSRFToken(callback) {
    const self = this;
    axios.get("https://scratch.mit.edu/csrf_token/").then(response => {
      let cookies = cookie.parse(response.headers['set-cookie']);
      for(let key in cookies) {
        if(cookies[key] !== '') self.cookie += key + "=" + cookies[key] + "; ";
      }
      self.token = cookies.scratchcsrftoken.split('"').join('');
      callback();
    }).catch(error => {
      console.error('Error:', error);
    });
  }
}

Session.create = (username = process.env.USERNAME, password = process.env.PASSWORD) => {
  return new Promise((resolve, reject) => {
    const session = new Session(username, password, resolve);
  });
}

module.exports = Session;