<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.value" placeholder="权限值" style="width: 200px;" class="filter-item" />
      <el-select class="filter-item" v-model="listQuery.type" placeholder="类型">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">
        搜索
      </el-button>
      <el-button v-if="checkPermission('menu:save')" class="filter-item" type="primary" icon="el-icon-edit" @click="save">
        添加
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
      <el-table-column prop="id" sortable="custom" label="ID" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="uri" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.uri }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限值" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父ID" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="icon" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="禁用/启用" align="center" width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="updateStatus(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button v-if="checkPermission('menu:detail')" type="primary" size="mini" @click="update(row)">
            编辑
          </el-button>
          <el-button v-if="checkPermission('menu:delete')" type="danger" size="mini" @click="del(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="list" />

  </div>
</template>

<script>
import { list, updateStatus, del } from '@/api/menu'
import { formatDate } from '@/utils/date'
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success'
      }
      return statusMap[status]
    },
    statusFormat(status) {
      const statusMap = {
        0: '禁用',
        1: '启用'
      }
      return statusMap[status]
    },
    typeFormat(type) {
      const typeMap = {
        0: '目录',
        1: '菜单',
        2: '按钮'
      }
      return typeMap[type]
    },
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
        value: undefined,
        type: undefined,
        pageNumber: 1,
        pageSize: 10,
        orderBy: ''
      },
      total: 0,
      listLoading: true,
      typeOptions: [
        {
          value: 0,
          label: '目录'
        },
        {
          value: 1,
          label: '菜单'
        },
        {
          value: 2,
          label: '按钮'
        }
      ]
    }
  },
  created() {
    this.list()
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
    updateStatus(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id, { 'status': row.status }).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.list()
        })
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
    },
    save() {
      this.$router.push({ path: '/menu/save' })
    },
    update(row) {
      this.$router.push({ path: '/menu/update', query: { id: row.id }})
    },
    del(row) {
      this.$confirm('是否要删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.list()
        })
      })
    }
  }
}
</script>
