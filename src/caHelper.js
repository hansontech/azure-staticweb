

export default {
  async getUserInfo() {
    try {
     const response = await fetch('/.auth/me');
     const payload = await response.json();
     const { clientPrincipal } = payload;
     return clientPrincipal;
    } catch (e) {
     return { error: 'data not available' }
    }
  },
  async userSignIn() {
   try {
     // await fetch('/.auth/login/aad')
     this.$router.push('/.auth/login/aad')
     console.log('logged in')
   } catch (e) {
     console.log(e)
   }
  },
  async userSignOut() {
   try {
    // await fetch('/.auth/logout')
    this.$router.push('/.auth/logout')
   } catch (e) {
    console.log(e)
   }
  }
}