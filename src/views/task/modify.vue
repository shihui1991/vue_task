<template>
  <el-form ref="formModify" :model="formItems" label-width="120px" :rules="rules" show-message style="padding:50px;">
    <el-form-item label="日期：" prop="date">
      <el-date-picker v-model="formItems.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%">
      </el-date-picker>
    </el-form-item>

    <el-form-item label="今日任务：" prop="task">
      <el-input v-model="formItems.task" />
    </el-form-item>

    <el-form-item label="明日任务：" prop="next_task">
      <el-input v-model="formItems.next_task" />
    </el-form-item>

    <el-form-item label="问题与建议：" prop="issues">
      <el-input v-model="formItems.issues" type="textarea" autosize/>
    </el-form-item>

    <el-form-item label="备注：" prop="mark">
      <el-input v-model="formItems.mark" type="textarea" autosize/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm">立即上报</el-button>
      <el-button type="danger" @click="resetForm">清空</el-button>
      <el-button @click="backToFrom" v-show="isShowBack">返回</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import { store,getInfo } from '@/api/task'
import { timestampTodate } from '@/utils/common'

export default {
  data(){
    return {
      formItems: {
        id : null,
        date : timestampTodate(),
        user_id : null,
        task : null,
        next_task : null,
        issues : null,
        mark : null,
        created_at : null,
        updated_at : null,
      },
      rules : {
        date:[
          {tpe:'date',required:true,message:'请选择日期'}
        ],
        task:[
          {required:true,message:'必填'},
          {type:'string',max:255,message:'最多输入255个字'},
        ],
        next_task:[
          {type:'string',max:255,message:'最多输入255个字'},
        ],
      },
      isShowBack: false
    }
  },
  created() {
    if(this.$route.query.from) this.isShowBack = true;
    this.getTaskInfo();
  },
  methods:{
    resetFormItems(){
      for(let item in this.formItems){
        this.formItems[item] = null;
      }
    },
    resetForm(){
      this.resetFormItems();
      this.$refs.formModify.resetFields();
    },
    submitForm(){
      this.$refs.formModify.validate(valid => {
        if(! valid) return false;
        store({input:this.formItems}).then(resp => {

        });
      });
    },
    backToFrom(){
      // let url = '/#/';
      // if(this.$route.query.from) url += this.$route.query.from;
      // url += '?id='+this.$route.query.id;console.log(url);
      // location.href = url;
      history.back()
    },
    getTaskInfo(){
      if(! this.$route.query.id) return false;
      getInfo(this.$route.query.id).then(resp => {
        this.formItems = resp.data;
      });
    }
  }
}
</script>