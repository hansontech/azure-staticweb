
export default {
  state: {
    env: {
      name: 'DEV0',
      DEV0: {
        koiApiUrlBase: 'goldfish-inbound-app.azurewebsites.net',
        koiApiKey: 'CZw/SVXgMCUYFdaSaA1njSCN0F1a4GB5sS5Z4Nqxg6aiu3U5FNKrMQ=='
      },
      DEV: {
        koiApiUrlBase: 'goldfish-app-koi-service-dev.azurewebsites.net',
        koiApiKey: 'FcfbmYVqZZwCFjPF5EJBtnNfdSPNkFMontUJ1kmH-Iy9AzFuOFHu-w=='
      },
      PROD: {
        koiApiUrlBase: 'goldfish-app-koi-service-prod.azurewebsites.net',
        koiApiKey: 'QJRdyS9pH6i9ppU0geyJ5Y5AmjD_GcdCvFgqNHphLvIMAzFudNOS0g=='
      }
    }
  },
  getters: {
    koiEnv: state => {
      return state.env[state.env.name]
    },
    koiEnvName: state => {
      return state.env.name
    }
  },
  mutations: {
    setKoiEnvName: (state, name) => {
      state.env.name = name
    },
    toggleKoiEnv: (state) => {
      if (state.env.name === 'PROD') {
        state.env.name = 'DEV0'
      } else if (state.env.name === 'DEV') {
        state.env.name = 'PROD'
      } else if (state.env.name === 'DEV0') {
        state.env.name = 'DEV'
      }
    }
  }
}
