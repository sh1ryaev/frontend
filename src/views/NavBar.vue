<template>
  <MDBNavbar expand="lg" position="top" light  style="background-color: #e3f2fd" container>
    <!-- Toggle button -->
    <MDBNavbarToggler
      target="#navbarCenterAlignExample"
      @click="collapse1 = !collapse1"
    ></MDBNavbarToggler>
    <!-- Collapsible wrapper -->
    <MDBCollapse id="navbarCenterAlignExample" v-model="collapse1">
      <MDBNavbarNav center class="mb-4 mb-lg-0">
        <!-- Center links -->
        <MDBNavbarBrand href="/">
      <img
        src="https://mdbootstrap.com/img/logo/mdb-transaprent-noshadows.webp"
        height="30"
        alt=""
        loading="lazy"
      />
    </MDBNavbarBrand>
                <MDBNavbarItem>
            <router-link class="nav-link" to="/sign-up">Регистрация</router-link>
        </MDBNavbarItem>
        <MDBNavbarItem v-if="this.$store.state.isAuth">
            <router-link class="nav-link" to="/profile">Профиль</router-link>
        </MDBNavbarItem>
        <MDBNavbarItem v-if="this.$store.state.isAuth" href="#" active>
           <a class="nav-link" id="logout-button" @click.prevent="handleLogout">Выйти</a>
        </MDBNavbarItem>
        <MDBNavbarItem v-else href="#" active>
          <router-link to="/log-in">Войти</router-link>
        </MDBNavbarItem>
        <!-- Center links -->
      </MDBNavbarNav>
    </MDBCollapse>
    <!-- Collapsible wrapper -->
  </MDBNavbar>
</template>

<script>
import {
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
  } from 'mdb-vue-ui-kit';
  import { ref } from 'vue';
  export default {
    name: "NavBar",
    components: {
      MDBNavbar,
      MDBNavbarToggler,
      MDBNavbarBrand,
      MDBNavbarNav,
      MDBNavbarItem,
      MDBCollapse,
    },
    setup() {
      const collapse1 = ref(false);
      const dropdown1 = ref(false);
      return {
        collapse1,
        dropdown1
      }
    },
      methods: {
      handleLogout() {
          localStorage.removeItem('token')
          this.$store.commit('removeToken')
        window.location.assign('/')
      },
    },
  };
</script>

<style scoped>
  a{
    color: #2c3e50;

  }
a.router-link-active, li.router-link-active>a {
  color: red;
}
</style>