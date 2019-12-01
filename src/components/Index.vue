<template>
  <el-container style="height: 100%">
    <el-main >
      <el-container style="height:100%">
        <el-aside width="230px">
          <el-menu :default-openeds="defaultOpeneds" background-color="#F8F9FA">
            <el-submenu index="00001">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>布局</span>
              </template>
              <Draggable tag="ul" :list="layoutComponents" class="vp-widgetList"
                         v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">
                <el-menu-item v-for="(item, index) in layoutComponents" :key="index" style="cursor: move">
                  <i class="icon iconfont" :class="item.icon"></i>
                  <span>{{item.name}}</span>
                </el-menu-item>
              </Draggable>
            </el-submenu>
            <el-submenu index="00002">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>FORM表单</span>
              </template>
              <Draggable tag="ul" :list="basicComponents" class="vp-widgetList"
                         v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}">
                <el-menu-item v-for="(item, index) in basicComponents" :key="index" style="cursor: move">
                  <i class="icon iconfont" :class="item.icon"></i>
                  <span>{{item.name}}</span>
                </el-menu-item>
              </Draggable>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-container>
          <el-header>
            <div class="i-row" style="text-align: right">
              <!--<el-button type="text" size="medium" icon="el-icon-back" style="text-align: left" @click="goList"-->
              <!--disabled="disabled">返回对象列表-->
              <!--</el-button>-->
              <!--<el-button type="text" size="medium" icon="el-icon-document" @click="saveForm" disabled="disabled">保存-->
              <!--</el-button>-->
              <el-button type="text" size="medium" icon="el-icon-delete">清空</el-button>
              <el-button type="text" size="medium" icon="el-icon-view" @click="createPreview">预览</el-button>
              <el-button type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateBean">后端代码</el-button>
              <el-button type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">前端代码</el-button>
            </div>
          </el-header>
          <el-main>
            <el-container style="height: 100%">
              <el-main :class="{'widget-empty': widgetForm.list.length == 0}" style=" position: relative;height: 100%;background: #fff">

                <widget-form v-if="!resetJson" ref="widgetForm" :data="widgetForm"
                             :select.sync="widgetFormSelect"></widget-form>
              </el-main>
              <el-aside width="280px">
                <div class="i-row" style="height: 100%; margin-left: 10px">
                  <el-tabs v-model="activeName">
                    <el-tab-pane label="字段属性" name="first">
                      <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"></widget-config>
                    </el-tab-pane>
                    <el-tab-pane label="对象属性" name="second">
                      <form-config :data="widgetForm"></form-config>

                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-aside>
            </el-container>
          </el-main>
        </el-container>
      </el-container>
      <el-drawer style="margin-left: 5px"
                 title="前端代码"
                 :visible.sync="drawer" size="80%"
                 :direction="direction">
        <div id="codeeditor" style="height: 100%; width: 100%;">
          <!--<textarea style="width: 100%;height: 100%">{{htmlTemplate}}</textarea>-->
          <code-edit :code="htmlTemplate" imime="vue"></code-edit>
        </div>

      </el-drawer>

      <!--后端代码-->
      <el-drawer
        title="后端代码"
        :visible.sync="dialogVisible"
        size="80%"
        :before-close="handleClose">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-left: 5px" :stretch=false>
          <el-tab-pane label="Bean" name="first" :lazy=true>
            <!--<CodeEdit :mycode="bean"></CodeEdit>-->
            <code-edit :code="backEndData.domain" imime="text/x-java"></code-edit>
          </el-tab-pane>
          <el-tab-pane label="Mapper.xml" name="second" :lazy=true>
            <!--<textarea style="width: 100%;min-height: 320px">{{mapper}}</textarea>-->
            <code-edit :code="backEndData.Mapper" imime="xml"></code-edit>
          </el-tab-pane>
          <el-tab-pane label="Controller" name="third" :lazy=true>
            <code-edit :code="backEndData.Controller" imime="text/x-java"></code-edit>
          </el-tab-pane>
          <el-tab-pane label="Service" name="fourth" :lazy=true>
            <code-edit :code="backEndData.Service" imime="text/x-java"></code-edit>
          </el-tab-pane>
          <el-tab-pane label="ServiceImpl" name="5th" :lazy=true>
            <code-edit :code="backEndData.ServiceImpl" imime="text/x-java"></code-edit>
          </el-tab-pane>
          <el-tab-pane label="Dao" name="6th" :lazy=true>
            <code-edit :code="backEndData.Dao" imime="text/x-java"></code-edit>
          </el-tab-pane>
          <el-tab-pane label="sql" name="7th" :lazy=true>
            <code-edit :code="backEndData.menu" imime="sql"></code-edit>
          </el-tab-pane>
        </el-tabs>
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
        <!--</span>-->
      </el-drawer>
      <cus-dialog
        :visible="previewVisible"
        @on-close="previewVisible = false"
        ref="widgetPreview"
        width="1000px"
        form
      >
        <generate-form insite="true" @on-change="handleDataChange" v-if="previewVisible" :data="widgetForm"
                       :value="widgetModels" :remote="remoteFuncs" ref="generateForm">

          <template v-slot:blank="scope">
            宽度：
            <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
            高度：
            <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
          </template>
        </generate-form>

        <template slot="action">
          <el-button type="primary" @click="handleTest">获取数据</el-button>
          <el-button @click="handleReset">重置</el-button>
        </template>
      </cus-dialog>

      <el-dialog :visible.sync="backEndVisible" title="后端代码">
        <el-form :model="widgetForm" :rules="rules" ref="widgetForm" label-width="100px" :inline=true>
          <el-row>
            <el-form-item label="包路径" prop="packagePath">
              <el-input v-model="widgetForm.packagePath" placeholder="com.bootdo"></el-input>
            </el-form-item>
            <el-form-item label="对象名称" prop="name">
              <el-input v-model="widgetForm.name" placeholder="demo"></el-input>
            </el-form-item>
          </el-row>
          <el-row>

          </el-row>
          <el-row>
            <el-form-item label="对象注释" prop="note">
              <el-input v-model="widgetForm.note" placeholder="这是一个demo"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input v-model="widgetForm.author" placeholder="lichunguang"></el-input>
            </el-form-item>
          </el-row>
          <el-row>

            <el-form-item label="持久层" prop="persistence">
              <el-select v-model="widgetForm.persistence">
                <el-option v-for="item in persistences">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="使用lombok" prop="lombok">
              <el-checkbox v-model="widgetForm.useLombok"></el-checkbox>
            </el-form-item>
            <el-form-item label="添加swagger" prop="swagger">
              <el-checkbox v-model="widgetForm.swagger"></el-checkbox>
            </el-form-item>

          </el-row>
          <el-row>
            <el-form-item label="数据库" prop="db">
              <el-select v-model="widgetForm.db">
                <el-option v-for="item in dbs">{{item}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="DB表前缀" prop="tablePrefix">
              <el-input v-model="widgetForm.tablePrefix">
              </el-input>
            </el-form-item>
            <el-form-item label="DB主键" prop="pk">
              <el-input v-model="widgetForm.pk">
              </el-input>
            </el-form-item>
            <el-form-item label="主键类型" prop="pkType">
              <el-input v-model="widgetForm.pkType">
              </el-input>
            </el-form-item>

          </el-row>

          <el-form-item>
            <el-button type="primary" @click="doGenerate">生成代码</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

    </el-main>
    <!--<el-footer class="bd-footer" height="30px">Powered by <a target="_blank" href="http://bootdo.com">bootdo.com</a>-->
    <!--</el-footer>-->
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
        defaultOpeneds: ['00001','00002'],
        dbs: ['mysql', 'oracle'],
        persistences: ['mybatis', 'jpa'],
        rules: {
          name: [
            {required: true, message: '请输入对象名称', trigger: 'blur'},
          ],
          packagePath: [
            {required: true, message: '请输入包路径', trigger: 'blur'},
          ]
        },
        backEndVisible: false,
        widgetModels: {},
        previewVisible: false,
        activeName: 'first',
        bean: 'bean',
        backEndData: {},
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
          packagePath: '',
          lombok: true,
          swagger: true,
          author: '',
          db: 'mysql',
          persistence: 'mybatis',
          tablePrefix: 't_',
          useLombok: true,
          pk: 'id',
          pkType: 'varchar'
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
        if (this.widgetForm.list.length < 1) {
          this.$message('表单没有元素哦')
          return
        }
        let that = this
        this.backEndVisible = true

      },
      doGenerate() {
        let that = this
        this.$refs['widgetForm'].validate((valid) => {
          if (valid) {
            ApiGenerator.addUser(that.widgetForm).then(function (res) {
              that.backEndData = res
              that.dialogVisible = true
            })
          } else {
            return false
          }
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
        if (id) {
          ApiForm.get(id).then(function (res) {
            that.widgetForm = res
            that.widgetForm.list = []
          })
        }

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

  /*.widget-empty{*/
    /*background: url('../assets/back.jpg') no-repeat !important;*/
    /*background-position: 50%;*/
  /*}*/

  /*.el-submenu .el-menu-item {*/
  /*height: 35px;*/
  /*line-height: 35px;*/
  /*padding: 0 45px;*/
  /*!*min-width: 200px;*!*/
  /*}*/

  /*.el-menu-item, .el-submenu__title {*/
  /*height: 35px;*/
  /*line-height: 35px;*/
  /*position: relative;*/
  /*-webkit-box-sizing: border-box;*/
  /*white-space: nowrap;*/
  /*list-style: none;*/
  /*}*/
</style>


