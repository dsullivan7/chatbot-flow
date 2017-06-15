/*
eslint no-param-reassign:
  [
  "error", { "props": true, "ignorePropertyModificationsFor": ["user"] }
  ]
*/

export default class Flow {

  constructor(flow) {
    this.flow = flow
    this.users = {}
  }

  /**
   * returns the state that this answer matches with
   * @param { Object } user - the user object
   * @param { Object } messageData - the message object
   * @return { String } - the state that this message matches, null if no state
   */
  stateMatch(user, messageData) {
    return Object.keys(this.flow.states).find(
      state =>
        (this.flow.states[state].match && this.flow.states[state].match(user, messageData)))
  }

  /**
   * return the next state according to the response
   * @param { Object } user - the user object used to retrieve the next state
   * @param { String } - the next state for the user
   */
  nextState(user) {
    return this.flow.states[user.currentState].next(user)
  }

  /**
   * return the user associated with the userId
   * @param { String } userId - the userId to identify the user
   * @return { Object } - the user identified by the id
   */
  getUser(userId) {
    return this.users[userId]
  }

  /**
   * adds and returns a user associated with the userId
   * @param { String } userId - the userId to identify the user
   * @return { Object } - the user created
   */
  addUser(userId) {
    this.users[userId] = {
      userId,
      chatHistory: [],
      responses: {},
    }
    return this.getUser(userId)
  }

  /**
   * returns a Promise whose resolution is an array of messages
   * @param  {String} userId - the userId used to identify the user for this conversation
   * @param  {Object} messageData - an object of user message data
   * @return {Promise} - a Promise for an array
   */
  getMessages(userId, messageData) {
    // extract the user from store
    let user = this.getUser(userId)
    if (!user) {
      user = this.addUser(userId)
    }

    // archive the response
    user.chatHistory.push({ agent: 'user', data: messageData })

    // try to match the message with a given state
    const match = this.stateMatch(user, messageData)
    if (match) {
      user.currentState = match
    }

    if (!user.currentState) {
      user.currentState = this.flow.defaultState
      user.initialMessage = messageData
    } else {
      // update the current state
      user.responses[user.currentState] = messageData
      user.currentState = this.nextState(user)
    }

    const messages = this.messageChain(user)

    return messages
      .then(values => values.forEach(value => user.chatHistory.push({ agent: 'bot', data: value })))
      .then(() => messages)
  }

  messageChain(user) {
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
  }
}
