# Building Conversations for Chatbots

[![NPM version](https://img.shields.io/npm/v/chatbot-flow.svg?style=flat)](https://www.npmjs.org/package/chatbot-flow)
[![Build Status](https://travis-ci.org/dsullivan7/chatbot-flow.svg?branch=master)](https://travis-ci.org/dsullivan7/chatbot-flow)
[![Coverage Status](https://img.shields.io/coveralls/dsullivan7/chatbot-flow.svg)](https://coveralls.io/r/dsullivan7/chatbot-flow?branch=master)

chatbot-flow is an implementation of finite state machines built with chatbot conversations in mind.

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
        text: `this is your userId: ${user.userId}`,
      }),
      noReply: true,
    },
    TWO: {
      match: (user, messageData) => (messageData.text === 'trying to match something'),
      next: () => 'END',
      message: user => ({
        text: `You started off saying "${user.initialMessage.text}"`,
      }),
    },
    END: {
      noReply: true,
      next: () => null,
      message: user => ({
        text: `Your answer to my first question was "${user.responses.TWO.text}"`,
      }),
    },
  },
}

const flow = new Flow(flowConfig)

flow.getMessages('123', {text: 'Hey There'})
.then(messages => {
  /*
  messages:
  [{text: 'this is your userId: 123'}, {text: 'You started off saying "Hey There"'}]

  You can use send this array using whatever platform you choose: Facebook Messenger, Slack, etc...
  */
})
.then(() => flow.getMessages('123', {text: 'This is my answer'}))
.then(messages => {
  /*
  messages:
  [{text: 'Your answer to my first question was "This is my answer"'}]
  */
})
```
