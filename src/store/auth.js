
export default {
  state: {
    profile: null,
    accessToken: null,
    idToken: null,
    refreshToken: null,
    verification: null,
    isAuthenticated: false,
    isGuestLoggedin: false,
    count: 0
  },

  getters: {
    profile: state => state.profile,
    verification: state => state.verification,
    accessToken: state => state.accessToken,
    idToken: state => state.idToken,
    refreshToken: state => state.refreshToken,
    isAuthenticated: state => state.isAuthenticated,
    isGuestLoggedin: state => state.isGuestLoggedin,
    username: state => {
      try {
        const cognitoUsername = state.profile['cognito:username']
        const username = cognitoUsername.replace(/\./g, '_') // for Apple User name case .
            // as the username is going to be used as UserId, and it cannot have characters other than a-zA-Z_
            // Apple returned sub field has the formatlike 'SignInWithApple_001315.e4ff039ee97a4392bde22a525c7bc2ff.0226'
            // must replace the . to _
        return username
      } catch (e) {
        return null
      }
    },
    userId: state => {
      // sub field is the UUID of the authenticated user.
      // sub is globally unique and hence is unique for user pool as well.
      // Unlike username, which can be reassigned to another user in user pool, sub is never reassigned.
      return state.profile.sub
    }
  },
  mutations: {
    setProfile: (state, profile) => {
      state.profile = profile
    },
    setAccessToken: (state, accessToken) => {
      state.accessToken = accessToken
    },
    setIdToken: (state, idToken) => {
      state.idToken = idToken
    },
    setRefreshToken: (state, refreshToken) => {
      state.refreshToken = refreshToken
    },
    setVerification: (state, verification) => {
      state.verification = verification
    },
    setAuthenticated: (state, isAuthenticated) => {
      state.isAuthenticated = isAuthenticated
    },
    setGuestLoggedin: (state, isGuestLoggedin) => {
      state.isGuestLoggedin = isGuestLoggedin
    }
  },

  actions: {
  }
}
