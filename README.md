# A framework for supporting conversation state flow

## Install
```
npm install chatbot-flow
```

## Usage
```javascript
import {Flow} from 'chatbot-flow'

const flowConfig = {
  defaultState: 'ONE',
  states: {
    ONE: {
      next: () => 'TWO',
      message: user => ({
        text: `this is one ${user.userId}`,
      }),
      noReply: true,
    },
    TWO: {
      match: (user, messageData) => (messageData.text === 'trying to match something'),
      next: () => 'END',
      message: () => ({
        text: 'this is two',
        answers: {
          TWO_OPTION_1: 'Option 1',
          TWO_OPTION_2: 'Option 2',
        },
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
