<template>
  <div class="">
    <el-row :gutter="20">
      <el-col :span="24" style="margin-bottom: 20px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #67C23A"><svg-icon icon-class="skill" /> 今日任务</span>
          </div>
          <div class="text item">
            <task-info :task-info="todayTaskData" :inline="false" style="padding: 0 50px;"/>
            <div v-show="! todayTaskData" style="padding-bottom: 10px;">
              <el-alert
                        title="温馨提示：今日任务尚未填报,请下班前及时填写并上报"
                        type="warning"
                        :closable="false"
                        show-icon
              ></el-alert>
              <el-button size="small" type="success" icon="el-icon-edit" @click="jumpToTaskModify(0)" style="position: relative;right:0;bottom:35px;float: right;">立 即 填 报</el-button>
            </div>

          </div>
        </el-card>
      </el-col>

      <el-col :span="24" style="margin-bottom: 20px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #F56C6C">
                <svg-icon icon-class="message" />
                最近未读消息 - <small>当前有<el-tag size="mini">{{ unreadReplyTotal }}</el-tag>条未读消息</small>
            </span>
              <el-button size="mini" type="danger" @click="jumpToMineTaskReply" style="float: right;">查看更多 <i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
          </div>
          <div class="text item">
            <el-table :data="unreadReplyList" style="width: 100%" v-show="unreadReplyList.length">
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
              <el-table-column width="100">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="jumpToTaskDetail(scope.row.task_id)">查看详情 <i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
                </template>
              </el-table-column>

            </el-table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" style="margin-bottom: 20px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
              <span style="color: #E6A23C"><svg-icon icon-class="nested" /> 最近历史日报</span>
              <el-button size="mini" type="warning" @click="jumpToUrl('/#/mine/task')" style="float: right;">查看更多 <i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
          </div>
          <div class="text item">
              <el-table :data="mineTaskList" style="width: 100%" v-show="mineTaskList.length">
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
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" style="margin-bottom: 20px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="color: #909399"><svg-icon icon-class="excel" /> 最近任务绩效</span>
          </div>
          <div class="text item">

          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TaskInfo from '@/components/TaskInfo'
import { getToday,getMine as getMineTask } from '@/api/task'
import { getMine as getUnreadReply } from '@/api/taskReply'
import { timestampTodatetime,timestampTodate } from '@/utils/common'

export default {
    components:{
        TaskInfo,
    },
    data(){
        return {
            todayTaskData : null,
            unreadReplyList : [],
            unreadReplyTotal : 0,
            mineTaskList : [],
        }
    },
    created() {
        this.getTodayTask();
        this.getUnreadReplyList();
        this.getMineTaskList();
    },
    methods:{
        getTodayTask(){
            getToday().then(resp => {
                if(resp.data){
                    this.todayTaskData = resp.data;
                }
            });
        },
        jumpToUrl(url){
            location.href = url;
        },
        jumpToTaskModify(id){
            location.href = '/#/task/modify?from=dashboard&id=' + id;
        },
        jumpToMineTaskReply(){
            location.href = '/#/mine/reply?from=dashboard';
        },
        jumpToTaskDetail(taskId){
            location.href = '/#/mine/task/detail?from=dashboard&id=' + taskId;
        },
        getUnreadReplyList(){
            let params = {
                filter: [
                    {
                        field:'status',
                        symbol:'eq',
                        value:0
                    }
                ],
                isPage:1,
                page:1,
                perPage:5,
            };
            getUnreadReply(params).then(resp => {
                this.unreadReplyList = resp.data.list;
                this.unreadReplyTotal = resp.data.total;
            });
        },
        getMineTaskList(){
            let params = {
                isPage:1,
                page:1,
                perPage:10,
            };
            getMineTask(params).then(resp => {
                this.mineTaskList = resp.data.list;
            });
        },
        checkTaskCanEdit(row){
            return timestampTodate(row.created_at) === timestampTodate();
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