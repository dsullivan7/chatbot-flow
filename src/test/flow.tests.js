/* eslint-env node, mocha */
import assert from 'assert'

import Flow from '../Flow'

const flowConfig = {
  defaultState: 'ONE',
  states: {
    ONE: {
      next: user => (user.userId === '123' ? 'TWO' : 'THREE'),
      message: user => ({
        text: `this is your userId: ${user.userId}`,
      }),
      noReply: true,
    },
    TWO: {
      next: 'THREE',
      match: (user, messageData) => (messageData.text === 'trying to match something'),
      message: user => ({
        text: `You started off saying "${user.initialMessage.text}"`,
      }),
    },
    THREE: {
      next: 'END',
      message: {
        text: 'This one is just an object',
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

describe('flow', () => {
  describe('#getMessages()', () => {
    const id = '123'
    const flow = new Flow(flowConfig)
    it('should return an array of messages', () =>
      flow.getMessages(id, { text: 'my first message' }).then((messages) => {
        assert.equal(messages[0].text, 'this is your userId: 123')
        assert.equal(messages[1].text, 'You started off saying "my first message"')
      }))
    it('should return the middle message', () =>
      flow.getMessages(id, { text: 'my second message' }).then((messages) => {
        assert.equal(messages[0].text, 'This one is just an object')
      }))
    it('should return the end message', () =>
      flow.getMessages(id, { text: 'my third message' }).then((messages) => {
        assert.equal(messages[0].text, 'Your answer to my first question was "my second message"')
      }))
    it('should return the first and thrid messages', () =>
      flow.getMessages('456', { text: 'my first message' }).then((messages) => {
        assert.equal(messages[0].text, 'this is your userId: 456')
        assert.equal(messages[1].text, 'This one is just an object')
      }))
  })
  describe('#getMessagesWithMatch()', () => {
    const id = '123'
    const flow = new Flow(flowConfig)
    it('should match to the state', () =>
      flow.getMessages(id, { text: 'trying to match something' }).then((messages) => {
        assert.equal(messages[0].text, 'This one is just an object')
      }))
  })
  describe('#stateMatch()', () => {
    const flow = new Flow(flowConfig)
    it('should return TWO when testing "trying to match something"', () => {
      assert.equal(flow.stateMatch({}, { text: 'trying to match something' }), 'TWO')
    })
  })
})
