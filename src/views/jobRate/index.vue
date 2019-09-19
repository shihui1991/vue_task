<template>
  <div>
    <el-form ref="formItems" :model="formItems" label-width="120px" show-message v-if="formItems">
      <el-tabs type="border-card">
        <el-alert
                title="温馨提示：难度级别数字越大，难度越大，难度系数也应该越大（难度系数基数为100）"
                type="warning"
                :closable="false"
                center
                show-icon
        ></el-alert>

        <el-tab-pane v-for="(typeName,type) in skillTypeMap" :label="typeName">
          <el-row :gutter="20">
            <el-col :span="6" v-for="(levelName,level) in jobLevelMap">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>{{ levelName }}</span>
                </div>
                <div class="text item">

                  <el-form-item label="难度级别: ">
                    <span> 难 度 系 数 (%) </span>
                  </el-form-item>
                  <el-form-item :label="dif + ':'" v-for="dif in difficultyLevelMax" :prop="type+'-'+level+'-'+dif" :rules="rateRules">
                    <el-input v-model="formItems[type+'-'+level+'-'+dif]" style="width: 100px;" />
                  </el-form-item>

                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <p style="text-align: center">
          <el-button type="primary" @click="submitForm()" >立 即 保 存</el-button>
        </p>
      </el-tabs>
    </el-form>
  </div>

</template>

<script>
import { getList,store } from '@/api/jobRate'

const skillTypeMap = {
  1 : '技术',
  2 : '美术',
  3 : '策划',
};
const jobLevelMap = {
  1 : '初级',
  2 : '中级',
  3 : '高级',
  4 : '主级',
};
const difficultyLevelMax = 9;

export default {
  data(){
    return {
      skillTypeMap : skillTypeMap,
      jobLevelMap : jobLevelMap,
      difficultyLevelMax : difficultyLevelMax,
      formItems: null,
      rateRules: [
        {required:true,message:'必填',trigger: 'blur'},
        {type:'integer',message:'输入 1~999 之间的整数',min:1,max:999,trigger: 'blur',transform(val){return val * 1;}},
      ],
    }
  },
  methods: {
    fetchData(){
      getList().then(response => {
        this.formItems = response.data;
      });
    },
    submitForm(){
      this.$refs.formItems.validate(valid => {
        if(! valid){
          return false;
        }
        store({input:this.formItems}).then(response => {

        });
      });
    }
  },
  created() {
    this.fetchData();
  }
}
</script>