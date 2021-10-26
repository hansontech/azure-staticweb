<template>
<div>
  <App/>
  <b-container fluid style="padding-right: 30px; padding-left: 30px; margin-top:65px; margin-left:0px; margin-right:0px"> 
    <b-row class="mt-5" align-v="center">
      <b-col align="start" sm="4">
          <h4>CalAmp Devices <small>({{(devices !== null) ? devices.length : 0}})</small></h4>
        </b-col>         
        <b-col align="end">
          <b-button variant="info" @click="refresh()">Refresh</b-button>
        </b-col>
    </b-row>
    <b-row class="mt-2" style="border-bottom: 1px solid green;">
    </b-row>
    <b-row class="mt-2" >
      <b-col class="at-scroll">
        <b-card-group deck>
          <b-modal id="modalDeleteConfirm"
                hide-header 
                size="sm"
                @ok="deleteThing(deletingThingIndex)"
                >
            <div class="text-center">
              <h5>Delete the thing?</h5>
            </div>                  
          </b-modal>
        <!-- img-src="/static/photo-54.png" -->
        <b-card v-for="(device) in devices" :key="device.deviceId"
            header = " "
            >
            <b-row align-v="center">
              <b-col lg="9">
                <h5 class="card-text">
                  {{device.deviceId}}
                </h5>
              </b-col>
              <b-col lg="3" align="end">
                <b-dropdown variant="secondary">
                  <b-dropdown-item @click.stop="resetTags(device)">Reset tags</b-dropdown-item>
                  <b-dropdown-item :href="'set_tag/' + device.deviceId">Set tags</b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                Mapped to UMD <b>{{device.umdName}}</b>
              </b-col>
            </b-row>
            <b-row class="mt-2" v-if="'tags' in device">
              <b-col>
               <b-row>
                <b-col>Temperature Sensors</b-col>
               </b-row>
               <b-row class="ml-1" v-for="(tag) in Object.keys(device.tags)" :key="tag">
                <b-col lg="1">
                  {{tag}}
                </b-col>
                <b-col lg="4">
                  {{device.tags[tag].tagName}}
                </b-col>
                <b-col>
                  {{device.tags[tag].tagAddress}}
                </b-col>
               </b-row>
              </b-col>
            </b-row>

          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
export default {
  name: 'list_devices',
  data: function () {
    return {
      devices: null
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    resetTags() {

    },
    refresh() {
      this.loadDevices()
    },
    loadDevices() {
      let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/cooltrax_ui?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==&command=list_devices`
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
        this.devices = data.devices
      });
    }
  },
  created () {
    console.log('created')
    this.loadDevices()
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
