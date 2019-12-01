<template>
  <el-form-item  style="height: 100%" class="widget-view "
      v-if="element && element.key"
      :class="{active: selectWidget.key == element.key, 'is_req': element.options.required}"
      :label="element.name"
      @click.native.stop="handleSelectWidget(index)"
    >
        <template v-if="element.type == 'input'">
          <el-input
            v-model="element.options.defaultValue"
            :style="{width: element.options.width}"
            :placeholder="element.options.placeholder"
            :disabled="element.options.disabled"
          ></el-input>
        </template>

        <template v-if="element.type == 'textarea'">
          <el-input type="textarea" :rows="5"
            v-model="element.options.defaultValue"
            :style="{width: element.options.width}"
            :disabled="element.options.disabled"
            :placeholder="element.options.placeholder"
          ></el-input>
        </template>

        <template v-if="element.type == 'number'">
          <el-input-number
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :controls-position="element.options.controlsPosition"
            :style="{width: element.options.width}"
          ></el-input-number>
        </template>

        <template v-if="element.type == 'radio'">
          <el-radio-group v-model="element.options.defaultValue"
            :style="{width: element.options.width}"
            :disabled="element.options.disabled"
          >
            <el-radio
              :style="{display: element.options.inline ? 'inline-block' : 'block'}"
              :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"

            >
              {{element.options.showLabel ? item.label : item.value}}
            </el-radio>
          </el-radio-group>
        </template>

        <template v-if="element.type == 'checkbox'">
          <el-checkbox-group v-model="element.options.defaultValue"
            :style="{width: element.options.width}"
            :disabled="element.options.disabled"
          >
            <el-checkbox
              :style="{display: element.options.inline ? 'inline-block' : 'block'}"
              :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"
            >
              {{element.options.showLabel ? item.label : item.value}}
            </el-checkbox>
          </el-checkbox-group>
        </template>

        <template v-if="element.type == 'time'">
          <el-time-picker
            v-model="element.options.defaultValue"
            :is-range="element.options.isRange"
            :placeholder="element.options.placeholder"
            :start-placeholder="element.options.startPlaceholder"
            :end-placeholder="element.options.endPlaceholder"
            :readonly="element.options.readonly"
            :disabled="element.options.disabled"
            :editable="element.options.editable"
            :clearable="element.options.clearable"
            :arrowControl="element.options.arrowControl"
            :style="{width: element.options.width}"
          >
          </el-time-picker>
        </template>

        <template v-if="element.type == 'date'">
          <el-date-picker
            v-model="element.options.defaultValue"
            :type="element.options.type"
            :is-range="element.options.isRange"
            :placeholder="element.options.placeholder"
            :start-placeholder="element.options.startPlaceholder"
            :end-placeholder="element.options.endPlaceholder"
            :readonly="element.options.readonly"
            :disabled="element.options.disabled"
            :editable="element.options.editable"
            :clearable="element.options.clearable"
            :style="{width: element.options.width}"
          >
          </el-date-picker>
        </template>

        <template v-if="element.type == 'rate'">
          <el-rate v-model="element.options.defaultValue"
            :max="element.options.max"
            :disabled="element.options.disabled"
            :allow-half="element.options.allowHalf"
          ></el-rate>
        </template>

        <template v-if="element.type == 'color'">
          <el-color-picker
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :show-alpha="element.options.showAlpha"
          ></el-color-picker>
        </template>

        <template v-if="element.type == 'select'">
          <el-select
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :multiple="element.options.multiple"
            :clearable="element.options.clearable"
            :placeholder="element.options.placeholder"
            :style="{width: element.options.width}"
          >
            <el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel?item.label:item.value"></el-option>
          </el-select>
        </template>

        <template v-if="element.type=='switch'">
          <el-switch
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
          >
          </el-switch>
        </template>

        <template v-if="element.type=='slider'">
          <el-slider
            v-model="element.options.defaultValue"
            :min="element.options.min"
            :max="element.options.max"
            :disabled="element.options.disabled"
            :step="element.options.step"
            :show-input="element.options.showInput"
            :range="element.options.range"
            :style="{width: element.options.width}"
          ></el-slider>
        </template>

        <!--<template v-if="element.type=='imgupload'">-->
          <!--<fm-upload-->
            <!--v-model="element.options.defaultValue"-->
            <!--:disabled="element.options.disabled"-->
            <!--:style="{'width': element.options.width}"-->
            <!--:width="element.options.size.width"-->
            <!--:height="element.options.size.height"-->
            <!--token="xxx"-->
            <!--domain="xxx"-->
          <!--&gt;-->
            <!---->
          <!--</fm-upload>-->
        <!--</template>-->

        <template v-if="element.type == 'cascader'">
          <el-cascader
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :clearable="element.options.clearable"
            :placeholder="element.options.placeholder"
            :style="{width: element.options.width}"
            :options="element.options.remoteOptions"
          >

          </el-cascader>
        </template>

        <!--<template v-if="element.type == 'editor'">-->
          <!--<fm-editor-->
            <!--v-model="element.options.defaultValue"-->
            <!--:width="element.options.width"-->
            <!--:height="element.options.height"-->
          <!--&gt;-->

          <!--</fm-editor>-->
        <!--</template>-->

        <template v-if="element.type=='blank'">
          <div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">自定义区域</div>
        </template>

        <div class="widget-view-action" v-if="selectWidget.key == element.key">
          <i class="el-icon-document-copy"  @click.stop="handleWidgetClone(index)"></i>
          <i class="el-icon-delete" @click.stop="handleWidgetDelete(index)"></i>
        </div>

        <div class="widget-view-drag" v-if="selectWidget.key == element.key">
          <i class="fa fa fa-arrows  icon-drag drag-widget"></i>
        </div>

    </el-form-item>
</template>

<script>
// import FmUpload from './Upload'
// import FmEditor from './Editor/tinymce'
export default {
  props: ['element', 'select', 'index', 'data'],
  components: {
    // FmUpload,
    // FmEditor
  },
  data () {
    return {
      selectWidget: this.select
    }
  },
  mounted () {

  },
  methods: {
    handleSelectWidget (index) {
      this.selectWidget = this.data.list[index]
      console.log(1111,this.selectWidget.key,this.element.key)
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
    handleWidgetClone (index) {
      let cloneData = {
        ...this.data.list[index],
        options: {...this.data.list[index].options},
        key: Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      }

      if (this.data.list[index].type === 'radio' || this.data.list[index].type === 'checkbox') {

        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map(item => ({...item}))
          }
        }
      }

      this.data.list.splice(index, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
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

<css>
  .widget-view {
  padding-bottom: 18px;
  position: relative;
  border: 1px dashed rgba(170, 170, 170, 0.7);
  background-color: rgba(236, 245, 255, 0.3);
  margin: 2px;
  }
  .widget-view .el-form-item__content {
  position: unset;
  }
  .widget-view.is_req .el-form-item__label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
  }
  .widget-view .widget-view-description {
  height: 15px;
  line-height: 15px;
  font-size: 13px;
  margin-top: 6px;
  color: #909399;
  }
  .widget-view .widget-view-action {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 28px;
  line-height: 28px;
  background: #40485b;
  z-index: 9;
  }
  .widget-view .widget-view-action i {
  font-size: 14px;
  color: #fff;
  margin: 0 5px;
  cursor: pointer;
  }
  .widget-view .widget-view-drag {
  position: absolute;
  left: -2px;
  top: -2px;
  bottom: -18px;
  height: 28px;
  line-height: 28px;
  background: #40485b;
  z-index: 9;
  }
  .widget-view .widget-view-drag i {
  font-size: 14px;
  color: #fff;
  margin: 0 5px;
  cursor: move;
  }
  .widget-view:after {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: block;
  }
  .widget-view:hover {
  background: #ECF5FF;
  outline: 1px solid #40485b;
  outline-offset: 0px;
  }
  .widget-view:hover.active {
  outline: 2px solid #40485b;
  border: 1px solid #40485b;
  outline-offset: 0;
  }
  .widget-view:hover .widget-view-drag {
  display: block;
  }
  .widget-view.active {
  outline: 2px solid #40485b;
  border: 1px solid #40485b;
  }
  .widget-view.ghost {
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
</css>
