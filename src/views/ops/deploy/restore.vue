<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="系统还原"
    width="800px">
      <!--表格渲染-->
      <el-table
        v-loading="listLoading"
        :data="listData"
        style="width: 100%"
        @row-click="showRow">
        <el-table-column align="center" width="200">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="应用名称" width="200">
          <template slot-scope="scope">
            {{ scope.row.serveName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="部署IP" width="200">
          <template slot-scope="scope">
            {{ scope.row.ip }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="部署人员" width="200">
          <template slot-scope="scope">
            {{ scope.row.createAdmin }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="300">
          <template slot-scope="scope">
            {{ scope.row.createTime | formatDateTime }}
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getDeployHistorys" />
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="dialogVisible = false">取消</el-button>
      <el-button :loading="submitLoading" type="primary"  @click="handleConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDeployHistorys, restore } from '@/api/deploy'
import { formatDate } from '@/utils/date'
import { checkPermission } from '@/utils/permission'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    formatDate(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      listLoading: true,
      listQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      listData: [],
      total: 0,
      dialogVisible: false,
      submitLoading: false,
      radio: '',
      selectIndex: ''
    }
  },
  methods: {
    checkPermission,
    getDeployHistorys(row) {
      this.listLoading = true
      getDeployHistorys(row.id,this.listQuery).then(response => {
        this.listData = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleConfirm() {
      if (this.selectIndex === '') {
        this.$message.error('请选择要还原的备份')
      } else {
        this.submitLoading = true
        restore(this.radio)
          .then(res => {
            this.dialog = false
            this.submitLoading = false
            this.appNames = ''
            this.$parent.crud.toQuery()
          })
          .catch(err => {
            this.submitLoading = false
            console.log('error:' + err.response.data.message)
          })
      }
    },
    showRow(row) {
      this.radio = this.listData.indexOf(row)
      this.selectIndex = row.id
    }
  }
}
</script>
