<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="admin" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                用户code
                <div class="pull-right">{{ admin.username }}</div>
              </li>
              <li class="list-group-item">
                用户名称
                <div class="pull-right">{{ admin.nickname }}</div>
              </li>
              <li class="list-group-item">
                状态
                <div class="pull-right">{{ admin.status | formatStatus}}</div>
              </li>
              <li class="list-group-item">
               类型
                <div class="pull-right">{{ admin.type | formatType}}</div>
              </li>

              <li class="list-group-item">
                创建日期
                <div class="pull-right">{{ admin.createTime | formatDateTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
<!--            <el-tab-pane label="基本资料" name="userinfo">-->
<!--              <info :user="admin" />-->
<!--            </el-tab-pane>-->
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="admin" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import info from "./info";
import resetPwd from "./resetPwd";
import { getInfo } from "@/api/admin";
import { formatDate } from "@/utils/date";

export default {
  name: "Profile",
  components: { userAvatar,info, resetPwd },
  filters: {
    formatStatus(status){
      const statusMap = {
        0: '禁用',
        1: '启用'
      }
      return statusMap[status]
    },
    formatType(type){
      const typeMap = {
        'admin': '超级管理员',
        'common': '普通管理员'
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
      admin: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "resetPwd"
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getInfo().then(response => {
        const data = response.data
        this.admin = data.admin
      })
    }
  }
}
</script>
