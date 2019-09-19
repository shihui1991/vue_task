<template>
  <el-row :gutter="20">
    <el-button type="info" size="mini" @click="jumpToFrom" style="margin: 10px 0 10px 50px">返 回</el-button>

    <el-col :span="24" style="margin-bottom: 20px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="color: #67C23A"><svg-icon icon-class="skill" /> 日报内容 </span>
          <el-button type="info" size="mini" @click="jumpToTaskModify(taskInfo.id)" v-if="checkTaskCanEdit()" style="float: right">修 改</el-button>
        </div>
        <div class="text item">
          <task-info :task-info="taskInfo" :inline="false"/>
        </div>
      </el-card>
    </el-col>

    <el-col :span="24" style="margin-bottom: 20px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="color: #F56C6C"><svg-icon icon-class="message" /> 反馈消息 </span>
          <el-button type="primary" size="small" @click="replyTask" v-if="userinfo.id != taskInfo.user_id" style="float: right">回 复</el-button>
        </div>
        <div class="text item">
          <el-table :data="dataList" style="width: 100%" border stripe>
            <el-table-column prop="user_name" label="姓名" width="200">
              <template slot-scope="scope">
                <span v-html="fillLevelNbsp(scope.row.tree_level)"></span>
                <span>{{ scope.row.user_name }}：</span>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="消息内容">
              <template slot-scope="scope">
                {{ scope.row.content }}
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="时间" width="160">
              <template slot-scope="scope">
                {{ scope.row.created_at|formatTimestamp }}
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button type="" size="mini" @click="replyMsg(scope.$index,scope.row)" v-if="userinfo.id != scope.row.user_id">回复</el-button>
                  <el-button type="primary" size="mini" @click="editMsg(scope.$index,scope.row)" v-if="userinfo.id == scope.row.user_id">修改</el-button>
                  <el-button type="danger" size="mini" @click="deleteMsg(scope.$index,scope.row)" v-if="userinfo.id == scope.row.user_id">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-card>

      <el-dialog :title="replyTitle" :visible.sync="dialogReplyVisible" :close-on-click-modal="false" center>
        <p v-show="this.replyParams.msg">TA说：{{ this.replyParams.msg }}</p>
        <el-input
                type="textarea"
                :autosize="{ minRows: 5}"
                placeholder="请输入回复内容"
                v-model="replyParams.content">
        </el-input>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sendMsg()">发 送</el-button>
          <el-button @click="dialogReplyVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
  import TaskInfo from '@/components/TaskInfo'
  import { getTaskReply,store,del } from '@/api/taskReply'
  import { getInfo as getTaskInfo } from '@/api/task'
  import { timestampTodatetime,timestampTodate } from '@/utils/common'
  import { getLoginUserId } from '@/utils/login'
  import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'userinfo',
    ])
  },
  components:{
    TaskInfo,
  },
  data(){
    return {
      taskInfo : {},
      dataList: [],
      listLoading: true,
      replyTitle: null,
      dialogReplyVisible: false,
      replyParams: {
        index: -1,
        row: {},
        isEdit: false,
        msg: '',
        content: '',
      },
    }
  },
  created(){
    this.getData();
  },
  methods:{
    getData(){
      let taskId = this.$route.query.id;
      getTaskInfo(taskId).then(resp => {
        this.taskInfo = resp.data;
      });
      this.listLoading = true;
      getTaskReply(taskId).then(resp => {
        this.listLoading = false;
        this.dataList = resp.data.list;
      });
    },
    fillLevelNbsp(level){
      return (new Array((level-1)*4)).join('&nbsp;');
    },
    jumpToTaskModify(id){
      location.href = '/#/task/modify?from=mine/task/detail&id='+ id;
    },
    replyTask(){
      this.dialogReplyVisible = true;
      this.replyTitle = '回 复';
      this.replyParams.index = -1;
      this.replyParams.row = {};
      this.replyParams.isEdit = false;
      this.replyParams.msg = '';
      this.replyParams.content = '';
    },
    replyMsg(index,row){
      this.dialogReplyVisible = true;
      this.replyTitle = '回 复 - ' + row.user_name;
      this.replyParams.index = index;
      this.replyParams.row = row;
      this.replyParams.isEdit = false;
      this.replyParams.msg = row.content;
      this.replyParams.content = '';
    },
    editMsg(index,row){
      this.dialogReplyVisible = true;
      this.replyTitle = '修 改 回 复';
      this.replyParams.index = index;
      this.replyParams.row = row;
      this.replyParams.isEdit = true;
      this.replyParams.msg = '';
      this.replyParams.content = row.content;
    },
    sendMsg(){
      let treeLevel,parentId,toUserId;
      if(-1 === this.replyParams.index){
        treeLevel = 1;
        parentId = 0;
        toUserId = this.taskInfo.user_id;
      }else{
        treeLevel = this.replyParams.isEdit ? this.replyParams.row.tree_level : parseInt(this.replyParams.row.tree_level) + 1;
        parentId = this.replyParams.row.id;
        toUserId = this.replyParams.row.user_id;
      }
      let data = {
        parent_id : parentId,
        task_id : this.taskInfo.id,
        to_user_id : toUserId,
        content : this.replyParams.content,
        status : 0,
      };
      let params = this.replyParams.isEdit ? {id:this.replyParams.row.id} : undefined;
      store({input:data},params).then(resp => {
        let row = resp.data.row;
        row.tree_level = treeLevel;
        row.user_name = this.userinfo.name;
        if(-1 === this.replyParams.index){
          this.dataList.push(row);
        }else{
          if(this.replyParams.isEdit){
            this.dataList.splice(this.replyParams.index,1,row);
          }else{
            this.dataList.splice(this.replyParams.index + 1,0,row);
          }
        }
        this.dialogReplyVisible = false;
      });
    },
    deleteMsg(index,row){
      this.$confirm('是否确认删除？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(null,{ids : row.id}).then(response =>{
          this.dataList.splice(index,1)
        });
      }).catch(() => {

      });
    },
    jumpToFrom(){
      history.back();
    },
    checkTaskCanEdit(){
      return this.userinfo.id == this.taskInfo.user_id && timestampTodate(this.taskInfo.created_at) === timestampTodate();
    }
  },
  filters:{
    formatTimestamp(val) {
      return timestampTodatetime(val);
    }
  }
}
</script>