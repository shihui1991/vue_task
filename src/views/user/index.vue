<template>
  <div class="app-container">

    <el-form ref="formFilter" :inline="true" :model="formFilter" class="demo-form-inline">
      <el-form-item label="姓名:">
        <el-input v-model="formFilter.name" clearable @change="filterUser"></el-input>
      </el-form-item>
      <el-form-item label="部门:">
        <el-select v-model="formFilter.partment_id" clearable placeholder="请选择部门" @change="filterUser">
          <el-option
                  v-for="item in partmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="技术类别:">
        <el-select v-model="formFilter.skill_type" clearable placeholder="请选择技术类别" @change="filterUser">
          <el-option
                  v-for="(title,key) in skillTypeMap"
                  :key="key"
                  :label="title"
                  :value="parseInt(key)">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="filterUser">查询</el-button>
      </el-form-item>
    </el-form>

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

    <el-table
      v-loading="listLoading"
      :data="userList"
      element-loading-text="加载数据中……"
      stripe
      border
      fit
      highlight-current-row
      ref="userListTable"
    >
      <el-table-column align="center" label="ID" width="80" prop="id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="部门" v-if="!formFilter.partment_id" prop="partment_id">
        <template slot-scope="scope">
          <span>{{ partmentListMap[scope.row.partment_id] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职务" prop="job_level">
        <template slot-scope="scope">
          {{ scope.row.job_level | jobLevelFormatter}} {{ scope.row.job }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="phone">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="60" align="center" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status | statusFormatter}}
        </template>
      </el-table-column>
      <el-table-column label="核心人员" width="80" align="center" prop="is_core">
        <template slot-scope="scope">
          {{ scope.row.is_core | isCoreFormatter}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
              <el-button size="mini" type="primary" icon="el-icon-info" @click="info(scope.$index,scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="配置角色" placement="top">
              <el-button size="mini" type="info" icon="el-icon-setting" @click="showRole(scope.$index,scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="del(scope.$index,scope.row)"></el-button>
            </el-tooltip>
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

    <el-dialog title="职员详情" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="formItems" :model="formItems" label-width="150px" :rules="rules" show-message>
        <el-form-item label="ID：" v-show="formItems.id" prop="id">
          <span>{{formItems.id}}</span>
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <span>{{ formItems.name }}</span>
        </el-form-item>
        <el-form-item label="部门：" prop="partment_id">
          <el-select v-model="formItems.partment_id" clearable placeholder="请选择部门">
            <el-option
                    v-for="item in partmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务：" prop="job">
          <el-input v-model="formItems.job" />
        </el-form-item>
        <el-form-item label="技术类别：" prop="skill_type">
          <el-radio-group v-model="formItems.skill_type">
            <el-radio :label="0" border>无</el-radio>
            <el-radio v-for="(title,val) in skillTypeMap" :label="parseInt(val)" border>{{ title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职级：" prop="job_level">
          <el-radio-group v-model="formItems.job_level">
            <el-radio :label="0" border>无</el-radio>
            <el-radio v-for="(title,val) in jobLevelMap" :label="parseInt(val)" border>{{ title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="formItems.username" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="formItems.password" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="formItems.email" />
        </el-form-item>
        <el-form-item label="电话：" prop="phone">
          <el-input v-model="formItems.phone" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="formItems.status">
            <el-radio v-for="(title,val) in statusMap" :label="parseInt(val)" border>{{ title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否为核心人员：" prop="is_core">
          <el-radio-group v-model="formItems.is_core">
            <el-radio v-for="(title,val) in isCoreMap" :label="parseInt(val)" border>{{ title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入职时间：" prop="joined_at">
          <el-date-picker
                  v-model="formItems.joined_at"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离职时间：" prop="leaved_at">
          <el-date-picker
                  v-model="formItems.leaved_at"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formItems')">保 存</el-button>
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="roleTitle" :visible.sync="dialogRoleVisible" :close-on-click-modal="false">
      <el-transfer
              v-model="roleIds"
              :props="roleProps"
              :data="roleList"
              filterable
              filter-placeholder="请输入名称"
              :filter-method="filterRole"
              :titles="['未选择', '当前已选']"
              :button-texts="['删除', '添加']"
              :render-content="renderRoleContent"
              @change="userRoleCanSave = true"
      >
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="storeUserRole()">保 存</el-button>
        <el-button @click="dialogRoleVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList,store,del,updateUserRole } from '@/api/user'
import { getList as partment_getList } from '@/api/partment'
import { getList as role_getList } from '@/api/role'
import { timestampTodatetime,timestampTodate } from '@/utils/common'

let statusMap = {
  0 : '离职',
  1 : '在职',
};
let jobLevelMap = {
  1 : '初级',
  2 : '中级',
  3 : '高级',
  4 : '主级',
};
let isCoreMap = {
  0 : '否',
  1 : '是',
};

export default {
  filters: {
    formatTimestamp(val) {
      return timestampTodatetime(val);
    },
    statusFormatter(val) {
      return statusMap[val];
    },
    jobLevelFormatter(val){
      return val ? '('+jobLevelMap[val]+')' : '';
    },
    isCoreFormatter(val) {
      return isCoreMap[val];
    }
  },
  data() {
    return {
      userList: null,
      listLoading: true,
      params: {
        isPage: 1,
        total: 0,
        perPage: 20,
        page: 1,
        filter: [],
        order: {}
      },
      pageSizes: [10,20,50,100],
      statusMap: statusMap,
      jobLevelMap: jobLevelMap,
      isCoreMap: isCoreMap,
      partmentList: [],
      partmentListMap: {},
      formFilter: {
        name: null,
        partment_id: null,
        skill_type: null,
      },
      formFilterSymbol: {
        name: 'like',
        partment_id: 'eq',
        skill_type: 'eq',
      },
      skillTypeMap:{
        1 : '程序',
        2 : '美术',
        3 : '策划',
      },
      dialogFormVisible: false,
      dialogRoleVisible: false,
      formItems : null,
      userListActiveIndex : null,
      curRoleUser : null,
      roleTitle : '职员角色配置',
      rules : {
        partment_id: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        skill_type: [
          { required: true, message: '请选择技术类别', trigger: 'change' },
          { type:'enum', enum: [0,1,2,3], message: '请选择技术类别', trigger: 'change' }
        ],
        job: [
          { required: true, message: '请输入职务', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        job_level: [
          { required: true, message: '请选择职级', trigger: 'change' },
          { type:'enum', enum: [0,1,2,3,4], message: '请选择职级', trigger: 'change' }
        ],
        username: [
          { min: 3, max: 255, message: '长度在 3 到 255 个字符', trigger: 'blur' }
        ],
        password: [
          { min: 6, max: 255, message: '长度在 6 到 255 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type:'email', message: '邮箱格式错误', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        phone: [
          { len: 11, message: '电话格式错误', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
          { type:'enum', enum: [0,1], message: '请选择状态', trigger: 'change' }
        ],
        joined_at: [
          { required: true, message: '请选择入职时间', trigger: 'blur' },
        ],
        is_core: [
          { required: true, message: '请选择核心人员', trigger: 'change' },
          { type:'enum', enum: [0,1], message: '请选择核心人员', trigger: 'change' }
        ]
      },
      roleIds:[],
      roleProps:{
        key : 'id',
        label : 'name',
      },
      roleList: [],
      userRoleCanSave: false,
    }
  },
  created() {
    this.clearForm();
    this.getPartmentList();
  },
  methods: {
    getUserList(){
      this.userList = [];
      this.listLoading = true;
      this.userListActiveIndex = null;
      getList(this.params).then(response => {
        this.params.total = response.data.total;
        this.userList = response.data.list;
        this.listLoading = false
      });
    },
    handleSizeChange(val) {
      this.params.perPage = val;
      this.params.page = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getUserList();
    },
    getPartmentList(){
      partment_getList({isPage:0}).then(response => {
        this.partmentList = response.data.list;
        for(let row of this.partmentList){
          this.partmentListMap[row.id] = row.name;
        }
        this.getUserList();
      });
    },
    filterUser(){
      this.params.filter = [];
      this.params.page = 1;
      for(let field in this.formFilter){
        if(this.formFilter[field]){
          this.params.filter.push({
            field : field,
            symbol : this.formFilterSymbol[field],
            value : this.formFilter[field],
          })
        }
      }
      this.getUserList();
    },
    info(index,user){
      this.clearForm();
      this.userListActiveIndex = index;
      this.formItems = Object.assign({},user);
      this.formItems.joined_at = user.joined_at && 'number' === typeof user.joined_at ? timestampTodate(user.joined_at) : user.joined_at;
      this.formItems.leaved_at = user.leaved_at && 'number' === typeof user.leaved_at ? timestampTodate(user.leaved_at) : user.leaved_at;
      this.dialogFormVisible = true;
    },
    clearForm() {
      this.$refs.formItems ? this.$refs.formItems.resetFields() : console.log('第一次获取不到表单对象');
      this.formItems = {
        id: null,
        name: '',
        partment_id: null,
        skill_type: 0,
        job: '',
        job_level: 0,
        username: '',
        password: '',
        email: '',
        phone: '',
        status: 1,
        joined_at: null,
        leaved_at: null,
        is_core: 0,
      };
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if(! valid){
          return false;
        }
        store({input:this.formItems},{id:this.formItems.id}).then(response =>{
          if(! this.userListActiveIndex){
            return false;
          }
          this.userList[this.userListActiveIndex] = response.data.row;
        });
      });
    },
    del(index,user){
      this.$confirm('是否确认删除【'+user.name+'】？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ids:[user.id]}).then(response =>{
          this.userList.splice(index,1);
        });
      }).catch(() => {

      });
      event.stopPropagation();
    },
    showRole(index,user){
      this.userListActiveIndex = index;
      this.curRoleUser = user;
      this.roleTitle = '职员角色配置 - ' + user.name;
      this.dialogRoleVisible = true;
      this.getRoleList();
    },
    filterRole(query,item){
      return item.name.indexOf(query) !== -1;
    },
    renderRoleContent(h, option) {
      return (<span>{ option.id } - { option.name }</span>);
    },
    storeUserRole(){
      if(! this.userRoleCanSave){
        return false;
      }
      updateUserRole({role_ids:this.roleIds},{user_id:this.curRoleUser.id}).then(response => {
        this.userRoleCanSave = false;
      });
    },
    getRoleList(){
      if(this.roleList.length){
        this.checkUserRoles();
        return true;
      }
      role_getList({isPage:0}).then(response => {
        this.roleList = response.data.list;
        this.checkUserRoles();
      });
    },
    checkUserRoles() {
      updateUserRole(null,{user_id:this.curRoleUser.id}).then(response => {
        this.roleIds = response.data.role_ids;
      });
    }
  }
}
</script>
