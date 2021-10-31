<template>
  <b-container fluid >
    <div style="min-height: 500px">
      <b-row class="mt-3" v-if="isLoginFailed" align-v="center" align-h="center" > 
        <h3>Not a Cooltrax user. Logging out..</h3> 
      </b-row>
      <b-row align-v="center" v-if="isLoginFailed" align-h="center" > 
        <b-spinner/>
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
          // let routerObj = this.$router
          this.isLoginFailed = true
          setTimeout(function () {
            // routerObj.replace('/.auth/logout?post_logout_redirect_uri=/loggedout')
            window.location.href = '/.auth/logout?post_logout_redirect_uri=/loggedout'
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