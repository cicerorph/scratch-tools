const ApiWrapper = require('../classes/ApiWrapper');
const Session = require('../classes/Session');

const user = Session.create("Username", "Password");

const wrapper = new ApiWrapper(user)

async function run() {
    const userinfo = await wrapper.getUserInfo("MubiLop");

    console.log(userinfo.profile.country)
}

run();