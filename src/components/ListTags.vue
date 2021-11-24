<template>
<div>
  <App/>
  <b-container fluid style="padding-right: 30px; padding-left: 30px; margin-top:75px; margin-left:0px; margin-right:0px"> 
    <b-row class="mt-5" align-v="center">
      <b-col align="start" sm="4">
          <h4>ELA Tags <small>({{(devices !== null) ? devices.length : 0}})</small></h4>
        </b-col>
        <b-col sm="4">
          <b-form-input class="at-border"
            type="text" 
            v-model="searchString"
            required
            placeholder="Search ..">
          </b-form-input>
        </b-col>       
        <b-col align="end">
          <b-button variant="info" v-b-toggle.collapseCreateNew >New</b-button>
          <b-button variant="info" class="ml-1"  @click="refresh()">Refresh</b-button>
          <b-button id="buttonUpload" class="ml-1" variant="info" v-b-toggle.collapseUploadTags>Upload</b-button>
        </b-col>
    </b-row>
    <b-tooltip target="buttonUpload" custom-class="custom-tooltip">
      <p style="text-align:left">
        Upload CSV File with format of:<br/>
        {ELA Tag Name},{Bluetooth Address}<br/>
        For example, <br/>
        <tt>
        PTX51234,0x112233445566 <br/>
        PTX51235,0x112233778899
        </tt>
        </p>
    </b-tooltip>
    <b-row class="mt-2" style="border-bottom: 1px solid green;">
    </b-row>
    <b-row class = "mt-2" v-if="isLoading" align-v="center" align-h="center" > 
        <b-spinner/>
    </b-row>
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
        <b-list-group-item v-for="(device) in devices" :key="device.deviceId"
            header = " "
            >
            <b-row class="mt-2">
                <b-col>
                  {{device.deviceId}}
                </b-col>
                <b-col>
                  <tt>{{device.bdAddr.replace(/^(0x)/,'').toUpperCase().replace(/\B(?=([0-9A-Fa-f]{2})+(?![0-9A-Fa-f]))/g, ":")}}</tt>
                </b-col>
                <!-- into 11:22:33:44:55:66 format -->
                <b-col lg="2" align="end">
                  <b-dropdown right variant="secondary">
                    <b-dropdown-item @click.stop="deleteTag(device)">Delete</b-dropdown-item>
                  </b-dropdown>
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
      tagFile: null,
      devices: null,
      searchString: '',
      isLoading: false
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    createNewTag(){
      if ((this.newTagName !== '' && this.newTagAddress !== '') == false) {
        return
      }
      let tagAddress = this.newTagAddress
      if (this.newTagAddress.indexOf(':') > -1) {
        tagAddress = '0x' + this.newTagAddress.replace(/:/g, '')
      }
      this.isLoading = true
      let apiUrl = 'https://calamp-inbound-app.azurewebsites.net/api/cooltrax_ui'
      fetch(apiUrl,  {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          "x-functions-key": "JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==" 
        },
        body: JSON.stringify({
          command: 'create_tag',
          tag: {
            groupId: 'ela',
            deviceId: this.newTagName, 
            bdAddr: tagAddress
          }
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
    loadDevices() {
      this.isLoading = true
      // let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/cooltrax_ui?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==&command=list_devices&search=${this.searchString}`

      let withSearchString = ''
      if (this.searchString !== null || this.searchString !=='') {
        withSearchString = '/' + this.searchString
      }
      let apiUrl = `https://calamp-inbound-app.azurewebsites.net/api/list_devices/ela${withSearchString}?code=JG3kCdiic674IbKBTKcybVYJRaW1an5Cz4ZrZWAIwzQAsarMne8uPg==`
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
        console.log(jsonData)
        this.devices = jsonData
        this.isLoading = false
        // this.$forceUpdate()
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

</style>
