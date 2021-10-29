

export default {
  async getUserInfo() {
    try {
     const response = await fetch('/.auth/me');
     const payload = await response.json();
     const { clientPrincipal } = payload;
     return clientPrincipal;
    } catch (e) {
     return 'not available'
    }
  },
  async userSignIn() {
   try {
     await fetch('/.auth/login/aad')
   } catch (e) {
     console.log(e)
   }
  },
  async userSignOut() {
   try {
    await fetch('/.auth/logout')
   } catch (e) {
    console.log(e)
   }
  }
}