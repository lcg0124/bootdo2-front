<template>
  <el-container>
    <el-main>
      <el-row class="row-bg">
        对象列表
      </el-row>
      <el-row class="row-bg">
        <el-col :span="6">
          <el-input size="small" v-model="input" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button size="small">新增</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="对象名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="packagePath"
            label="包路径"
            width="180">
          </el-table-column>
          <el-table-column
            prop="notes"
            label="说明">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import ApiForm from '../api/api_form'

  export default {
    data() {
      return {
        tableData: []
      }
    },

    methods: {
      list: function () {
        let params = {}
        params.key = ''
        let that = this
        ApiForm.list(params).then(function (res) {
          that.tableData = res
        })
      },
      handleEdit(index, row) {
        this.$router.push({
          name:'Edit',
          path: '/edit', query: {
            id: row.id
          }
        })
      }
    },
    mounted() {
      this.list()
    }
  }
</script>
