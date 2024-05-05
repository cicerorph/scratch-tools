# scratchattach.js

`scratchattach.js` is a Node.js library for interacting with the Scratch API, allowing you to manage user/projects, get user data, as well as interact with cloud variables with an customized cloudclient for an better experience.

## Installation

Install via npm:

```bash
npm install scratchattach.js
```

## Usage

### Example

```javascript
const { CloudClient, Session } = require('scratchattach.js');

async function start() {
    const user = await Session.create("UserName", "Password");

    const client = new CloudClient(user, "1011492108");

    client.init();

    client.on('command', async (arg1, arg2) => {
        return 'Hello!';
    });
}

start();
```

*Remember that when using this you will need the custom client that can be got from [here](https://github.com/cicerorph/scratchattach.js/wiki/start.md)*

### Documentation

- `Session`: Represents a session with the Scratch platform. It provides methods for logging in and obtaining authentication tokens so the code can use it.

- `CloudClient`: Represents a client for interacting with cloud variables on the Scratch platform.

## Contributing

Contributions are welcome! Please submit issues or pull requests through the [GitHub repository](https://github.com/cicerorph/scratchattach.js).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
