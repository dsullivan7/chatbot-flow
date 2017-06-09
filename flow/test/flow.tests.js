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

describe('flow', () => {
  describe('#getMessages()', () => {
    it('should return an array of messages', () =>
      flow.getMessages('123', { text: 'my text' }).then((messages) => {
        assert.equal(messages[0].text, 'this is one 123')
        assert.equal(messages[1].text, 'this is two')
      }))
    it('should return the end message', () =>
      flow.getMessages('123', { text: 'my text' }).then((messages) => {
        assert.equal(messages[0].text, 'this is the end')
      }))
  })
  describe('#stateMatch()', () => {
    it('should return TWO when testing TWO_OPTION_1', () => {
      assert.equal(flow.stateMatch({}, { payload: 'TWO_OPTION_1' }), 'TWO')
    })
    it('should return TWO when testing qwer', () => {
      assert.equal(flow.stateMatch({}, { text: 'qwer' }), 'TWO')
    })
  })
})
