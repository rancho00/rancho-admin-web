<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="listQuery" :inline="true">
      <el-form-item label="用户名">
        <el-input
          v-model="listQuery.username"
          placeholder="请输入用户名"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      fit
      border
      highlight-current-row
      :data="listData"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column width="30" type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="请求方法">
              <span>{{ scope.row.method }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ scope.row.params }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" sortable="custom" label="ID" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="操作管理员" align="center" width="250">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.requestIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP来源" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览器" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column label="异常详情"  align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="info(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getLogs" />

    <el-dialog :visible.sync="dialogVisible" title="异常详情" append-to-body top="0" width="75%">
      <pre>
        {{ errorInfo }}
      </pre>
    </el-dialog>
  </div>
</template>

<script>
import { getLogs, getLog } from '@/api/log'
import { formatDate } from '@/utils/date'
import Pagination from '@/components/Pagination'
import { checkPermission } from '@/utils/permission'

export default {
  name: 'errorLog',
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
      listData: null,
      listQuery: {
        logType: 'ERROR',
        username: undefined,
        pageNumber: 1,
        pageSize: 10,
        orderBy: ''
      },
      total: 0,
      listLoading: true,
      dialogVisible: false,
      errorInfo: ''
    }
  },
  created() {
    this.getLogs()
  },
  methods: {
    checkPermission,
    search() {
      this.listQuery.pageNumber = 1
      this.getLogs()
    },
    reset() {
      this.listQuery = {}
      this.getLogs()
    },
    getLogs() {
      this.listLoading = true
      getLogs(this.listQuery).then(response => {
        this.listData = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        if (order === 'ascending') {
          this.listQuery.orderBy = 'id asc'
        } else {
          this.listQuery.orderBy = 'id desc'
        }
      }
      this.listQuery.pageNumber = 1
      this.getLogs()
    },
    info(id) {
      this.dialogVisible = true
      getLog(id).then(res => {
        this.errorInfo = res.data.exceptionDetail
      })
    }
  }
}
</script>
