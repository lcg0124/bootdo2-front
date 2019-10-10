<template>
  <div class="form-config-container">
    <el-form label-position="left" size="mini">

      <el-collapse v-model="activeNames" @change="handleChange" >
        <el-collapse-item title="前端属性" name="1">
          <template slot="title">

          </template>
          <el-form-item label="标签对齐方式">
            <el-radio-group v-model="data.labelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
              <el-radio-button label="top">顶部对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="表单字段宽度">
            <el-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"></el-input-number>
          </el-form-item>

          <el-form-item label="组件尺寸">
            <el-radio-group v-model="data.size">
              <el-radio-button label="medium">medium</el-radio-button>
              <el-radio-button label="small">small</el-radio-button>
              <el-radio-button label="mini">mini</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="后端属性" name="2">

          <el-form-item label="包路径">
            <el-input v-model="data.packagePath"></el-input>
          </el-form-item>

          <el-form-item label="对象名称">
            <el-input v-model="data.name"></el-input>
          </el-form-item>

          <el-form-item label="对象注释">
            <el-input v-model="data.note"></el-input>
          </el-form-item>
        </el-collapse-item>

      </el-collapse>


    </el-form>
  </div>
</template>

<script>
  export default {
    props: ['data']
  }
</script>
