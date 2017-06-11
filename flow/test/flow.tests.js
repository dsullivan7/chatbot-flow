/* eslint-env node, mocha */
import assert from 'assert'

import { Flow } from '../Flow'

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
        answers: {
          OPTION_1: 'Option 1',
          OPTION_2: 'Option 2',
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

describe('flow', () => {
  describe('#getMessages()', () => {
    const flow = new Flow(flowConfig)
    it('should return an array of messages', () =>
      flow.getMessages('123', { text: 'my text' }).then((messages) => {
        assert.equal(messages[0].text, 'this is one 123')
        assert.equal(messages[1].text, 'this is two')
        assert.equal(messages[1].answers.OPTION_1, 'Option 1')
        assert.equal(messages[1].answers.OPTION_2, 'Option 2')
      }))
    it('should return the end message', () =>
      flow.getMessages('123', { text: 'my text' }).then((messages) => {
        assert.equal(messages[0].text, 'this is the end')
      }))
  })
  describe('#getMessagesWithMatch()', () => {
    const flow = new Flow(flowConfig)
    it('should match to the state', () =>
      flow.getMessages('123', { text: 'trying to match something' }).then((messages) => {
        assert.equal(messages[0].text, 'this is the end')
      }))
  })
  describe('#stateMatch()', () => {
    const flow = new Flow(flowConfig)
    it('should return TWO when testing TWO_OPTION_1', () => {
      assert.equal(flow.stateMatch({}, { payload: 'TWO_OPTION_1' }), 'TWO')
    })
    it('should return TWO when testing qwer', () => {
      assert.equal(flow.stateMatch({}, { text: 'trying to match something' }), 'TWO')
    })
  })
})
