<template>
  <div class="">
      <el-radio-group v-model="selectStatus" style="margin: 30px;" @change="changeStatus">
          <el-radio-button :label="0">未读</el-radio-button>
          <el-radio-button :label="1">已读</el-radio-button>
          <el-radio-button :label="-1">全部</el-radio-button>
      </el-radio-group>

      <el-table :data="dataList" style="width: 100%" border stripe>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="date" label="日期" width="100"></el-table-column>
          <el-table-column prop="task_user" label="姓名" width="80">
              <template slot-scope="scope">
                  {{ scope.row.task_user }}
              </template>
          </el-table-column>
          <el-table-column prop="task" label="任务">
              <template slot-scope="scope">
                  {{ scope.row.task|cutString }}
              </template>
          </el-table-column>
          <el-table-column prop="issues" label="问题与建议">
              <template slot-scope="scope">
                  {{ scope.row.issues|cutString }}
              </template>
          </el-table-column>
          <el-table-column prop="content" label="消息内容">
              <template slot-scope="scope">
                  {{ scope.row.content|cutString }}
              </template>
          </el-table-column>
          <el-table-column prop="user_name" label="回复人" width="80"></el-table-column>
          <el-table-column prop="created_at" label="时间" width="160">
              <template slot-scope="scope">
                  {{ scope.row.created_at|formatTimestamp }}
              </template>
          </el-table-column>
          <el-table-column width="200">
              <template slot-scope="scope">
                  <el-button-group>
                  <el-button type="" size="mini" @click="changeUnreadStatus(scope.$index,scope.row)" v-if="0 === parseInt(scope.row.status)">标记已读</el-button>
                  <el-button type="primary" size="mini" @click="jumpToTaskDetail(scope.row.task_id)">查看详情</el-button>
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
import { getMine,markRead } from '@/api/taskReply'
import { timestampTodatetime,timestampTodate} from '@/utils/common'

export default {
    components:{},
    data(){
        return {
            pageSizes : [10,20,50,100],
            selectStatus : 0,
            params: {
                isPage: 1,
                total: 0,
                perPage: 20,
                page: 1,
                filter: [],
                order: {}
            },
            dataList:[],
        }
    },
    created() {
        this.getReplyList();
    },
    methods:{
        handleSizeChange(val) {
            this.params.perPage = val;
            this.params.page = 1;
            this.getReplyList();
        },
        handleCurrentChange(val) {
            this.params.page = val;
            this.getReplyList();
        },
        changeStatus(){
            this.params.page = 1;
            this.getReplyList();
        },
        jumpToTaskDetail(taskId){
            let url = '/#/mine/task/detail?from=mine/reply';
            if(taskId) url += '&id=' + taskId;
            location.href = url;
        },
        getReplyList(){
            if(this.selectStatus > -1){
                this.params.filter = [
                    {
                        field:'status',
                        symbol:'eq',
                        value:this.selectStatus,
                    }
                ]
            }else{
                this.params.filter = [];
            }
            getMine(this.params).then(resp => {
                this.dataList = resp.data.list;
                this.params.total = resp.data.total;
            });
        },
        changeUnreadStatus(index,row) {
            markRead(null,{ids:row.id}).then(resp => {
                row.status = 1;
                if(0 === this.selectStatus){
                    this.dataList.splice(index,1);
                    this.params.total --;
                }
            });
        }
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