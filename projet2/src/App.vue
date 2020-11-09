<template>
  <div id="app">
    <md-toolbar class="md-accent" md-elevation="1">
      <h3 class="md-title" style="flex: 1">Les restaurants du monde</h3>
      <router-link to="/"><md-button class="md-icon-button">
        <md-icon>home</md-icon>
      </md-button></router-link>
    </md-toolbar>
    <br>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
