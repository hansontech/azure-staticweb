<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="dark" fixed="top"> <!--  class="fixed-top"> -->
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">
        <img src="./assets/cooltrax-logo.jpeg" height="40" alt="Cooltrax">
      </b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item href="/list_devices">CalAmp Devices</b-nav-item>
          <!-- <b-nav-item href="/set_tag" >Set ELA Tags</b-nav-item> -->
          <b-nav-item href="/list_tags" >ELA Tags</b-nav-item>
          <b-nav-item href="/list_goldfish_gateways" >Goldfish Gateways</b-nav-item>
          <b-nav-item href="/list_sensortags" >SensorTags</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!--
           <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>
          -->
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item v-if="isAuthenticated" @click="getUserInfo">Profile</b-dropdown-item>
            <b-dropdown-item v-if="isAuthenticated === false" href="/.auth/login/aad?post_login_redirect_uri=/loggedin">Sign In</b-dropdown-item>
            <b-dropdown-item v-if="isAuthenticated" href="/.auth/logout?post_logout_redirect_uri=/loggedout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal id="modal-userInfo" title="User Info" ok-only>
      <div>
        <b-row><b-col>  
          {{userEmail}}
        </b-col> </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>

import caHelper from './caHelper'

export default {
  name: "app",
  data() {
    return {
      value: "World",
      userInfo: {}
    }
  },
  created () {
    console.log('app created')
  },
  computed: {
    isAuthenticated: function () {
      return this.$store.getters.isAuthenticated
    },
    userEmail: function () {
      if ('userDetails' in this.userInfo) {
        return this.userInfo['userDetails']
      }
      return ''
    }
  },
  methods: {
    async getUserInfo () {
      this.userInfo = await caHelper.getUserInfo()
      this.$bvModal.show('modal-userInfo')
    }
  }
};


</script>
