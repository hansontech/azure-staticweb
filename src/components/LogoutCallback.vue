<template>
  <b-container fluid >
    <div style="min-height: 500px">
      <b-row align-v="center" align-h="center" > 
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
    }
  },
  created () {
  },
  async mounted () {
    this.$store.commit('setAuthenticated', false)
    this.$router.replace('/')
  },
  methods: {
  }
}
</script>