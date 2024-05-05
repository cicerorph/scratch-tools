const enc = require('../helpers/encoder');
const { Cloud } = require('../helpers/scratchcloud/index');

class CloudClient {
    constructor(session, projectId) {
      this.user = session;
      this.projectId = projectId;
      this.cloud;
      this.enc = enc;
      this.events = {};
      this.lastUpdateTimes = {};
      this.var = "FROM_HOST";
    }

    init() {
      console.log(this.user)
      const cloud = new Cloud(this.user, this.projectId, (error, c) => { // for some reason using function(user) generates their own "this" instance so uh this fixes it
          this.cloud = c;
          this.handleScratchEvents();
      });
    }    
  
    // register event handler
    on(eventName, handler) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(handler);
    }
  
    // emit event
    emit(eventName, ...args) {
      const handlers = this.events[eventName];
      if (handlers) {
        const promises = handlers.map(handler => handler(...args, this.cloud));
        return Promise.all(promises);
      } else {
        return Promise.resolve();
      }
    }
  
    // easier to handle things
    handleScratchEvents() {
      console.log("ScratchAttach.js | Cloud Client => Started")
      this.cloud.on('set', async (name, value) => {
        if (name.includes("TO_HOST")) {
          const decval = this.enc.decode(value.slice(0, -6));
          const requesterId = value.slice(-5);
          const [eventName, ...args] = decval.split('&');
          const response = await this.emit(eventName, ...args);
          if (response) {
            // const fromHostVar = this.getNextCloudVar(this.latestVar); (WIP)
            this.sendResponse("FROM_HOST", response, requesterId); // if something is returned from the .on function it sends back to the project
          }
        }
      });
    }
  
    // send response back to the requester with ID (So people can't receive other people requests)
    sendResponse(cloudVar, message, requesterId) {
      const currentTime = Date.now();
      if (!this.lastUpdateTimes[cloudVar] || currentTime - this.lastUpdateTimes[cloudVar] >= 100) {
        const encodedMessage = this.enc.encode(message[0]);
        this.cloud.set(cloudVar, encodedMessage + "." + requesterId);
        this.lastUpdateTimes[cloudVar] = currentTime;
      } else {
        // Use another cloud variable
        /* Waiting for cooldown on cloud var. Using another cloud variable. (WIP) */  // BTW THIS IS NOT CHATGPT //
        this.sendResponse("FROM_HOST", message, requesterId);
      }
    }
  
    // Get the next available cloud variable (WIP)
    getNextCloudVar(currentVar) {
      const currentVarNumber = parseInt(currentVar.split('_')[2]);
      const nextVarNumber = (currentVarNumber % 9) + 1;
      return `FROM_HOST_${nextVarNumber}`;
    }
}
  
module.exports = CloudClient;