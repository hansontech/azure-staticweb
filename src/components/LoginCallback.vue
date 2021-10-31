<template>
  <b-container fluid >
    <div style="min-height: 500px">
      <b-row align-v="center" align-h="center" > 
        <spinner size="large" />
      </b-row>
      <b-row v-if="isLoginFailed" align-v="center" align-h="center" > 
        <h3>Sign-in did not succeed. Logging out..</h3> 
      </b-row>
    </div>
  </b-container>
</template>

<script>
import caHelper from '../caHelper'

export default {
  name: 'authcallback',
  data () {
    return {
      isLoginFailed: false
    }
  },
  created () {
    var curUrl = window.location.href
    console.log('callback is called: ', curUrl)
  },
  async mounted () {
    let userProfile = await caHelper.getUserInfo()
    if ('userDetails' in userProfile) { 
        if (userProfile['userDetails'].includes('cooltrax.com')) {
          this.$store.commit('setProfile', userProfile)
          this.$store.commit('setAuthenticated', true)
          this.$router.replace({name: 'list_devices'})
        } else {
          let routerObj = this.$router
          this.isLoginFailed = true
          setTimeout(function () {
            routerObj.replace('/.auth/logout?post_logout_redirect_uri=/loggedout')
          }, 5000)
        }
    } else {
      this.$store.commit('setAuthenticated', false)
    }
  },
  methods: {
  }
}
</script>