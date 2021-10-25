<template>
<div>
  <App/>
  <b-container fluid style="padding-right: 0px; padding-left: 0px; margin-top:65px; margin-left:0px; margin-right:0px"> 
    <div style="height: 250px;">
      <b-row style="height:100%">
        <b-col>
          test
        </b-col>
      </b-row>
    </div>
  </b-container>
</div>
</template>

<script>
export default {
  name: 'home',
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  created () {
    console.log('created')
  }
}
</script>
<style>

.at-home{
  margin-top: 50px;
}
.at-home p {
    font-size:18px;
}

.at-home h5 {
    font-size:18px;
}

.stretch {
    width:100%;
}

.centered-and-cropped { object-fit: cover }

.top-foto {
  z-index: -1;
  width: 100%;
  height: 700px;
}

.bgimg {
    background-image: url('/static/aiot-home-bg.jpg');

}

.at-home li{
  margin: 20px 0;
  font-size: 18px;
}
</style>

<style scoped>
.popover{
    max-width: 100%; /* Max Width of the popover (depending on the container!) */
}
</style>
