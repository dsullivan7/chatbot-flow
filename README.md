# Building Conversations for Chatbots

[![NPM version](https://img.shields.io/npm/v/chatbot-flow.svg?style=flat)](https://www.npmjs.org/package/chatbot-flow)
[![Build Status](https://travis-ci.org/dsullivan7/chatbot-flow.svg?branch=master)](https://travis-ci.org/dsullivan7/chatbot-flow)
[![Coverage Status](https://img.shields.io/coveralls/dsullivan7/chatbot-flow.svg)](https://coveralls.io/r/dsullivan7/chatbot-flow?branch=master)
[![License](https://img.shields.io/npm/l/jfs.svg)](https://github.com/dsullivan7/chatbot-flow/blob/master/LICENSE.txt)

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
      next: 'TWO',
      message: {
        text: 'This is an initial statement that doesn\'t need a response',
      },
      noReply: true,
    },
    TWO: {
      next: 'END',
      message: {
        text: 'This is my first question',
      },
    },
    END: {
      noReply: true,
      next: null,
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
  [{text: 'This is an initial statement that doesn\'t need a response'},
   {text: 'This is my first question'}]

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

## Contact
If you have any feedback, ideas, requests, or other thoughts, feel free to reach out to me at dbsullivan23@gmail.com
