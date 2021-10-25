<template>
<div>
  <App/>
  <b-container fluid style="padding-right: 30px; padding-left: 30px; margin-top:65px; margin-left:0px; margin-right:0px"> 
  <b-form @submit="onSubmit" @reset="onReset" v-if="show">
    <b-form-group
        id="input-group-1"
        label="Username:"
        label-for="input-1"
        description=""
    >
      <b-form-input
        id="input-1"
        v-model="form.username"
        type="text"
        required
        placeholder="Enter username"
      ></b-form-input>
    </b-form-group>
    <b-form-group
        id="input-group-2"
        label="Password:"
        label-for="input-2"
        description=""
    >
      <b-form-input
        id="input-2"
        v-model="form.password"
        type="password"
        required
        placeholder="Enter password"
        class="mt-3"
      ></b-form-input>
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
    <b-button type="reset" variant="danger" class="ml-2">Reset</b-button>
    <!--
    <div class="mt-2">
      <b-button variant="primary" @click="login()">Login</b-button>
      <b-button variant="danger" @click="onReset()" class="ml-2">Reset</b-button>
    </div>
    -->
  </b-form>
  </b-container>
</div>
</template>

<script>
export default {
  name: 'home',
  data: function () {
    return {
      form: {
        username: '',
        password: ''
      },
      show: true
    }
  },
  computed: {
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.username = ''
      this.form.password = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
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
