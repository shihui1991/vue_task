<template>
    <el-row :gutter="20">
        <el-col :lg="isShowPartment ? 12 : 24" :md="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>组织结构</span>
                    <el-button-group style="float:right;">
                        <el-button size="mini" type="success" icon="el-icon-circle-plus-outline" @click="showPartment">添加部门</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="delAll" >批量删除已选</el-button>
                    </el-button-group>
                </div>
                <div class="text item">
                    <div class="tip">
                        <el-input placeholder="输入关键字进行过滤" prefix-icon="el-icon-search" v-model="filterTreePartment"></el-input>
                    </div>
                    <el-tree
                            :props="defaultProps"
                            v-loading="listLoading"
                            :data="treeList"
                            empty-text="没有查询到相关的记录"
                            node-key="id"
                            ref="partmentTree"
                            :filter-node-method="filterNode"
                            :render-content="renderContent"
                            style="margin-top:10px;"
                            show-checkbox
                    >
                    </el-tree>
                </div>
            </el-card>
        </el-col>

        <el-col :lg="12" :md="24" v-show="isShowPartment">
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
                        <el-form-item label="上级部门：">
                            {{formItems.parent_id +' - '+ formItems.parent_name}}
                        </el-form-item>
                        <el-form-item label="名称：" prop="name">
                            <el-input v-model="formItems.name" />
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
                            <el-button @click="hidePartment">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    import {getList,store,del} from '@/api/partment'
    import {makeTreeList,timestampTodatetime} from '@/utils/common'

    export default {
        data() {
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
                filterTreePartment: '',
                isShowPartment: false,
                formItems: null,
                rules:{
                    parent_id:[
                        {required: true, message: '请选择上级部门', trigger: 'blur'},
                        {type: 'integer',min:0, message: '请选择上级部门', trigger: 'blur'},
                    ],
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
                    ]
                }
            };
        },
        created() {
            this.fetchData();
            this.clearForm();
        },
        watch:{
            filterTreePartment(val){
                this.$refs.partmentTree.filter(val);
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
                return data.name.indexOf(val) !== -1;
            },
            renderContent(h, { node, data, store }) {
                return (
                    <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; padding-right: 8px;">
                    <span>{data.id} - {node.label}</span>
                    <span>
                    <el-button-group>
                    <el-tooltip class="item" effect="dark" content="添加下级" placement="top">
                    <el-button size="mini" type="success" icon="el-icon-circle-plus-outline" on-click={ () => this.add(node) }></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                    <el-button size="mini" type="primary" icon="el-icon-info" on-click={ () => this.info(node) }></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button size="mini" type="danger" icon="el-icon-delete" on-click={ () => this.del(node) }></el-button>
                    </el-tooltip>
                    </el-button-group>
                    </span>
                    </span>);
            },
            add(node){
                this.showPartment();
                this.title = '添加下级部门 - ' + node.data.name;
                this.formItems.parent_id = node.data.id;
                this.formItems.parent_name = node.data.name;
                event.stopPropagation();
            },
            info(node){
                this.showPartment();
                this.title = '部门详情 - ' + node.data.name;
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
                            this.$refs.partmentTree.append(row,node.parent)
                        }
                        this.$refs.partmentTree.remove(node);
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
                    let ids = this.$refs.partmentTree.getCheckedKeys();
                    del({ids:ids}).then(response =>{
                        for(let id of ids){
                            this.$refs.partmentTree.remove(id);
                        }
                    });
                }).catch(() => {

                });
            },
            showPartment(){
                this.clearForm();
                this.isShowPartment = true;
            },
            hidePartment(){
                this.isShowPartment = false;
            },
            clearForm() {
                this.$refs.formItems ? this.$refs.formItems.resetFields() : console.log('第一次获取不到表单对象');
                this.title = '添加部门';
                this.formItems = {
                    id: null,
                    parent_id: 0,
                    parent_name: '无',
                    name: '',
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
                        let node = this.$refs.partmentTree.getNode(nodeId);
                        if(response.data.isNew){
                            response.data.row.children = [];
                            node ? this.$refs.partmentTree.append(response.data.row,node) : this.$refs.partmentTree.data.push(response.data.row);
                        }else{
                            node.data = Object.assign(node.data,response.data.row);
                        }
                    });
                });
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