const CloudClient = require('../classes/cloudClient');
const Session = require('../classes/Session');

async function start() {
    const user = await Session.create("UserName", "Password");

    const client = new CloudClient(user, "1011492108");

    client.init()

    client.on('command', async (arg1, arg2) => {
        return 'Hello!';
    });
}

start()