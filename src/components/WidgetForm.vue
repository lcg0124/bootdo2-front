<template>
  <div class="widget-form-container" style="height: 100%">
    <div v-if="data.list.length == 0" class="form-empty">从左侧拖拽来添加字段</div>
    <el-form style="height: 100%" :size="data.size" label-suffix=":" :label-position="data.labelPosition" :label-width="data.labelWidth + 'px'">
      
      <draggable class="" 
        v-model="data.list" 
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >

        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list">
            <template v-if="element.type == 'grid'">
                <el-row class="widget-col widget-view" v-if="element && element.key" :key="element.key" 
                  type="flex"
                  :class="{active: selectWidget.key == element.key}"
                  :gutter="element.options.gutter ? element.options.gutter : 0"
                  :justify="element.options.justify"
                  :align="element.options.align"
                  @click.native="handleSelectWidget(index)">
                  <el-col  v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                    
                      <draggable
                        v-model="col.list"
                        :no-transition-on-drag="true"
                        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                        @end="handleMoveEnd"
                        @add="handleWidgetColAdd($event, element, colIndex)"
                      >
                        <transition-group name="fade" tag="div" class="widget-col-list">
                          <widget-form-item 
                            v-for="(el, i) in col.list"
                            :key="el.key"
                            v-if="el.key"
                            :element="el" 
                            :select.sync="selectWidget" 
                            :index="i" 
                            :data="col">
                          </widget-form-item>
                        </transition-group>
                        
                      </draggable>
                  </el-col>
                  <div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">
        
                    <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
                  </div>

                  <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
                    <i class="iconfont icon-drag drag-widget"></i>
                  </div>
                </el-row>
            </template>
            <template v-else>
              <widget-form-item v-if="element && element.key"  :key="element.key" :element="element" :select.sync="selectWidget" :index="index" :data="data"></widget-form-item>
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'

export default {
  components: {
    Draggable,
    WidgetFormItem
  },
  props: ['data', 'select'],
  data () {
    return {
      selectWidget: this.select
    }
  },
  mounted () {
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    handleMoveEnd ({newIndex, oldIndex}) {
      console.log('index', newIndex, oldIndex)
    },
    handleSelectWidget (index) {
      console.log(index, '#####')
      this.selectWidget = this.data.list[index]
    },
    handleWidgetAdd (evt) {
      console.log('add', evt)
      console.log('end', evt)
      const newIndex = evt.newIndex
      const to = evt.to
      console.log(to)
      
      //为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: this.data.list[newIndex].type + '_' + key,
        rules: []
      })

      if (this.data.list[newIndex].type === 'radio' || this.data.list[newIndex].type === 'checkbox' || this.data.list[newIndex].type === 'select') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            options: this.data.list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        })
      }

      if (this.data.list[newIndex].type === 'grid') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          columns: this.data.list[newIndex].columns.map(item => ({...item}))
        })
      }

      this.selectWidget = this.data.list[newIndex]
    },
    handleWidgetColAdd ($event, row, colIndex) {
      console.log('coladd', $event, row, colIndex)
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {

        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex])

        row.columns[colIndex].list.splice(newIndex, 1)

        return false
      }

      console.log('from', item)

      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)

      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options,
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: row.columns[colIndex].list[newIndex].type + '_' + key,
        rules: []
      })

      if (row.columns[colIndex].list[newIndex].type === 'radio' || row.columns[colIndex].list[newIndex].type === 'checkbox' || row.columns[colIndex].list[newIndex].type === 'select') {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            options: row.columns[colIndex].list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        })
      }

      this.selectWidget = row.columns[colIndex].list[newIndex]
    },
    handleWidgetDelete (index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
      })
    },
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
  .widget-form-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .widget-form-container .widget-form-list {
    background: #fff;
    border: 1px dashed #999;
    min-height: 600px;
    margin: 10px;
  }
  .widget-form-container .widget-form-list .widget-col-list {
    min-height: 50px;
    border: 1px dashed #ccc;
    background: #fff;
  }
  .widget-form-container .widget-form-list .widget-view {
    padding-bottom: 18px;
    position: relative;
    border: 1px dashed rgba(170, 170, 170, 0.7);
    background-color: rgba(236, 245, 255, 0.3);
    margin: 2px;
  }
  .widget-form-container .widget-form-list .widget-view .el-form-item__content {
    position: unset;
  }
  .widget-form-container .widget-form-list .widget-view.is_req .el-form-item__label::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .widget-form-container .widget-form-list .widget-view .widget-view-description {
    height: 15px;
    line-height: 15px;
    font-size: 13px;
    margin-top: 6px;
    color: #909399;
  }
  .widget-form-container .widget-form-list .widget-view .widget-view-action {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 28px;
    line-height: 28px;
    background: #409EFF;
    z-index: 9;
  }
  .widget-form-container .widget-form-list .widget-view .widget-view-action i {
    font-size: 14px;
    color: #fff;
    margin: 0 5px;
    cursor: pointer;
  }
  .widget-form-container .widget-form-list .widget-view .widget-view-drag {
    position: absolute;
    left: -2px;
    top: -2px;
    bottom: -18px;
    height: 28px;
    line-height: 28px;
    background: #409EFF;
    z-index: 9;
  }
  .widget-form-container .widget-form-list .widget-view .widget-view-drag i {
    font-size: 14px;
    color: #fff;
    margin: 0 5px;
    cursor: move;
  }
  .widget-form-container .widget-form-list .widget-view:after {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
  }
  .widget-form-container .widget-form-list .widget-view:hover {
    background: #ECF5FF;
    outline: 1px solid #409EFF;
    outline-offset: 0px;
  }
  .widget-form-container .widget-form-list .widget-view:hover.active {
    outline: 2px solid #409EFF;
    border: 1px solid #409EFF;
    outline-offset: 0;
  }
  .widget-form-container .widget-form-list .widget-view:hover .widget-view-drag {
    display: block;
  }
  .widget-form-container .widget-form-list .widget-view.active {
    outline: 2px solid #409EFF;
    border: 1px solid #409EFF;
  }
  .widget-form-container .widget-form-list .widget-view.ghost {
    background: #F56C6C;
    border: 2px solid #F56C6C;
    outline-width: 0;
    height: 3px;
    box-sizing: border-box;
    font-size: 0;
    content: "";
    overflow: hidden;
    padding: 0;
  }
  .widget-form-container .widget-form-list .widget-table {
    padding-bottom: 0;
    padding: 5px;
    background-color: rgba(253, 246, 236, 0.3);
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper {
    min-height: 50px;
    background: #fff;
    display: flex;
    justify-content: flex-start;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-row td {
    border-bottom: 0;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-left {
    width: 51px;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    border-top: 1px solid #EBEEF5;
    flex: none;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view {
    border: 1px solid #EBEEF5;
    width: 200px;
    float: left;
    height: 100%;
    position: relative;
    display: block;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .el-table {
    height: 100%;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view.is_req .el-form-item__label::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-description {
    height: 15px;
    line-height: 15px;
    font-size: 13px;
    margin-top: 6px;
    color: #909399;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-action {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 28px;
    line-height: 28px;
    background: #409EFF;
    z-index: 9;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-action i {
    font-size: 14px;
    color: #fff;
    margin: 0 5px;
    cursor: pointer;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-drag {
    position: absolute;
    left: -2px;
    top: -2px;
    bottom: -18px;
    height: 28px;
    line-height: 28px;
    background: #409EFF;
    z-index: 9;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view .widget-view-drag i {
    font-size: 14px;
    color: #fff;
    margin: 0 5px;
    cursor: move;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view::after {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
    content: "";
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view::before {
    display: none;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view:hover {
    background: #ECF5FF;
    outline: 1px solid #409EFF;
    outline-offset: -1px;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view:hover.active {
    border: 1px solid #409EFF;
    outline: 1px solid #409EFF;
    outline-offset: -1px;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view:hover .widget-view-drag {
    display: block;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view.active {
    outline: 1px solid #409EFF;
    border: 1px solid #409EFF;
    outline-offset: -1px;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view.ghost {
    background: #F56C6C;
    outline-width: 0;
    width: 5px !important;
    box-sizing: border-box;
    font-size: 0;
    content: "";
    overflow: hidden;
    padding: 0;
    position: relative;
    outline: none !important;
    border: 0 !important;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-view.ghost::after {
    background: #F56C6C;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
    content: "";
    outline: none;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content {
    width: 100%;
    outline: 1px dashed #ccc;
    background: #fff;
    flex: 1;
    margin: 0 1px;
    overflow: auto;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content > div {
    height: 100%;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content .widget-table-col {
    height: 100%;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content .widget-table-col .ghost {
    background: #F56C6C;
    position: relative;
    content: "";
    float: left;
    height: 100%;
    width: 5px !important;
    list-style: none;
    font-size: 0;
    overflow: hidden;
    outline: none;
  }
  .widget-form-container .widget-form-list .widget-table .widget-table-wrapper .widget-table-content .widget-table-col .ghost::after {
    background: #F56C6C;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
    content: "";
    outline: none;
  }
  .widget-form-container .widget-form-list .widget-table.active {
    outline: 2px solid #e6a23c;
    border: 1px solid #e6a23c;
  }
  .widget-form-container .widget-form-list .widget-table:hover {
    background: #fdf6ec;
    outline: 1px solid #e6a23c;
    outline-offset: 0px;
  }
  .widget-form-container .widget-form-list .widget-table:hover.active {
    outline: 2px solid #e6a23c;
    border: 1px solid #e6a23c;
    outline-offset: 0;
  }
  .widget-form-container .widget-form-list .widget-table .widget-view-action.widget-col-action {
    background: #e6a23c;
  }
  .widget-form-container .widget-form-list .widget-table .widget-view-drag.widget-col-drag {
    background: #e6a23c;
  }
  .widget-form-container .widget-form-list .widget-table::after {
    display: none;
  }
  .widget-form-container .widget-form-list .widget-table.ghost {
    background: #F56C6C;
    outline-width: 0;
    height: 5px;
    box-sizing: border-box;
    font-size: 0;
    content: "";
    overflow: hidden;
    padding: 0;
    position: relative;
    outline: none;
    border: 0;
  }
  .widget-form-container .widget-form-list .widget-table.ghost::after {
    background: #F56C6C;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: "";
    display: block;
    z-index: 999;
  }
  .widget-form-container .widget-form-list .widget-col {
    padding-bottom: 0;
    padding: 5px;
    background-color: rgba(253, 246, 236, 0.3);
  }
  .widget-form-container .widget-form-list .widget-col.active {
    outline: 2px solid #e6a23c;
    border: 1px solid #e6a23c;
  }
  .widget-form-container .widget-form-list .widget-col:hover {
    background: #fdf6ec;
    outline: 1px solid #e6a23c;
    outline-offset: 0px;
  }
  .widget-form-container .widget-form-list .widget-col:hover.active {
    outline: 2px solid #e6a23c;
    border: 1px solid #e6a23c;
    outline-offset: 0;
  }
  .widget-form-container .widget-form-list .widget-col .el-col {
    min-height: 50px;
  }
  .widget-form-container .widget-form-list .widget-col.ghost {
    background: #F56C6C;
    border: 2px solid #F56C6C;
    outline-width: 0;
    height: 3px;
    box-sizing: border-box;
    font-size: 0;
    content: "";
    overflow: hidden;
    padding: 0;
  }
  .widget-form-container .widget-form-list .widget-col .widget-view-action.widget-col-action {
    background: #e6a23c;
  }
  .widget-form-container .widget-form-list .widget-col .widget-view-drag.widget-col-drag {
    background: #e6a23c;
  }
  .widget-form-container .widget-form-list .widget-col::after {
    display: none;
  }
  .widget-form-container .widget-form-list .ghost {
    background: #F56C6C;
    border: 2px solid #F56C6C;
    outline-width: 0;
    height: 3px;
    box-sizing: border-box;
    font-size: 0;
    content: "";
    overflow: hidden;
    padding: 0;
  }
  .widget-form-container .ghost {
    background: #F56C6C;
    border: 2px solid #F56C6C;
    position: relative;
  }
  .widget-form-container .ghost::after {
    background: #F56C6C;
  }
  .widget-form-container li.ghost {
    height: 5px;
    list-style: none;
    font-size: 0;
    overflow: hidden;
  }
  .widget-form-container .widget-grid {
    background: #F4F6FC;
    position: relative;
    border-left: 5px solid transparent;
    padding: 5px;
    margin: 0 !important;
  }
  .widget-form-container .widget-grid.active {
    border-left: 5px solid #409EFF;
    background: #b3d8ff;
  }
  .widget-form-container .widget-grid-container.ghost {
    background: #F56C6C;
    border: 2px solid #F56C6C;
    outline-width: 0;
    height: 3px;
    box-sizing: border-box;
    font-size: 0;
    content: "";
    overflow: hidden;
    padding: 0;
  }
  .widget-form-container .ghost {
    background: #F56C6C;
    border: 2px solid #F56C6C;
    position: relative;
  }
  .widget-form-container .ghost::after {
    background: #F56C6C;
  }
  .widget-form-container li.ghost {
    height: 5px;
    list-style: none;
    font-size: 0;
    overflow: hidden;
  }
  .themeDark .form-empty{
    text-align: left;
    font-size: 14px;
    line-height: 18px;
    margin: 5px 13px;
  }
</style>
