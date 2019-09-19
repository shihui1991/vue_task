<template>
  <div>
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="pageSizes"
            :page-size="params.perPage"
            layout="total, sizes, prev, pager, next, jumper"
            :total="params.total"
            background
            style="text-align: right;"
    >
    </el-pagination>

    <el-table :data="taskList" style="width: 100%">
      <el-table-column prop="date" label="日期" width="100"></el-table-column>
      <el-table-column prop="task" label="今日任务">
        <template slot-scope="scope">
          {{ scope.row.task }}
        </template>
      </el-table-column>
      <el-table-column prop="task" label="明日任务">
        <template slot-scope="scope">
          {{ scope.row.next_task }}
        </template>
      </el-table-column>
      <el-table-column prop="issues" label="问题与建议" width="150">
        <template slot-scope="scope">
          {{ scope.row.issues|cutString(10) }}
        </template>
      </el-table-column>
      <el-table-column prop="mark" label="备注" width="150">
        <template slot-scope="scope">
          {{ scope.row.mark|cutString(10) }}
        </template>
      </el-table-column>
      <el-table-column prop="reply" label="消息" width="50">
        <template slot-scope="scope">
          <el-tag type="warning" v-show="scope.row.reply > 0">{{ scope.row.reply }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="info" size="mini" @click="jumpToTaskModify(scope.row.id)" v-if="checkTaskCanEdit(scope.row)">修改</el-button>
            <el-button type="primary" size="mini" @click="jumpToTaskDetail(scope.row.id)">查看详情 <i class="el-icon-d-arrow-right"></i></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="pageSizes"
            :page-size="params.perPage"
            layout="total, sizes, prev, pager, next, jumper"
            :total="params.total"
            background
            style="text-align: right;"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getMine } from '@/api/task'
import { timestampTodatetime,timestampTodate } from '@/utils/common'

export default {
  data() {
    return {
      taskList : [],
      params: {
        isPage: 1,
        total: 0,
        perPage: 20,
        page: 1,
        filter: [],
        order: {}
      },
      pageSizes: [10,20,50,100],
    }
  },
  created(){
    this.getTaskList();
  },
  methods: {
    getTaskList(){
      getMine(this.params).then(resp => {
        this.taskList = resp.data.list;
        this.params.total = resp.data.total;
      });
    },
    jumpToTaskDetail(taskId){
      location.href = '/#/mine/task/detail?from=task/mine&id='+ taskId;
    },
    jumpToTaskModify(id){
      location.href = '/#/task/modify?from=task/mine&id=' + id;
    },
    checkTaskCanEdit(row){
      return timestampTodate(row.created_at) === timestampTodate();
    },
    handleSizeChange(val) {
      this.params.perPage = val;
      this.params.page = 1;
      this.getTaskList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getTaskList();
    },
  },
  filters:{
    formatTimestamp(val) {
      return timestampTodatetime(val);
    },
    cutString(val,len){
      len = len ? len : 20;
      return val.length > len ? val.substr(0,len) + '...' : val;
    }
  }
}
</script>

