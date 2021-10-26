<template>
<div>
  <App/>
  <b-container fluid style="padding-right: 30px; padding-left: 30px; margin-top:65px; margin-left:0px; margin-right:0px"> 
  <b-modal id="modal-response" title="Response" size="xl" ok-only>
    <div v-if="response !== null">
    <p>CalAmp API Calls</p>
    <b-row><b-col>
    {{response['whitelist_request']}}
    </b-col> </b-row>
    <b-row><b-col>
    {{response['assign_sensor_requests'][0]}}
    </b-col> </b-row>
    <b-row><b-col>
    {{response['assign_sensor_requests'][1]}}
    </b-col> </b-row>
    <b-row><b-col>
    <p class="mt-2">CalAmp API Responses</p>
    </b-col> </b-row>
    <b-row><b-col>
    {{response['whitelist_response']}}
    </b-col> </b-row>
    <b-row><b-col>
    {{response['assign_sensor_responses'][0]}}
    </b-col> </b-row>
    <b-row><b-col>
    {{response['assign_sensor_responses'][1]}}
    </b-col> </b-row>
    </div>
  </b-modal>
  <b-form @submit="onSubmit" @reset="onReset" v-if="show">
    <b-form-group
        id="input-group-1"
        label="CalAmp Device Id"
        label-for="input-1"
        description=""
    >
      <b-form-input
        id="input-1"
        v-model="form.deviceId"
        type="text"
        required
        placeholder="Enter device Id"
      ></b-form-input>
    </b-form-group>
    <b-form-group
        id="input-group-2"
        label="Temperature Sensor Number"
        label-for="input-2"
        description=""
    >
      <b-form-input
        id="input-2"
        v-model="form.sensorIndex"
        type="number"
        min="0" max="1"
        required
        placeholder="Enter 0 or 1"
      ></b-form-input>
    </b-form-group>
    <b-form-group
        id="input-group-3"
        label="ELA Tag Name"
        label-for="input-3"
        description=""
    >
      <b-form-input
        id="input-3"
        v-model="form.tagName"
        type="text"
        required
        placeholder="Enter ELA Tag Name"
        class="mt-3"
      ></b-form-input>
    </b-form-group>
        <b-form-group
        id="input-group-4"
        label="ELA Tag Bluetooth Address:"
        label-for="input-4"
        description=""
    >
      <b-form-input
        id="input-4"
        v-model="form.tagAddress"
        type="text"
        required
        placeholder="Enter Bluetooth Address e.g. 0x112233445566 or 11:22:33:44:55:66"
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
  props: ['deviceId'],
  data: function () {
    return {
      form: {
        deviceId: '',
        sensorIndex: 0,
        tagName: '',
        tagAddress: ''
      },
      response: null,
      show: true
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      // alert(JSON.stringify(this.form))
      let form = this.form
      if (form.tagAddress.indexOf(':') > -1) {
        form.tagAddress = '0x' + form.tagAddress.replace(/:/g, '')
      }
      let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/cooltrax_ui?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==&command=set_tag&sensor_index=${form.sensorIndex}&device_id=${form.deviceId}&tag_name=${form.tagName}&tag_address=${form.tagAddress}&run=true`
      fetch(apiUrl,  {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}
      })
      .then(response => response.json())
      // {
        // console.log('test:', response)
        // alert(JSON.stringify(response))
      // }) //response.json())
      .then(data => {
        // alert(JSON.stringify(data))
        this.response = data
        console.log(this.response)
        this.$forceUpdate()
        this.$bvModal.show('modal-response')
        this.$forceUpdate()
      });
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.deviceId = ''
      this.form.sensorIndex = 0
      this.form.tagName = ''
      this.form.tagAddress = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  },
  created () {
    console.log('created')
    if (this.deviceId !== undefined) {
      this.form.deviceId = this.deviceId
    }
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
