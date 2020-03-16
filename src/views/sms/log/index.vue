<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
        搜索
      </el-button>
    </div>

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
      <el-table-column label="请求耗时" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="list" />

  </div>
</template>

<script>
import { list } from '@/api/log'
import { formatDate } from '@/utils/date'
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'

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
      listData: null,
      listQuery: {
        username: undefined,
        pageNumber: 1,
        pageSize: 10,
        orderBy: ''
      },
      total: 0,
      listLoading: true
    }
  },
  created() {
    this.list()
    this.getRoleList()
  },
  methods: {
    checkPermission,
    search() {
      this.listQuery.pageNumber = 1
      this.list()
    },
    list() {
      this.listLoading = true
      list(this.listQuery).then(response => {
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
      this.list()
    }
  }
}
</script>
