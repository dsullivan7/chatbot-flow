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
      noReply: true,
      next: () => 'TWO',
      message: () => ({
        text: 'this is one',
      }),
    },
    TWO: {
      match: (user, response) => response === 'qwer',
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
