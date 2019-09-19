<template>
  <el-form ref="taskInfo" label-width="120px" v-if="taskInfo" :inline="inline">

    <el-form-item label="日期：">
      <span>{{ taskInfo.date }}</span>
    </el-form-item>

    <el-form-item label="姓名：" v-if="checkShowUserName()">
      <span>{{ taskInfo.user_name }}</span>
    </el-form-item>

    <el-form-item label="今日任务：">
      <span>{{ taskInfo.task }}</span>
    </el-form-item>

    <el-form-item label="明日任务：">
      <span>{{ taskInfo.next_task }}</span>
    </el-form-item>

    <el-form-item label="问题与建议：">
      <span>{{ taskInfo.issues }}</span>
    </el-form-item>

    <el-form-item label="备注：">
      <span>{{ taskInfo.mark }}</span>
    </el-form-item>

    <el-form-item label="创建时间：">
      <span>{{taskInfo.created_at|formatTimestamp}}</span>
    </el-form-item>

    <el-form-item label="更新时间：">
      <span>{{taskInfo.updated_at|formatTimestamp}}</span>
    </el-form-item>
  </el-form>
</template>

<script>
import { timestampTodatetime } from '@/utils/common'
import { getLoginUserId } from '@/utils/login'

export default {
  props:{
    'taskInfo':{
      type:Object
    },
    'inline':{
      default:true
    }
  },
  methods:{
    checkShowUserName(){
      return this.taskInfo.user_id != getLoginUserId();
    }
  },
  filters:{
    formatTimestamp(val) {
      return timestampTodatetime(val);
    }
  }
}
</script>