<template>
  <div>
    <div>
      <p>Test header</p>
    </div>
  <router-view></router-view>
  <!-- <div>
      <p>Test header</p>
    </div>
    -->
  </div>
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
