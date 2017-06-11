
class Flow {

  constructor(flow) {
    this.flow = flow
    this.users = {}
  }

  /**
   * returns the state that this answer matches with
   * @param { Object } user - the user object
   * @param { Object } messageData - the message object
   */
  stateMatch(user, messageData) {
    return Object.keys(this.flow.states).find(
      state =>
        (this.flow.states[state].match && this.flow.states[state].match(user, messageData)))
  }

  /**
   * return the next state according to the response
   * @param { Object } user - the user object used to retrieve the next state
   */
  nextState(user) {
    return this.flow.states[user.currentState].next(user)
  }

  /**
   * return the user associated with the userId
   * @param { String } userId - the userId to identify the user
   */
  getUser(userId) {
    return this.users[userId]
  }

  /**
   * returns a Promise whose resolution is an array of messages
   * @param  {String} userId - the userId used to identify the user for this conversation
   * @param  {Object} messageData - an object of user message data
   * @return {Promise} - a Promise for an array
   */
  getMessages(userId, messageData) {
    // extract the user from store
    if (!this.users[userId]) {
      this.users[userId] = {}
    }

    const user = this.users[userId]
    user.userId = userId

    // ensure that the response matches the current state
    // if not, reset the state
    const match = this.stateMatch(user, messageData)
    if (match) {
      user.currentState = match
    }

    if (!user.currentState) {
      user.currentState = this.flow.initialState
    }

    // archive the response
    if (!user.chatHistory) {
      user.chatHistory = []
    }
    user.chatHistory.push({ agent: 'user', data: messageData })

    // save the response according to the state
    if (!user.responses) {
      user.responses = {}
    }
    user.responses[user.currentState] = messageData

    // check to see if this response is a valid one
    if (this.flow.states[user.currentState].validation) {
      const invalidMessage = this.flow.states[user.currentState].validation(messageData)
      if (invalidMessage) {
        // this is an invalid response, send it to the user
        return [invalidMessage]
      }
    }

    // update the current state
    user.currentState = this.nextState(user)

    const messages = []

    // create messages until we encounter a message that needs a reply
    while (true) {
      if (user.currentState) {
        const message = this.flow.states[user.currentState].message(user)
        messages.push(message)

        if (this.flow.states[user.currentState].noReply) {
          user.currentState = this.nextState(user)
        } else {
          break
        }
      } else {
        break
      }
    }

    return Promise.all(messages)
      .then(values => values.forEach(value => user.chatHistory.push({ agent: 'bot', data: value })))
      .then(() => Promise.all(messages))
  }
}

module.exports = { Flow }
