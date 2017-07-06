export default class UserStore {

  constructor() {
    this.users = {}
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
}
