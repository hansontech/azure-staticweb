<template>
<div>
  <App/>
  <b-container fluid style="padding-right: 30px; padding-left: 30px; margin-top:75px; margin-left:0px; margin-right:0px"> 
    <b-row class="mt-5" align-v="center">
        <b-col align="start" sm="3">
          <h4>CalAmp Devices <small>({{(devices !== null) ? devices.length : 0}})</small></h4>
        </b-col>
        <b-col sm="3">
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
        <b-col>
          <b-button id="buttonUpload" class="ml-1" variant="info" v-b-popover.hover.bottom="'Upload CalAmp devices in CSV file'" v-b-toggle.collapseUploadDevices>Upload Devices</b-button>
        </b-col>
    </b-row>
    <b-row class="mt-2" style="border-bottom: 1px solid green;">
    </b-row>
    <b-row class = "mt-2" v-if="isLoading" align-v="center" align-h="center" > 
        <b-spinner/>
    </b-row>
    <b-collapse id="collapseUploadDevices" class="mt-2">
        <b-row align-v="center">
          <b-col sm="4" />
          <b-col sm="5">
              <b-form-file
                v-model="tagFile"
                :state="Boolean(tagFile)"
                placeholder="devices in csv ..."
                drop-placeholder="Drop file here..."
              ></b-form-file>
          </b-col>
          <b-col>
            <b-button variant="success" class="ml-1" v-b-toggle.collapseUploadDevices @click="uploadCalampCsvFile(tagFile)">Confirm</b-button>
          </b-col>
        </b-row>
    </b-collapse>
    <b-collapse id="collapseDownloadFile" class="mt-2">
        <b-row align-v="center">
          <b-col>
            <a download="CalAmp-devices.csv" id="downloadlink" style="display: none">Download CSV file</a>
          </b-col>
          <b-col>
            <b-button v-b-toggle.collapseDownloadFile>Close</b-button>
          </b-col>
        </b-row>
    </b-collapse>
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
        <b-modal id="modal-action-read-tag-setting"
                hide-header 
                size="sm"
                @ok="readTagSettingConfirm(readTagSettingDevice, readTagSettingSensorName)"
                >
            <div>
              <h5>Read device's tag setting</h5>
              <b-form-group
                  label="Sensor(s) to read"
                  description=""
              >
                <b-form-select v-model="readTagSettingSensorName" :options="readTagSettingSensorOptions"></b-form-select>
              </b-form-group>
            </div>                  
        </b-modal>
        <b-card class="mb-2" v-for="(device) in devices" :key="device.deviceId"
            header = " "
            >
            <b-row align-v="center">
              <b-col sm="2">
                <h5 class="card-text">
                  {{device.deviceId}}
                </h5>
              </b-col>
              <b-col sm="2">
                <h6 class="card-text">
                  ESN is {{device.esn}}
                </h6>
              </b-col>
              <b-col sm="5">
                Mapped to UMD <b>{{device.umdName}}</b>
              </b-col>
              <b-col sm="3" align="end">
                <b-dropdown right variant="secondary">
                  <b-dropdown-item @click.stop="resetTags(device)">Reset tags</b-dropdown-item>
                  <b-dropdown-item :href="'set_tag/' + device.deviceId">Set tags</b-dropdown-item>
                  <b-dropdown-item @click.stop="readTagSetting(device)">Read tag setting</b-dropdown-item>
                  <b-dropdown-item @click.stop="overwriteTagSetting(device)">Overwrite tag setting</b-dropdown-item>
                  <b-dropdown-item @click.stop="rebootDevice(device)">Reboot device</b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
            <b-row class="mt-2" v-if="'sensors' in device && device.sensors.length > 0">
              <b-col>
               <b-row>
                <b-col>Sensors</b-col>
               </b-row>
               <b-row class="ml-1 border-bottom border-gray">
                <b-col v-b-popover.hover.bottom="'Sensor\'s name in CalAmp device'" sm="4">
                  Sensor Name
                </b-col>
                <b-col v-b-popover.hover.bottom="'Tag\'s Cooltrax Serial Number'" sm="4">
                  Cooltrax Serial
                </b-col>
                <b-col sm="4">
                  ELA Tag Name
                </b-col>
               </b-row>
               <b-row class="ml-1" v-for="(tag) in device.sensors" :key="tag.sensorName">
                <b-col sm="4">
                  <tt>{{tag.sensorName}}</tt>
                </b-col>
                <b-col sm="4">
                  <tt>{{('tagSerialNumber' in tag) ? tag.tagSerialNumber : ''}}</tt>
                </b-col>
                <b-col sm="4">
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
            <b-row class="mt-2" v-if="'sensors' in device && sensorTagSettingReadings(device).length > 0">
              <b-col>
                <b-row>
                  <b-col>Sensor Readings</b-col>
                </b-row>
                <b-row class="ml-1 border-bottom border-gray">
                  <b-col sm="3">
                    Sensor Name
                  </b-col>
                  <b-col sm="3">
                    BD Address OUI
                  </b-col>
                  <b-col sm="3">
                    Tag Name 1
                  </b-col>
                  <b-col sm="3">
                    Tag Name 2
                  </b-col>
                </b-row>
                <b-row class="ml-1" v-for="(tag) in sensorTagSettingReadings(device)" :key="tag.sensorName">
                  <b-col sm="3">
                    <tt>{{tag.sensorName}}</tt>
                  </b-col>
                  <b-col sm="3" v-b-popover.hover.bottom="('bdAddressOui' in tag['readTagSettings']) ? tag['readTagSettings'].bdAddressOui.readTime : ''">
                    <tt >{{('bdAddressOui' in tag['readTagSettings']) ? tag['readTagSettings'].bdAddressOui.value.toString(16).toUpperCase() : ''}}</tt>
                  </b-col>
                  <b-col sm="3" v-b-popover.hover.bottom="('tagName1' in tag['readTagSettings']) ? tag['readTagSettings'].tagName1.readTime : ''">
                    <tt>{{('tagName1' in tag['readTagSettings']) ? tag['readTagSettings'].tagName1.value : ''}}</tt>
                  </b-col>
                  <b-col sm="3" v-b-popover.hover.bottom="('tagName2' in tag['readTagSettings']) ? tag['readTagSettings'].tagName2.readTime : ''">
                    <tt>{{('tagName2' in tag['readTagSettings']) ? tag['readTagSettings'].tagName2.value : ''}}</tt>
                  </b-col>
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
                    <b-col sm="2">{{action.actionName}}</b-col>
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
      actionCommands: [],
      textFile: null,
      tagFile: null,
      readTagSettingDevice: null,
      readTagSettingSensorName: '',
      readTagSettingSensorOptions: [
          { value: '', text: 'All'},
          { value: 'temperature1', text: 'Temperature Sensor 1' },
          { value: 'temperature2', text: 'Temperature Sensor 2' },
          { value: 'door', text: 'Door Sensor' },
          { value: 'rearDoor', text: 'Rear Door Sensor' }
      ],
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    makeTextFile (text) {
      var data = new Blob([text], {type: 'text/plain'});

      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (this.textFile !== null) {
        window.URL.revokeObjectURL(this.textFile);
      }

      this.textFile = window.URL.createObjectURL(data);

      // returns a URL you can use as a href
      return this.textFile;
    },
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
    uploadCalampCsvFile(tagFile) {
      console.log('upload')
      this.isLoading = true
      let reader = new window.FileReader() // if window is not used it says File READER is not defined
      let that = this
      reader.onload = async function (event) {
        let content = event.target.result
        // console.log('content: ', btoa(content))
        let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/cooltrax_ui`
        const rawResponse = await fetch(apiUrl,  {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
            "x-functions-key": "JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==" 
          },
          body: JSON.stringify({
              command: 'upload_calamp_devices',
              fileData: btoa(content)
          })
        })
        const jsonData = await rawResponse.json()
        // console.log(jsonData)

        var link = document.getElementById('downloadlink')
        link.href = that.makeTextFile(jsonData['csv'])
        link.style.display = 'block'
        that.$root.$emit('bv::toggle::collapse', 'collapseDownloadFile')
        that.loadDevices()
        that.isLoading = false
        that.$forceUpdate()
      }
      reader.readAsText(tagFile)
    },
    sensorTagSettingReadings(device) {
      let sensorsWithReadings = device.sensors.filter(sensor => {
        return ('readTagSettings' in sensor)
      })
      return sensorsWithReadings
    },
    readTagSetting(device) {
      this.readTagSettingDevice = device
      this.$bvModal.show('modal-action-read-tag-setting')
    },
    readTagSettingConfirm(device, sensorName) {
      console.log('sensorName:', sensorName)
      this.isLoading = true
      let sensorToRead = ''
      if (sensorName !== '') {
        sensorToRead = '/' + sensorName
      }
      let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/read_tag_setting/${device.deviceId}${sensorToRead}?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==`
      console.log('url:', apiUrl)
      fetch(apiUrl, {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
    },
    overwriteTagSetting(device) {
      console.log('overwrite tag setting')
      this.isLoading = true
      let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/overwrite_device_tag_setting/${device.deviceId}?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==`
      console.log('url:', apiUrl)
      
      fetch(apiUrl, {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log('error:',error)
        this.isLoading = false
      })
    },
    rebootDevice(device) {
      this.isLoading = true
      let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/reboot_device/${device.deviceId}?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==`
      fetch(apiUrl, {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
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
