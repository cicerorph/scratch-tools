const axios = require("axios");

class ApiWrapper {
    constructor(user){
        this.session = user;
    }

    async getProjectInfo(id) {

    }
    
    async getUserInfo(username) {
        const response = await axios.get(`https://api.scratch.mit.edu/users/${username}/`);

        return response.data;
    }
}

module.exports = ApiWrapper;