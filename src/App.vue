<template>
  <div id="app">
    <div class="bd-header">
      <img class="bd-logo" src="./assets/logo.png">
      <div class="bd-title" @click="handleHome">可视化编程工具</div>

      <div class="bd-link">

      </div>
    </div>
    <div  class="bd-container"><router-view/></div>
  </div>
</template>

<script>

  export default {
    name: 'app',
    methods: {
      handleHome () {
        this.$router.push({path: '/'})
      }
    }
  }
</script>

<style >
  .bd-header {
    height: 50px;
    box-shadow: 0 2px 10px rgba(70, 160, 252, 0.6);
    padding: 0 10px;
    background-image: linear-gradient(to right, orangered, greenyellow);
    position: relative;
  }
  .bd-header .bd-logo {
    height: 26px;
    vertical-align: middle;
  }
  .bd-header .bd-title {
    display: inline-block;
    line-height: 50px;
    vertical-align: middle;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    opacity: 0.8;
    margin-left: 6px;
    cursor: pointer;
  }
  .bd-header .bd-link {
    height: 50px;
    float: right;
  }
  .bd-header .bd-link a {
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    line-height: 50px;
    font-weight: 500;
    margin-left: 15px;
  }
  .bd-header .bd-link a:hover {
    opacity: 0.8;
  }
  .bd-header .bd-link a.ad {
    color: #f5dab1;
  }

  .bd-container {
    height: calc(100% - 50px);
  }

  *, :after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    margin: 0px;
  }

  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-height: 100%;
    height: 100%;
  }
</style>
