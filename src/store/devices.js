
export default {
  state: {
    deviceGroups: null,
    devices: null
  },
  getters: {
    devices: state => state.devices,
    deviceGroups: state => {
      if (state.deviceGroups === undefined) {
        state.deviceGroups = null
      }
      return state.deviceGroups
    }
  },
  mutations: {
    setDevices: (state, devices) => {
      state.devices = devices
    },
    setDeviceGroups: (state, deviceGroups) => {
      state.deviceGroups = deviceGroups
    }
  },
  actions: {
    resetLoadedDevicesCaches: function (context) {
      context.commit('setDevices', null)
      context.commit('setDeviceGroups', null)
    },
    replaceDevice: function (context, newDevice) {
      let devices = context.getters.devices
      const newList = devices.map(th => {
        if (th.DeviceId !== newDevice.DeviceId) {
          return th
        } else {
          const modifiedDevice = Object.assign({}, newDevice)
          return modifiedDevice
        }
      })
      devices = newList
      context.commit('setDevices', devices)
    },
    replaceDeviceGroup: function (context, newDeviceGroup) {
      let deviceGroups = context.getters.deviceGroups
      const newList = deviceGroups.map(th => {
        if (th.DeviceGroupName !== newDeviceGroup.DeviceGroupName) {
          return th
        } else {
          const modifiedDeviceGroup = Object.assign({}, newDeviceGroup)
          return modifiedDeviceGroup
        }
      })
      deviceGroups = newList
      context.commit('setDeviceGroups', deviceGroups)
    }
  }
}
