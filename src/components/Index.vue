<template>
  <el-container style="height: 100%">
    <el-main style="position: relative;">
      <el-container style="height: 100%">
        <el-aside width="200px">
          <div>
            <Draggable tag="ul" :list="basicComponents" style="padding-inline-start: 0px;"
                       v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">
              <li class="form-edit-widget-label" v-for="(item, index) in basicComponents" :key="index">
                <a>
                  <i class="icon iconfont" :class="item.icon"></i>
                  <span>{{item.name}}</span>
                </a>
              </li>
            </Draggable>
          </div>
        </el-aside>
        <el-main :class="{'widget-empty': widgetForm.list.length == 0}">

          <el-container
            style=" border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; height: 100% !important;">
            <el-header class="btn-bar" style="height: 45px;">
              <slot name="action">
              </slot>
              <el-button type="text" size="medium" icon="el-icon-upload2">导入JSON</el-button>
              <el-button type="text" size="medium" icon="el-icon-delete">清空</el-button>
              <el-button type="text" size="medium" icon="el-icon-view">预览</el-button>
              <el-button type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateBean">后端代码</el-button>
              <el-button type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">前端代码</el-button>
            </el-header>
            <el-main style=" padding: 0;
    position: relative;
    background: #fafafa; height: 100%">
              <widget-form v-if="!resetJson" ref="widgetForm" :data="widgetForm"
                           :select.sync="widgetFormSelect" style="height: 100%"></widget-form>
            </el-main>

          </el-container>

        </el-main>

        <el-aside width="200px">
          <el-form>
            <el-form-item label="测试一">
              <el-input></el-input>
            </el-form-item>
          </el-form>
        </el-aside>
      </el-container>
      <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :direction="direction">
        <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div>

      </el-drawer>
    </el-main>
    <el-footer class="bd-footer" height="30px">Powered by <a target="_blank" href="http://bootdo.com">bootdo.com</a>
    </el-footer>
  </el-container>
</template>

<script>
  import {basicComponents, layoutComponents, advanceComponents} from './componentsConfig.js';
  import Draggable from 'vuedraggable';
  import WidgetForm from './WidgetForm'
  import generateCode from './generateCode.js'
  import ApiGenerator from '../api/api_generator'

  export default {
    name: 'HelloWorld',
    components: {
      Draggable,
      WidgetForm
    },
    props: {},
    data() {
      return {
        htmlTemplate: '',
        drawer: false,
        direction: 'rtl',
        basicComponents,
        layoutComponents,
        advanceComponents,
        list: [1, 2, 34, 4, 54, 5],
        forms: [
          {name: '文本框'},
          {name: '单选框'}
        ],
        resetJson: false,
        widgetForm: {
          list: [],
          config: {
            labelWidth: 100,
            labelPosition: 'right',
            size: 'small'
          },
        },
        widgetFormSelect: null,
      }
    },
    updated() {
      console.log(this.list)
    },
    methods: {
      handleGenerateCode() {
        this.codeVisible = true
        this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm))
        this.$nextTick(() => {
          const editor = ace.edit('codeeditor')
          editor.session.setMode("ace/mode/html")
        })
        this.drawer = true
      },
      handleGenerateBean() {
        ApiGenerator.addUser(this.widgetForm.list)
      }
    }
  }
</script>
<style>
  .bd-footer {
    height: 30px;
    line-height: 30px;
    border-top: 1px solid #e0e0e0;
    font-size: 12px;
    text-align: center;
    color: cornflowerblue;
    background: #fafafa;
    font-weight: 600;
  }

  .form-edit-widget-label {
    font-size: 12px;
    display: block;
    width: 48%;
    line-height: 26px;
    position: relative;
    float: left;
    left: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 1%;
    color: #333;
    border: 1px solid #F4F6FC;
  }

  .form-edit-widget-label:hover {
    color: #409EFF;
    border: 1px dashed #409EFF;
  }

  .form-edit-widget-label > a {
    display: block;
    cursor: move;
    background: #F4F6FC;
    border: 1px solid #F4F6FC;
  }

  .form-edit-widget-label > a .icon {
    margin-right: 6px;
    margin-left: 8px;
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
  }

  .form-edit-widget-label > a span {
    display: inline-block;
    vertical-align: middle;
  }

  .btn-bar {
    height: 45px;
    line-height: 45px;
    font-size: 18px;
    border-bottom: solid 2px #e4e7ed;
    text-align: right;
  }
</style>


