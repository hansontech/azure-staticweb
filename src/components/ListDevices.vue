<template>
<div>
  <App/>
  <b-container fluid style="padding-right: 30px; padding-left: 30px; margin-top:75px; margin-left:0px; margin-right:0px"> 
    <b-row class="mt-5" align-v="center">
      <b-col align="start" sm="4">
          <h4>CalAmp Devices <small>({{(devices !== null) ? devices.length : 0}})</small></h4>
        </b-col>
        <b-col sm="4">
          <b-form-input class="at-border"
            type="text" 
            v-model="searchString"
            required
            placeholder="Search ...">
          </b-form-input>
        </b-col>          
        <b-col align="end">
          <b-button variant="info" v-b-popover.hover.bottom="'reload the devices'" @click="refresh()">Refresh</b-button>
        </b-col>
        <b-col align="end">
          <b-button variant="info" v-b-popover.hover.bottom="'Sync with CalAmp devices in Cooltrax account'" @click="calampSync()">CalAmp Sync</b-button>
        </b-col>
    </b-row>
    <b-row class="mt-2" style="border-bottom: 1px solid green;">
    </b-row>
    <b-row class = "mt-2" v-if="isLoading" align-v="center" align-h="center" > 
        <b-spinner/>
    </b-row>
    <b-row class="mt-2" >
      <b-col class="at-scroll">
        <!-- <b-card-group deck> -->
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
        <b-modal id="modal-action-status" title="Calamp commands and responses" size="xl" ok-only>
          <div v-if="actionCommands.length > 0">
            <b-row class="font-weight-bold ml-1">
              <b-col sm="2"> <tt>Parameter ID</tt> </b-col>
              <b-col sm="1"> <tt>Index</tt> </b-col>
              <b-col > <tt>Value</tt> </b-col>
              <b-col> <tt>Updated Time</tt> </b-col>
              <b-col align="center" sm="2"> <tt>Status</tt> </b-col>
            </b-row>
            <b-row class="ml-1" v-for="(command, index) in actionCommands" :key="index">
              <b-col sm="2"> <tt>{{command.parameterId}}</tt> </b-col>
              <b-col align="center" sm="1"> <tt>{{command.parameterIndex}}</tt> </b-col>
              <b-col > <tt>{{command.parameterValue}}</tt> </b-col>
              <b-col> <tt>{{command.eventTime}}</tt> </b-col>
              <b-col align="center" sm="2"> <tt>{{command.status}}</tt> </b-col>
            </b-row>
          </div>
        </b-modal>
        <b-card class="mb-2" v-for="(device) in devices" :key="device.deviceId"
            header = " "
            >
            <b-row align-v="center">
              <b-col col="2">
                <h5 class="card-text">
                  {{device.deviceId}}
                </h5>
              </b-col>
              <b-col col="7">
                Mapped to UMD <b>{{device.umdName}}</b>
              </b-col>
              <b-col col="3" align="end">
                <b-dropdown right variant="secondary">
                  <b-dropdown-item @click.stop="resetTags(device)">Reset tags</b-dropdown-item>
                  <b-dropdown-item :href="'set_tag/' + device.deviceId">Set tags</b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
            <b-row class="mt-2" v-if="'sensors' in device && device.sensors.length > 0">
              <b-col>
               <b-row>
                <b-col>Sensors</b-col>
               </b-row>
               <b-row class="ml-1 border-bottom border-gray">
                <b-col col="4">
                  Name
                </b-col>
                <b-col col="4">
                  Tag Serial
                </b-col>
                <b-col col="4">
                  ELA Tag
                </b-col>
               </b-row>
               <b-row class="ml-1" v-for="(tag) in device.sensors" :key="tag.sensorName">
                <b-col col="4">
                  <tt>{{tag.sensorName}}</tt>
                </b-col>
                <b-col col="4">
                  <tt>{{('tagSerialNumber' in tag) ? tag.tagSerialNumber : ''}}</tt>
                </b-col>
                <b-col col="4">
                  <tt>{{('tagDeviceId' in tag) ? tag.tagDeviceId : ''}}</tt>
                </b-col>
                <!--
                <b-col>
                  <tt>{{tag.tagAddress.replace(/^(0x)/,'').toUpperCase().replace(/\B(?=([0-9A-Fa-f]{2})+(?![0-9A-Fa-f]))/g, ":")}}</tt>
                </b-col>
                --->
                <!-- into 11:22:33:44:55:66 format -->
               </b-row>
              </b-col>
            </b-row>
            <b-row class="mt-3 border" v-if="'jobs' in device && device.jobs.length > 0">
              <b-col>
               <b-row>
                <b-col>Jobs</b-col>
               </b-row>
               <b-row class="ml-1" v-for="(action, index) in device.jobs" :key="index">
                <b-col>
                  <b-row align-v="center">
                    <b-col sm="2">{{(action.actionName === 'set_tag') ? 'Set tag' : action.actionName}}</b-col>
                    <b-col><tt>{{action.sensorName}} uses {{action.tagName}}</tt></b-col>
                    <b-col><tt>{{action.actionTime}}</tt></b-col>
                    <b-col sm="2"> 
                      <b-button size="sm" variant="light" @click="showActionStatus(action, device)">Logs</b-button>
                    </b-col>
                  </b-row>
                </b-col>
               </b-row>
              </b-col>
            </b-row>
          </b-card>
        <!-- </b-card-group> -->
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
      devices: null,
      searchString: '',
      isLoading: false,
      actionCommands: []
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    showActionStatus(action, device) {
      if (('commands' in device) === false) {
        return
      }
      this.actionCommands = device.commands.filter( deviceCommand => {
        return (
          deviceCommand.actionName === action.actionName &&
          deviceCommand.actionTime === action.actionTime
        )
      })
      if (this.actionCommands.length > 0) {
        this.$bvModal.show('modal-action-status')
      }
    },
    resetTags() {

    },
    calampSync() {
      this.isLoading = true
      let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/cooltrax_ui?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==&command=sync_calamp_devices`

      fetch(apiUrl, {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        this.loadDevices()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
    },
    refresh() {
      this.loadDevices()
    },
    loadDevices() {
      this.isLoading = true
      // let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/cooltrax_ui?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==&command=list_devices&search=${this.searchString}`

      let withSearchString = ''
      if (this.searchString !== null || this.searchString !=='') {
        withSearchString = '/' + this.searchString
      }
      let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/list_devices/calamp${withSearchString}?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==`
      fetch(apiUrl,  {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}
      })
      .then(response => response.json())
      // {
        // console.log('test:', response)
        // alert(JSON.stringify(response))
      // }) //response.json())
      .then(jsonData => {
        // console.log(jsonData)
        this.devices = jsonData
        this.$store.commit('setDevices', this.devices)
        this.isLoading = false
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
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
