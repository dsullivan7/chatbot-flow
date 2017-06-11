# A framework for supporting conversation state flow

## Install
```
npm install chatbot-flow
```

## Usage
```javascript
import {Flow} from 'chatbot-flow'

const flowConfig = {
  initialState: 'GREETING',
  states: {
    GREETING: {
      next: () => 'ONE',
    },
    ONE: {
      next: () => 'TWO',
      message: user => ({
        text: `this is one ${user.sessionId}`,
      }),
      noReply: true,
    },
    TWO: {
      match: (user, messageData) => messageData.text === 'trying to match something',
      next: () => 'END',
      message: () => ({
        text: 'this is two',
      }),
    },
    END: {
      noReply: true,
      next: () => null,
      message: () => ({
        text: 'this is the end',
      }),
    },
  },
}

const flow = new Flow(flowConfig)

flow.getMessages('123', {text: 'Hey There'}).then(messages => {
  // do something with the message objects
  // like send them via Facebook Messenger
})
```
