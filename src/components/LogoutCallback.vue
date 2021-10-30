<template>
  <b-container fluid >
    <div style="min-height: 500px">
      <b-row align-v="center" align-h="center" > 
        <spinner size="large" />
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
    }
  },
  created () {
  },
  async mounted () {
    let userProfile = await caHelper.getUserInfo()
    if ('userDetails' in userProfile && 
          userProfile['userDetails'].includes('cooltrax.com')) {
      this.$store.commit('setProfile', userProfile)
      this.$store.commit('setAuthenticated', true)
    } else {
      this.$store.commit('setAuthenticated', false)
    }
    this.$router.replace({name: 'home'})
  },
  methods: {
  }
}
</script>