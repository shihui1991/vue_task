<template>
    <el-row :gutter="20">
        <el-col :lg="isShowRole||isShowMenu ? 12 : 24" :md="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>角色结构</span>
                    <el-button-group style="float:right;">
                        <el-button size="mini" type="success" icon="el-icon-circle-plus-outline" @click="showRole">添加角色</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="delAll" >批量删除已选</el-button>
                    </el-button-group>
                </div>
                <div class="text item">
                    <div class="tip">
                        <el-input placeholder="输入关键字进行过滤" prefix-icon="el-icon-search" v-model="filterTreeRole"></el-input>
                    </div>
                    <el-tree
                            :props="defaultProps"
                            v-loading="listLoading"
                            :data="treeList"
                            empty-text="没有查询到相关的记录"
                            node-key="id"
                            ref="roleTree"
                            :filter-node-method="filterNode"
                            :render-content="renderContent"
                            style="margin-top:10px;"
                            show-checkbox
                    >
                    </el-tree>
                </div>
            </el-card>
        </el-col>

        <el-col :lg="12" :md="24" v-show="isShowRole">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{title}}</span>
                </div>
                <div class="text item">
                    <el-form ref="formItems" :model="formItems" label-width="120px" :rules="rules" show-message>
                        <el-form-item label="ID：" v-show="formItems.id" prop="id">
                            <span>{{formItems.id}}</span>
                        </el-form-item>
                        <el-form-item label="上级ID：" v-show="false" prop="parent_id">
                            <el-input v-model="formItems.parent_id" type="number"/>
                        </el-form-item>
                        <el-form-item label="上级角色：">
                            {{formItems.parent_id +' - '+ formItems.parent_name}}
                        </el-form-item>
                        <el-form-item label="名称：" prop="name">
                            <el-input v-model="formItems.name" />
                        </el-form-item>
                        <el-form-item label="是否超管：" prop="is_root">
                            <el-radio-group v-model="formItems.is_root">
                                <el-radio v-for="(title,val) in isRootMap" :label="parseInt(val)" border>{{ title }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="状态：" prop="status">
                            <el-radio-group v-model="formItems.status">
                                <el-radio v-for="(title,val) in statusMap" :label="parseInt(val)" border>{{ title }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="创建时间：" v-show="formItems.created_at">
                            <span>{{formItems.created_at|formatTimestamp}}</span>
                        </el-form-item>
                        <el-form-item label="更新时间：" v-show="formItems.updated_at">
                            <span>{{formItems.updated_at|formatTimestamp}}</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('formItems')">保存</el-button>
                            <el-button type="danger" @click="clearForm">清空</el-button>
                            <el-button @click="hideRole">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </el-col>
        <el-col :lg="12" :md="24" v-show="isShowMenu">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>权限菜单 - {{curRoleNode ? curRoleNode.data.name : ''}}</span>
                    <el-button-group style="float:right;">
                        <el-button size="mini" type="success" icon="el-icon-check" @click="storeRoleMenu">保存已选</el-button>
                        <el-button size="mini" type="default" icon="el-icon-close" @click="hideMenu">取消</el-button>
                    </el-button-group>
                </div>
                <div class="text item">
                    <el-alert v-show="curRoleNode && '1' == curRoleNode.data.is_root"
                            title="超管不需要配置授权菜单！"
                            type="warning"
                            show-icon>
                    </el-alert>
                    <el-transfer
                            v-model="menuIds"
                            :props="menuProps"
                            :data="menuList"
                            filterable
                            filter-placeholder="请输入名称"
                            :filter-method="filterMenu"
                            :titles="['未授权', '已选择']"
                            :button-texts="['删除', '添加']"
                            :render-content="renderMenuContent"
                            @change="roleMenuCanSave = true"
                    >
                    </el-transfer>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    import {getList,store,del,updateRoleMenu} from '@/api/role'
    import {getList as menu_getList} from '@/api/menu'
    import {makeTreeList,timestampTodatetime,inArray} from '@/utils/common'

    export default {
        data() {
            const isRootMap = {
                0 : '普通',
                1 : '超管',
            };
            const statusMap = {
                0 : '禁用',
                1 : '开启',
            };

            return {
                title: '',
                treeList: null,
                originList: [],
                listLoading: true,
                params: {
                    isPage: 1,
                    total: 0,
                    perPage: 100,
                    page: 1,
                    filter: [],
                    order: {},
                },
                defaultProps: {
                    label: 'name',
                    children: 'children',
                },
                filterTreeRole: '',
                isShowRole: false,
                isShowMenu: false,
                formItems: null,
                rules:{
                    parent_id:[
                        {required: true, message: '请选择上级角色', trigger: 'blur'},
                        {type: 'integer',min:0, message: '请选择上级角色', trigger: 'blur'},
                    ],
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
                    ],
                    is_root: [
                        { required: true, message: '请选择是否超管', trigger: 'change' },
                        { type:'enum', enum: [0,1], message: '请选择是否超管', trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'change' },
                        { type:'enum', enum: [0,1], message: '请选择状态', trigger: 'change' }
                    ],
                },
                menuOriginList: [],
                menuList: [],
                menuIds: [],
                menuProps: {
                    key : 'id',
                    label : 'name',
                },
                curRoleNode:null,
                isRootMap:isRootMap,
                statusMap:statusMap,
                roleMenuCanSave: false,
            };
        },
        created() {
            this.fetchData();
            this.initForm();
        },
        watch:{
            filterTreeRole(val){
                this.$refs.roleTree.filter(val);
            }
        },
        methods: {
            fetchData(node, resolve) {
                this.listLoading = true;
                getList(this.params).then(response => {
                    if (response.data.list.length) {
                        this.originList = this.originList.concat(response.data.list);
                    }
                    this.params.total = response.data.total;
                    if (this.originList.length >= this.params.total) {
                        this.listLoading = false;
                        this.treeList = makeTreeList(this.originList);
                    } else {
                        this.params.page++;
                        this.fetchData();
                    }
                });
            },
            filterNode(val, data) {
                if(!val) return true;
                return data.name.indexOf(val) !== -1 ;
            },
            renderContent(h, { node, data, store }) {
                return (
                    <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; padding-right: 8px;">
                    <span>{data.id} - {node.label}</span>
                    <span>{this.isRootMap[data.is_root]} | {this.statusMap[data.status]}</span>
                    <span>
                    <el-button-group>
                    <el-tooltip class="item" effect="dark" content="添加下级" placement="top">
                    <el-button size="mini" type="success" icon="el-icon-circle-plus-outline" on-click={ () => this.add(node) }></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                    <el-button size="mini" type="primary" icon="el-icon-info" on-click={ () => this.info(node) }></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="配置访问权限" placement="top">
                    <el-button size="mini" type="info" icon="el-icon-setting" on-click={ () => this.showMenu(node) }></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button size="mini" type="danger" icon="el-icon-delete" on-click={ () => this.del(node) }></el-button>
                    </el-tooltip>
                    </el-button-group>
                    </span>
                    </span>);
            },
            add(node){
                this.showRole();
                this.title = '添加下级角色 - ' + node.data.name;
                this.formItems.parent_id = node.data.id;
                this.formItems.parent_name = node.data.name;
                event.stopPropagation();
            },
            info(node){
                this.showRole();
                this.title = '角色详情 - ' + node.data.name;
                let data = Object.assign({},node.data);
                delete data.children;
                this.formItems = data;
                this.formItems.parent_name = node.parent.data.name ? node.parent.data.name : '';
                event.stopPropagation();
            },
            del(node){
                this.$confirm('是否确认删除【'+node.data.name+'】？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    del({ids:[node.data.id]}).then(response =>{
                        for(let row of node.data.children){
                            this.$refs.roleTree.append(row,node.parent)
                        }
                        this.$refs.roleTree.remove(node);
                    });
                }).catch(() => {

                });

                event.stopPropagation();
            },
            delAll(){
                this.$confirm('是否确认删除选中的数据吗？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = this.$refs.roleTree.getCheckedKeys();
                    del({ids:ids}).then(response =>{
                        for(let id of ids){
                            this.$refs.roleTree.remove(id);
                        }
                    });
                }).catch(() => {

                });
            },
            showRole(){
                this.clearForm();
                this.isShowRole = true;
                this.isShowMenu = false;
            },
            hideRole(){
                this.isShowRole = false;
            },
            clearForm() {
                this.$refs.formItems ? this.$refs.formItems.resetFields() : console.log('第一次获取不到表单对象');
                this.initForm();
            },
            initForm() {
                this.title = '添加角色';
                this.formItems = {
                    id: null,
                    parent_id: 0,
                    parent_name: '无',
                    name: '',
                    is_root: 0,
                    status: 1,
                    created_at: null,
                    updated_at: null,
                };
            },
            submitForm(form) {
                this.$refs[form].validate((valid) => {
                    if(!valid){
                       return false;
                    }
                    let nodeId = this.formItems.id || this.formItems.parent_id || undefined;
                    store({input:this.formItems},{id:this.formItems.id}).then(response =>{
                        let node = this.$refs.roleTree.getNode(nodeId);
                        if(response.data.isNew){
                            response.data.row.children = [];
                            node ? this.$refs.roleTree.append(response.data.row,node) : this.$refs.roleTree.data.push(response.data.row);
                        }else{
                            node.data = Object.assign(node.data,response.data.row);
                        }
                    });
                });
            },
            showMenu(node){
                this.isShowMenu = true;
                this.isShowRole = false;
                this.getMenuList(1,node);
            },
            hideMenu(){
                this.isShowMenu = false;
            },
            checkNodeMenu(node) {
                if(this.curRoleNode && this.curRoleNode.data.id === node.data.id){
                    return true;
                }
                this.curRoleNode = node;
                this.menuIds = [];
                this.menuList = [];
                if('1' == node.data.is_root){
                    this.menuList = this.handleMenuList(this.menuOriginList,this.menuList,[]);
                } else if(node.data.parent_id && '1' != node.parent.data.is_root){
                    updateRoleMenu(null,{role_id:node.parent.data.id}).then(response => {
                        this.menuList = this.handleMenuList(this.menuOriginList,this.menuList,response.data.menu_ids);
                    });
                }else{
                    this.menuList = this.handleMenuList(this.menuOriginList,this.menuList);
                }
                updateRoleMenu(null,{role_id:node.data.id}).then(response => {
                    this.menuIds = response.data.menu_ids;
                });
            },
            getMenuList(page,node){
                if(0 !== this.menuList.length){
                    this.checkNodeMenu(node);
                    return true;
                }
                menu_getList({isPage: 1, page: page || 1, perPage: 100}).then(response => {
                    if (response.data.list.length) {
                        this.menuOriginList = this.menuOriginList.concat(response.data.list);
                    }
                    if (this.menuOriginList.length < response.data.total) {
                        this.getMenuList(response.data.page + 1)
                    }else{
                        this.checkNodeMenu(node);
                    }
                });
            },
            handleMenuList(originList,list,parentMenuIds){
                for(let row of originList){
                    row.disabled = '0' == row.status || '0' == row.is_ctrl || (parentMenuIds && ! inArray(row.id,parentMenuIds)) || false;
                    list.push(row);
                }
                return list;
            },
            filterMenu(query,item){
                return item.name.indexOf(query) !== -1;
            },
            storeRoleMenu(){
                if(! this.roleMenuCanSave || '1' == this.curRoleNode.data.is_root){
                    return false;
                }
                updateRoleMenu({menu_ids:this.menuIds},{role_id:this.curRoleNode.data.id}).then(response => {
                    this.roleMenuCanSave = false;
                });
            },
            renderMenuContent(h, option) {
                return (<span>{ option.id } - { option.name }</span>);
            }
        },
        filters:{
            formatTimestamp(val) {
                return timestampTodatetime(val);
            }
        }
    };
</script>
<style>
    .el-tree-node__content,.el-tree-node{margin-bottom: 10px;}
</style>