<template>
  <el-container style="height: 100%">
    <el-main style="position: relative; padding-top:0px">
      <el-header class="btn-bar" style="height: 40px;">
        <el-row>
          <el-button type="text" size="medium" icon="el-icon-back" style="text-align: left" @click="goList">返回对象列表
          </el-button>
          <el-button type="info" size="mini" icon="el-icon-document" @click="saveForm">保存</el-button>
          <el-button type="text" size="medium" icon="el-icon-delete">清空</el-button>
          <el-button type="text" size="medium" icon="el-icon-view" @click="createPreview">预览</el-button>
          <el-button type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateBean">后端代码</el-button>
          <el-button type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">前端代码</el-button>
        </el-row>
      </el-header>
      <el-container style="height: calc(100% - 40px)">
        <el-aside width="200px">
          <el-menu background-color="#545c64"
                   text-color="#fff"
                   active-text-color="#ffd04b">
            <el-submenu>
              <template slot="title">
                表单
              </template>
              <Draggable tag="ul" :list="basicComponents" class="vp-widgetList"
                         v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">
                <el-menu-item v-for="(item, index) in basicComponents" :key="index">{{item.name}}</el-menu-item>
              </Draggable>
            </el-submenu>
          </el-menu>
          <!--<el-collapse accordion>-->
          <!--<el-collapse-item>-->
          <!--<template slot="title">-->
          <!--<div class="vp-widgetTitle">基础表单容器</div>-->
          <!--</template>-->
          <!--<Draggable tag="ul" :list="basicComponents" class="vp-widgetList"-->
          <!--v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">-->
          <!--<li class="form-edit-widget-label" v-for="(item, index) in basicComponents" :key="index">-->
          <!--<a>-->
          <!--<i class="icon iconfont" :class="item.icon"></i>-->
          <!--<span>{{item.name}}</span>-->
          <!--</a>-->
          <!--</li>-->
          <!--</Draggable>-->
          <!--</el-collapse-item>-->
          <!--</el-collapse>-->
        </el-aside>
        <el-main :class="{'widget-empty': widgetForm.list.length == 0}">

          <el-container
            style=" border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; height: 100% !important;">

            <el-main style=" padding: 0;
    position: relative;
    background: #fafafa; height: 100%">
              <widget-form v-if="!resetJson" ref="widgetForm" :data="widgetForm"
                           :select.sync="widgetFormSelect" style="height: 100%"></widget-form>
            </el-main>

          </el-container>

        </el-main>

        <el-aside width="280px">
          <el-container>
            <el-tabs v-model="activeName" style="width: 100%">
              <el-tab-pane label="字段属性" name="first">
                <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"></widget-config>
              </el-tab-pane>
              <el-tab-pane label="表单属性" name="second">
                <form-config :data="widgetForm"></form-config>
              </el-tab-pane>
            </el-tabs>
          </el-container>
        </el-aside>
      </el-container>
      <el-drawer
        title="前端代码"
        :visible.sync="drawer" size="80%"
        :direction="direction">
        <div id="codeeditor" style="height: 100%; width: 100%;">
          <!--<textarea style="width: 100%;height: 100%">{{htmlTemplate}}</textarea>-->
          <code-edit :code="htmlTemplate"></code-edit>
        </div>

      </el-drawer>

      <!--后端代码-->
      <el-dialog
        title="后端代码"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="bean" name="first">
            <!--<CodeEdit :mycode="bean"></CodeEdit>-->
            <textarea style="width: 100%;min-height: 320px">{{bean}}</textarea>
          </el-tab-pane>
          <el-tab-pane label="mapper.xml" name="second">
            <textarea style="width: 100%;min-height: 320px">{{mapper}}</textarea>
          </el-tab-pane>
          <el-tab-pane label="controller" name="third">
            <textarea style="width: 100%;min-height: 320px">{{controller}}</textarea>
          </el-tab-pane>
          <el-tab-pane label="service" name="fourth">{{service}}</el-tab-pane>
        </el-tabs>
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
        <!--</span>-->
      </el-dialog>
      <cus-dialog
        :visible="previewVisible"
        @on-close="previewVisible = false"
        ref="widgetPreview"
        width="1000px"
        form
      >
        <generate-form insite="true" @on-change="handleDataChange" v-if="previewVisible" :data="widgetForm" :value="widgetModels" :remote="remoteFuncs" ref="generateForm">

          <template v-slot:blank="scope">
            宽度：<el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
            高度：<el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
          </template>
        </generate-form>

        <template slot="action">
          <el-button type="primary" @click="handleTest">获取数据</el-button>
          <el-button @click="handleReset">重置</el-button>
        </template>
      </cus-dialog>

      <el-dialog>

      </el-dialog>

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
  import ApiForm from '../api/api_form'
  import WidgetConfig from './WidgetConfig'
  import FormConfig from './FormConfig'
  import CodeEdit from './CodeEdit'
  import CusDialog from './CusDialog'
  import GenerateForm from './GenerateForm'

  export default {
    name: 'HelloWorld',
    components: {
      Draggable,
      WidgetForm,
      WidgetConfig,
      FormConfig,
      CodeEdit,
      CusDialog,
      GenerateForm
    },
    props: {},
    data() {
      return {
        widgetModels: {},
        previewVisible: false,
        activeName: 'first',
        bean: 'bean',
        mapper: '',
        service: '',
        controller: '',
        configTab: 'widget',
        widgetFormSelect: null,
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
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          name: '',
          packagePath: ''
        },
        widgetFormSelect: null,
        dialogVisible: false
      }
    },
    updated() {
      console.log(this.list)
    },
    methods: {
      goList() {
        this.$router.push({path: '/list'})
      },
      handleGenerateCode() {
        // this.codeVisible = true
        this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm))
        // this.$nextTick(() => {
        //   const editor = ace.edit('codeeditor')
        //   editor.session.setMode("ace/mode/html")
        // })
        this.drawer = true
      },
      handleGenerateBean() {
        let that = this
        if (!this.widgetForm.name) {
          this.$message('请先设置兑现名称');
          return
        }
        if (!this.widgetForm.packagePath) {
          this.$message('请先设置包路径');
          return
        }
        ApiGenerator.addUser(this.widgetForm).then(function (res) {
          that.bean = res.domain
          that.mapper = res.Mapper
          that.controller = res.Controller
          that.dialogVisible = true
        })
      },
      handleConfigSelect(value) {
        this.configTab = value
      },
      saveForm() {
        let that = this
        ApiForm.saveForm(that.widgetForm).then(function (res) {

        })
      },
      get() {
        let id = this.$route.query.id
        let that = this
        ApiForm.get(id).then(function (res) {
          that.widgetForm = res
          that.widgetForm.list = []
        })
      },
      createPreview() {
        this.previewVisible = true
      }
    },
    mounted() {
      this.get()
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
    color: #40485b;
    border: 1px dashed #40485b;
  }

  .form-edit-widget-label > a {
    display: block;
    cursor: move;
    background: #F4F6FC;
    border: 1px solid #F4F6FC;
  }

  .form-edit-widget-label > a .icon {
    margin-right: 3px;
    margin-left: 6px;
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

  .vp-widgetTitle {
    padding: 8px 12px;
    font-family: FZLTZHK--GBK1-0;
    font-size: 14px;
    color: #66696D;
    letter-spacing: 0;
    line-height: 14px;
    font-weight: bold
  }

  .vp-widgetList {
    padding-inline-start: 0px;
    margin: 5px auto;
  }

  /*Dark theme*/
  .themeDark .bd-footer {
    height: 30px;
    line-height: 30px;
    border-top: 1px solid #e0e0e0;
    font-size: 12px;
    text-align: center;
    color: cornflowerblue;
    background: #fafafa;
    font-weight: 600;
  }

  .themeDark .form-edit-widget-label {
    border: 1px solid transparent;
  }

  .themeDark .form-edit-widget-label:hover {
    color: #40485b;
    border: 1px dashed #40485b;
  }

  .themeDark .form-edit-widget-label > a {
    background: #33383E;
    border: 1px solid #33383E;
    color: #ffffe6 !important;

  }

  .themeDark .form-edit-widget-label > a span {
    display: inline-block;
    vertical-align: middle;
  }

  .themeDark .btn-bar {
    height: 45px;
    line-height: 45px;
    font-size: 18px;
    border-bottom: solid 2px #e4e7ed;
    text-align: right;
  }

  .themeDark .el-tabs {
    width: 100%;
  }

  .themeDark .el-tabs__item {
    width: 120px;
    text-align: center;
    color: #ffffe6;
  }

  .themeDark .el-tabs__item.is-active {
  }

  .themeDark .el-button--text {
    color: #ffffe6;
  }

  .themeDark .vp-widgetTitle {
    color: #ffffe6;
  }
</style>


