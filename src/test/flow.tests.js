/* eslint-env node, mocha */
import assert from 'assert'

import Flow from '../Flow'

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

describe('flow', () => {
  describe('#getMessages()', () => {
    const flow = new Flow(flowConfig)
    it('should return an array of messages', () =>
      flow.getMessages('123', { text: 'my first message' }).then((messages) => {
        assert.equal(messages[0].text, 'this is your userId: 123')
        assert.equal(messages[1].text, 'You started off saying "my first message"')
      }))
    it('should return the end message', () =>
      flow.getMessages('123', { text: 'my second message' }).then((messages) => {
        assert.equal(messages[0].text, 'Your answer to my first question was "my second message"')
      }))
  })
  describe('#getMessagesWithMatch()', () => {
    const flow = new Flow(flowConfig)
    it('should match to the state', () =>
      flow.getMessages('123', { text: 'trying to match something' }).then((messages) => {
        assert.equal(messages[0].text, 'Your answer to my first question was "trying to match something"')
      }))
  })
  describe('#stateMatch()', () => {
    const flow = new Flow(flowConfig)
    it('should return TWO when testing "trying to match something"', () => {
      assert.equal(flow.stateMatch({}, { text: 'trying to match something' }), 'TWO')
    })
  })
})
