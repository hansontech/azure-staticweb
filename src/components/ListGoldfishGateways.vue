<template>
<div>
  <App/>
  <b-container fluid style="padding-right: 30px; padding-left: 30px; margin-top:75px; margin-left:0px; margin-right:0px"> 
    <b-row class="mt-5" align-v="center">
        <b-col align="start" sm="3" v-b-popover.hover.bottom="'Koi version and environment'">
          <h4><small>{{$store.getters.koiEnvName}} {{koiVersion}}</small> Gateways <small>({{(devices !== null) ? devices.length : 0}})</small></h4>
        </b-col>
        <b-col sm="3">
          <b-form-input class="at-border"
            type="text" 
            v-model="searchString"
            required
            placeholder="Search ..">
          </b-form-input>
        </b-col>       
        <b-col align="end">
          <!-- <b-button variant="info" v-b-toggle.collapseCreateNew >New</b-button> -->
          <b-button variant="info" class="ml-1"  @click="refresh()">Refresh</b-button>
          <!-- <b-button id="buttonUpload" class="ml-1" variant="info" v-b-toggle.collapseUploadTags>Upload</b-button> -->
        </b-col>
        <b-col>
          <b-button id="buttonCreate" class="ml-1" variant="info" v-b-popover.hover.bottom="'Create a device'" v-b-toggle.collapseCreateDevice>Create</b-button>
        </b-col>
        <b-col>
          <b-button id="buttonUpload" class="ml-1" variant="info" v-b-popover.hover.bottom="'Register Goldfish devices in CSV file'" v-b-toggle.collapseUploadDevices>Register Devices</b-button>
        </b-col>
    </b-row>
    <b-tooltip target="buttonUpload" custom-class="custom-tooltip">
      <p style="text-align:left">
        Upload CSV File with the format of:<br/>
        Serial, IMEI<br/>
        {DMT Device Serial No}, {Device's IMEI}<br/>
        .......
      </p>
    </b-tooltip>
    <b-row class="mt-2" style="border-bottom: 1px solid green;">
    </b-row>
    <b-row class = "mt-2" v-if="isLoading" align-v="center" align-h="center" > 
        <b-spinner/>
    </b-row>
       <b-collapse id="collapseCreateDevice" class="mt-2">
        <b-row class="mt-2" align-v="center">
          <b-col sm="5">
            <h5>Create a device </h5>
            <b-form-input class="at-border"
              type="text" 
              v-model="setNewDeviceData.deviceId"
              required
              placeholder="Device ID">
            </b-form-input>
          </b-col>
        </b-row>
        <b-row class="mt-2" align-v="center">
          <b-col sm="5">
            <b-form-input class="at-border"
              type="text" 
              v-model="setNewDeviceData.IMEI"
              required
              placeholder="Device IMEI">
            </b-form-input>
          </b-col>
          <b-col>
            <b-button variant="success" class="ml-1" v-b-toggle.collapseCreateDevice @click="createDevice(setNewDeviceData)">Confirm</b-button>
          </b-col>
        </b-row>
      </b-collapse>
       <b-collapse id="collapseUploadDevices" class="mt-2">
        <b-row align-v="center">
          <b-col sm="4" />
          <b-col sm="5">
              <b-form-file
                v-model="deviceFile"
                :state="Boolean(deviceFile)"
                placeholder="devices in csv ..."
                drop-placeholder="Drop file here..."
              ></b-form-file>
          </b-col>
          <b-col>
            <b-button variant="success" class="ml-1" v-b-toggle.collapseUploadDevices @click="uploadGoldfishCsvFile(deviceFile)">Confirm</b-button>
          </b-col>
        </b-row>
    </b-collapse>
    <b-collapse id="collapseDownloadFile" class="mt-2">
        <b-row align-v="center">
          <b-col>
            <a download="goldfish-devices.csv" id="downloadlink" style="display: none">Download CSV file</a>
          </b-col>
          <b-col>
            <b-button v-b-toggle.collapseDownloadFile>Close</b-button>
          </b-col>
        </b-row>
    </b-collapse>
    <b-collapse id="collapseUploadTags" class="mt-2">
        <b-row align-v="center">
          <b-col sm="4" />
          <b-col sm="5">
              <b-form-file
                v-model="tagFile"
                :state="Boolean(tagFile)"
                placeholder="tags in csv ..."
                drop-placeholder="Drop file here..."
              ></b-form-file>
          </b-col>
          <b-col>
            <b-button variant="success" class="ml-1" v-b-toggle.collapseUploadTags @click="uploadTagFile(tagFile)">Confirm</b-button>
          </b-col>
        </b-row>
    </b-collapse>
    <b-collapse id="collapseCreateNew" class="mt-2">
        <b-row align-v="center">
          <b-col sm="4">
            <b-form-input v-model="newTagName" placeholder="Tag name" type="text"></b-form-input>
          </b-col>
          <b-col sm="6">
            <b-form-input v-model="newTagAddress" placeholder="Enter Bluetooth Address e.g. 0x112233445566 or 11:22:33:44:55:66" type="text"></b-form-input>
          </b-col>
          <b-col sm="2" align="end">
            <b-button variant="success" v-b-toggle.collapseCreateNew @click="createNewTag()">Create</b-button>
            <b-button variant="secondary" class="ml-1" v-b-toggle.collapseCreateNew>Cancel</b-button>
          </b-col>
        </b-row>
    </b-collapse>
    <b-modal id="modal-set-heartbeat-period"
        hide-header 
        @ok="setHeartbeatPeriodConfirm(setHeartbeatPeriodData)"
        >
        <div>
          <h5>{{(setHeartbeatPeriodData.device !== null) ? setHeartbeatPeriodData.device.deviceId : ''}}'s heartbeat period</h5>
            <b-form-input class="at-border"
              type="number" 
              v-model="setHeartbeatPeriodData.heartbeatPeriod"
              required
              placeholder="Min = 2 min., Max = 2880">
            </b-form-input>
        </div>                  
    </b-modal>
    <b-modal id="modal-set-ble-passkey"
        hide-header 
        @ok="setBlePasskeyConfirm(setBlePasskeyData)"
        >
        <div>
          <h5>{{(setBlePasskeyData.device !== null) ? setBlePasskeyData.device.deviceId : ''}}'s new device Id</h5>
            <b-form-input class="at-border"
              type="text" 
              v-model="setBlePasskeyData.blePasskey"
              required
              placeholder="SensorTag's BLE passkey">
            </b-form-input>
        </div>                  
    </b-modal> 
    <b-modal id="modal-tag-add-setting"
        hide-header 
        @ok="addSensortagConfirm(setNewTagData)"
        >
        <div>
          <h5>{{(setNewTagData.device !== null) ? setNewTagData.device.deviceId : ''}} adds new SensorTag</h5>
            <b-form-input class="at-border"
              type="number" 
              v-model="setNewTagData.newTagName"
              required
              placeholder="SensorTag Serial Number">
            </b-form-input>
        </div>                  
    </b-modal>
    <b-row class="mt-2" >
      <b-col class="at-scroll">
        <b-list-group>
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
        <b-list-group-item>
        <b>
        <b-row class="mt-2">
                <b-col>
                  Device Id
                </b-col>
                <b-col>
                  IMEI
                </b-col>
                <b-col>
                  UMD Name
                </b-col>
                <b-col>
                  BLE Mode
                </b-col>
                <b-col lg="3">
                  SensorTags
                </b-col>
                <b-col lg="1"> 
                  Commands
                </b-col>
                <b-col lg="2" align="end">
                </b-col>
        </b-row>
        </b>
        </b-list-group-item>
        <b-list-group-item v-for="(device) in devices" :key="device.deviceId"
            header = " "
            >
            <b-row class="mt-2">
                <b-col>
                  {{(device !== null) ? device.deviceId : 'unknown'}}
                </b-col>
                <b-col>
                  {{('IMEI' in device) ? device.IMEI : ''}}
                </b-col>
                <b-col>
                  {{('umdName' in device) ? device.umdName : ''}}
                </b-col>
                <b-col>
                  {{('configuration' in device && 'bleMode' in device.configuration) ? device.configuration.bleMode : 'unknown'}}
                </b-col>
                <b-col lg="3">
                  <b-row v-if="'sensortags' in device && device.sensortags.length > 0" class="mt-2">
                    <b-col>
                      <b-list-group-item v-for="(sensortagNo, index) in device.sensortags" :key="index" header = " ">
                        <b-row>
                          <b-col>
                            {{sensortagNo}} 
                          </b-col>
                          <b-col lg="4">
                            <b-button @click="removeSensortag(device, sensortagNo)"><b-icon icon="trash-fill"></b-icon></b-button>
                          </b-col>
                        </b-row>
                      </b-list-group-item>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="1" v-b-popover.hover.bottom="'command logs'">
                  <b-button variant="info" @click="loadCommandLogs(device)">Logs</b-button>
                </b-col>
                <b-col lg="2" align="end">
                  <b-dropdown right variant="secondary">
                    <b-dropdown-item @click.stop="setHeartbeatPeriod(device)">Set Heartbeat Period</b-dropdown-item>
                    <b-dropdown-item @click.stop="addSensortag(device)">Add a SensorTag</b-dropdown-item>
                    <b-dropdown-item @click.stop="setGatewayShippingMode(device)">Set Shipping Mode</b-dropdown-item>
                    <b-dropdown-item @click.stop="toggleGatewayBleMode(device)">
                      BLE Mode to {{('configuration' in device && 'bleMode' in device.configuration && device.configuration.bleMode === 'ElaTag') ? 'SensorTag' : 'ElaTag' }}
                    </b-dropdown-item>
                    <b-dropdown-item @click.stop="deleteDevice(device)">Delete</b-dropdown-item>
                    <b-dropdown-item @click.stop="getDeviceInfo(device)">Get</b-dropdown-item>
                    <!-- <b-dropdown-item @click.stop="createSensortag(device)">Create new SensorTag</b-dropdown-item> -->
                    <!-- <b-dropdown-item @click.stop="removeSensortag(device)">Remove a SensorTag</b-dropdown-item> -->
                  </b-dropdown>
              </b-col>
            </b-row>
            <b-row v-if="'commandLogs' in device && device.commandLogs.length > 0" class="mt-2">
              <b-col>
                <b-row align-v="center" class="mt-2 pb-1 pt-1" style="border-bottom: 1px solid grey; border-top: 1px solid grey;">
                  <b-col>
                    Command logs
                  </b-col>
                  <b-col align="center">
                    <b-button variant="dark" @click="hideCommandLogs(device)">Hide</b-button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="mt-2" v-if="'commandLogs' in device">
              <b-col>
                <perfect-scrollbar>
                <b-list-group-item v-for="(commandLog) in device.commandLogs.slice().reverse()" :key="commandLog.timestamp" header = " ">
                  <b-row>
                    <b-col>
                      {{commandLog.detail.module}} 
                    </b-col>
                    <b-col>
                      {{commandLog.detail.command + (('action' in commandLog.detail) ? ('-' + commandLog.detail.action) : '')}} 
                    </b-col>
                    <b-col>
                      {{commandLog.state}} 
                    </b-col>
                   <b-col>
                      {{(new Date(commandLog.timestamp)).toISOString()}} 
                    </b-col>
                  </b-row>
                </b-list-group-item>
                </perfect-scrollbar>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
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
      newTagName: '',
      newTagAddress: '',
      deviceFile: null,
      tagFile: null,
      devices: [],
      searchString: '',
      isLoading: false,
      koiVersion: 0,
      setNewTagData: {
        device: null,
        newTagName: null
      },
      setNewDeviceData: {
        deviceId: null,
        IMEI: null
      },
      setHeartbeatPeriodData: {
        device: null,
        heartbeatPeriod: null
      },
      setBlePasskeyData: {
        device: null,
        blePasskey: null
      },
      // koiApiUrlBase: 'goldfish-inbound-app.azurewebsites.net',
      // koiApiUrlBase: 'goldfish-app-koi-service-dev.azurewebsites.net',
      // koiApiKey: 'CZw/SVXgMCUYFdaSaA1njSCN0F1a4GB5sS5Z4Nqxg6aiu3U5FNKrMQ=='
      // koiApiKey: 'FcfbmYVqZZwCFjPF5EJBtnNfdSPNkFMontUJ1kmH-Iy9AzFuOFHu-w=='
    }
  },
  watch: {
    /*
    bleModeIsSensorTag: {
      handler: function (newBleModeIsSensorTag) {
      },
      deep: true
    }
    */
  },
  computed: {
  },
  methods: {
    getKoiApi(commandAndQuery) {
      let koiEnv = this.$store.getters.koiEnv
      let url = `https://${koiEnv.koiApiUrlBase}/api/${commandAndQuery}?code=${koiEnv.koiApiKey}`
      console.log(url)
      return url
    },
    setHeartbeatPeriod(device) {
      this.setHeartbeatPeriodData.device = device
      this.$bvModal.show('modal-set-heartbeat-period')
    },
    setHeartbeatPeriodConfirm(setHeartbeatPeriodData) {
      /*
      if (  (typeof setHeartbeatPeriodData.heartbeatPeriod === 'number' &&
            setHeartbeatPeriodData.heartbeatPeriod >= 2) === false        ) {
              console.log('invalid period: ', setHeartbeatPeriodData.heartbeatPeriod)
              return
      }
      */
      this.isLoading = true
      let apiUrl = this.getKoiApi('goldfish_command')
      fetch(apiUrl,  {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          module: 'gateway',
          command: 'heartbeat',
          device: setHeartbeatPeriodData.device.deviceId,          
          period: setHeartbeatPeriodData.heartbeatPeriod
        })
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log('json data: ', jsonData)
        this.loadDevices()
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log('error: ', error)
        this.isLoading = false
      })
    },
    toggleGatewayBleMode(device) {
      let bleMode = 'SensorTag'
      if ('configuration' in device && 'bleMode' in device.configuration && device.configuration.bleMode === 'SensorTag') {
        bleMode = 'ElaTag'
      }
      this.isLoading = true
      let apiUrl = this.getKoiApi('goldfish_command')
      fetch(apiUrl,  {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=UTF-8" 
        },
        body: JSON.stringify({
          module: 'gateway',
          command: 'update',
          configuration: {
            bleMode: bleMode
          },
          device: device.deviceId
        })
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log('json data: ', jsonData)
        this.loadDevices()
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log('error: ', error)
        this.isLoading = false
      })
    },
    setGatewayShippingMode(device) {
      this.isLoading = true
      let apiUrl = this.getKoiApi('goldfish_command')
      fetch(apiUrl,  {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=UTF-8" 
        },
        body: JSON.stringify({
          module: 'gateway',
          command: 'shippingmode',
          device: device.deviceId
        })
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log('json data: ', jsonData)
        this.loadDevices()
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log('error: ', error)
        this.isLoading = false
      })
    },
    hideCommandLogs(device) {
      delete device['commandLogs']  
      this.$forceUpdate()
    },
    loadCommandLogs(device) {
      console.log('test command logs')
      this.isLoading = true
      fetch( this.getKoiApi(`list_gateway_command_logs/${device.deviceId}`),
      {
          method: "GET",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
          }
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        device.commandLogs = jsonData.commandLogs
        this.isLoading = false
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
    },
    createDevice(setNewDeviceData){
      if (setNewDeviceData.deviceId === null || setNewDeviceData.deviceId === '') {
        return
      }

      this.isLoading = true
      let apiUrl = this.getKoiApi('goldfish_command')
      fetch(apiUrl,  {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          module: 'gateway',
          command: 'create',
          device: setNewDeviceData.deviceId,
          IMEI: setNewDeviceData.IMEI
        })
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        this.loadDevices()
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
    },
    deleteDevice(device){
      this.isLoading = true
      let apiUrl = this.getKoiApi('goldfish_command')
      fetch(apiUrl,  {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          module: 'gateway',
          command: 'delete',
          device: device.deviceId
        })
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        this.loadDevices()
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
    },
    getDeviceInfo(device){
      this.isLoading = true
      let apiUrl = this.getKoiApi('goldfish_command')
      fetch(apiUrl,  {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          module: 'gateway',
          command: 'get',
          device: device.deviceId
        })
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log('device info: ', jsonData)
        this.loadDevices()
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
    },
    addSensortag(device) {
      this.setNewTagData.device = device 
      this.$bvModal.show('modal-tag-add-setting')
    },
    addSensortagConfirm(setNewTagData){
      if (setNewTagData.newTagName === '') {
        return
      }
      this.isLoading = true
      let apiUrl = this.getKoiApi('goldfish_command')
      fetch(apiUrl,  {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          module: 'sensortag',
          command: 'add',
          device: setNewTagData.device.deviceId,          
          sensortag: setNewTagData.newTagName
        })
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        if ('error' in jsonData) {
          // TODO show it to UI
          console.log('API call error:', jsonData.error )
        }
        this.loadDevices()
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
    },
    removeSensortag(device, tagName) {
      this.isLoading = true
      let apiUrl = this.getKoiApi('goldfish_command')
      fetch(apiUrl,  {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          module: 'sensortag',
          command: 'remove',
          device: device.deviceId,          
          sensortag: tagName
        })
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        this.loadDevices()
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
    },
    resetTags() {

    },
    refresh() {
      console.log('refresh')
      this.loadDevices()
    },
    uploadTagFile(tagFile) {
      console.log('upload')
      this.isLoading = true
      let reader = new window.FileReader() // if window is not used it says File READER is not defined
      let that = this
      reader.onload = async function (event) {
        let content = event.target.result
        console.log('content: ', btoa(content))
        let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/cooltrax_ui`
        const rawResponse = await fetch(apiUrl,  {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
            "x-functions-key": "JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==" 
          },
          body: JSON.stringify({
              command: 'upload_tags',
              fileData: btoa(content)
          })
        })
        const jsonData = await rawResponse.json()
        console.log(jsonData)
        that.loadDevices()
        that.isLoading = false
        that.$forceUpdate()
      }
      reader.readAsText(tagFile)
    },
    deleteTag (device) {
      this.isLoading = true
      let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/cooltrax_ui?command=delete_tag&deviceId=${device.deviceId}&groupId=ela&code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==`
      fetch(apiUrl,  {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}
      })
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
        this.loadDevices()
        this.isLoading = false
        this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      })
      
    },
    showVersion() {
      let apiUrl = this.getKoiApi('version')
      fetch(apiUrl,  {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}
      })
      .then(response => response.json())
      .then(jsonData => {
        this.koiVersion = jsonData.version
        this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
      });
    },
    loadDevices() {
      this.isLoading = true
      let withSearchString = ''
      if (this.searchString !== null || this.searchString !=='') {
        withSearchString = '/' + this.searchString
      }
      let apiUrl = this.getKoiApi(`list_devices/gfishgway${withSearchString}`)
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
        console.log('gateways:', jsonData)
        this.devices = jsonData
        this.isLoading = false
        // this.$forceUpdate()
      }).catch((error) => {
        console.log(error)
        this.isLoading = false
      });
    },
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
    uploadGoldfishCsvFile(deviceFile) {
      console.log('upload')
      this.isLoading = true
      let reader = new window.FileReader() // if window is not used it says File READER is not defined
      let that = this
      reader.onload = async function (event) {
        let content = event.target.result
        console.log('content: ', btoa(content))
        let apiUrl = that.getKoiApi('cooltrax_ui')
        const rawResponse = await fetch(apiUrl,  {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
            "x-functions-key": "JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==" 
          },
          body: JSON.stringify({
              command: 'register_goldfish_devices',
              fileData: btoa(content)
          })
        })

        console.log(rawResponse)
        const jsonData = await rawResponse.json()
        console.log(jsonData)

        var link = document.getElementById('downloadlink')
        link.href = that.makeTextFile(jsonData['csv'])
        link.style.display = 'block'
        that.$root.$emit('bv::toggle::collapse', 'collapseDownloadFile')
        that.loadDevices()
        that.isLoading = false
        that.$forceUpdate()
      }
      reader.readAsText(deviceFile)
    }
  },
  created () {
    console.log('created')
    this.showVersion()
    this.loadDevices()
  }
}
</script>
<style>

.tooltip .tooltip-inner{
  max-width: 100%
}

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
/* example */
.ps {
  max-height: 200px;
}
</style>
