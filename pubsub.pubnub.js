const PubNub = require('pubnub');

const credentials = {
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIVE_KEY,
    secretKey: process.env.SECRET_KEY
}

const CHANNELS = {
    TEST: 'TEST',
    TEST_TWO: 'TEST_TWO'
}
class PubSub {
    constructor() {
        if(!credentials.publishKey || !credentials.subscribeKey || !credentials.secretKey){
            console.error('[ERROR]: The "PUBLISH_KEY/SUBSCRIBE_KEY/SECRET_KEY" environment variable is required');
            process.exit(1);
        }
        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener())
    }
    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Message received. Channel: ${channel}. Message: ${message}.`)
            }
        }
    }
    publish({channel, message}){
        this.pubnub.publish({channel, message});
    }
}
const testPubSub = new PubSub();
testPubSub.publish({channel: CHANNELS.TEST, message: "hello pubnub"});

module.exports = PubSub;