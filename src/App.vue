<template>
  <div id="app" class="bd-app">
    <div class="bd-header">
      <!--<img class="bd-logo" src="./assets/favicon.png">-->
      <i class="el-icon-s-data"></i>
      <div class="bd-title " @click="handleHome">BootDo2.0可视化编程工具</div>
      <div class="bd-link">
      </div>
    </div>
    <div class="bd-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  // 全局引入 IconFont
  import "./assets/iconfont/iconfont.css"

  export default {
    name: 'app',
    methods: {
      handleHome() {
        this.$router.push({path: '/'})
      }
    }
  }
</script>

<style>
  /*default theme*/
  .bd-app {
    background-color: #E7EAED;
  }

  .bd-header {
    height: 50px;
    box-shadow: 0 2px 10px #E7EAED;
    padding: 0 20px;
    background: #ffffff;
    position: relative;
    margin: 0 0px 0px 0px;
  }

  .bd-header .bd-logo {
    height: 26px;
    vertical-align: middle;
  }

  .bd-header .bd-title {
    display: inline-block;
    line-height: 30px;
    vertical-align: middle;
    /*color: #fff;*/
    font-size: 20px;
    font-weight: 600;
    opacity: 0.8;
    margin-left: 6px;
    cursor: pointer;
    padding: 10px 0 10px 0;
  }

  .bd-header .bd-link {
    height: 50px;
    float: right;
  }

  .bd-header .bd-link a {
    /*color: #fff;*/
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

  /*dark theme*/
  .themeDark .bd-header {
    box-shadow: 0 2px 10px rgba(46, 46, 46, 0.8);
    background: #191919;
  }

  .themeDark .bd-header .bd-logo {
    height: 26px;
    vertical-align: middle;
  }

  .themeDark .bd-header .bd-title {
    display: inline-block;
    line-height: 50px;
    vertical-align: middle;
    color: #ffffff;
    font-size: 20px;
    font-weight: 600;
    margin-left: 6px;
    opacity: 1;
    cursor: pointer;
  }

  .themeDark .bd-header .bd-link {
    height: 50px;
    float: right;
    color: #fff;
  }

  .themeDark .bd-header .bd-link a {
    color: #ffffe6;
    text-decoration: none;
    font-size: 14px;
    line-height: 50px;
    font-weight: 500;
    margin-left: 15px;
  }

  .themeDark .bd-header .bd-link a:hover {
    opacity: .8;
  }

  .themeDark .bd-header .bd-link a.ad {
    color: #f5dab1;
  }

  .themeDark .bd-container {
    height: calc(100% - 50px);
    background-color: #282c34;
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

  .bd-container {
    height: calc(100% - 50px);
  }

  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 10px;
    background-color: #f9fafc;
  }

  .el-row {
    margin-bottom: 10px;
  }

  i-title {
    font-weight: bold;
  }

  .i-row {
    background-color: #fff;
    padding: 10px;
  }

  .el-main {
    padding: 10px !important;
  }

  .el-header {
    padding: 0 10px !important;
  }

  ::-webkit-scrollbar {
    width: 3px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }


</style>
