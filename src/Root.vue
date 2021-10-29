<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'root',
  data () {
    return {
    }
  },
  created () {
    console.log('Root.vue created too')
  },
  mounted () {
    console.log('Root mounted')
  },
  beforeDestroy () {
  },
  methods: {
  }
}
</script>

<style>
</style>
