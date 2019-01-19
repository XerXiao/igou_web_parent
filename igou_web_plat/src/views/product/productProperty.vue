<template>
    <section>
        <el-row :gutter="20">
            <!--对应商品类别信息-->
            <el-col :span="6">
                <el-tree
                        style="height: 580px;overflow: scroll;overflow-x:hidden;"
                        :data="productTypes"
                        node-key="id"
                        :props="defaultProps"
                        @node-contextmenu="rightClick"
                        show-checkbox
                        @node-click="leftClick"
                        ref="tree"
                >
                </el-tree>
            </el-col>

            <!--属性添加修改界面-->

            <el-col :span="18">
                <div v-show="this.operatePropertysFormVisible">
                    <el-row>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>显示属性</span>
                                <el-button style="float: right; padding: 3px 0" type="text"><i
                                        class="el-icon-circle-plus"></i>&nbsp;添加显示属性
                                </el-button>
                            </div>
                            <el-row :gutter="12">
                                <el-col :span="6" v-for="(propertie,index) in this.viewProperties"
                                        style="padding-bottom: 10px">
                                    <el-card shadow="hover">
                                        {{propertie.name}}
                                    </el-card>
                                </el-col>
                                <el-card v-show="this.viewProperties.length === 0 ? true:false">
                                    暂无显示属性
                                </el-card>
                            </el-row>
                        </el-card>
                    </el-row>

                    <el-row style="padding-top: 20px">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>SKU属性</span>
                                <el-button style="float: right; padding: 3px 0" type="text"><i
                                        class="el-icon-circle-plus"></i>&nbsp;添加Sku属性
                                </el-button>
                            </div>
                            <el-row :gutter="12">
                                <el-col :span="6" v-for="(propertie,index) in this.skuProperties"
                                        style="padding-bottom: 10px">
                                    <el-card shadow="always">
                                        {{propertie.name}}
                                    </el-card>
                                </el-col>

                                <el-card v-show="this.skuProperties.length === 0 ? true:false">
                                    暂无Sku属性
                                </el-card>
                            </el-row>
                        </el-card>
                    </el-row>

                </div>
            </el-col>
        </el-row>


        <!--新增属性选项界面-->
        <el-dialog title="新增" :visible.sync="operatePropertysOptionFormVisible" :close-on-click-modal="false">
            <el-form :model="operatePropertysOptionForm" label-width="80px" ref="operatePropertysOptionForm">
                <el-form-item label="名称" prop="optionName" :rules="operatePropertysOptionFormRules">
                    <el-input v-model="operatePropertysOptionForm.optionName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="operatePropertysOptionForm.index" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="operatePropertysOptionFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addPropertysOptinoSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';

    export default {
        data() {
            return {
                //双击显示隐藏选项标志位
                flag: false,
                //存放商品类别信息
                productTypes: [],
                //存放类别对应属性信息
                properties: [],
                //存放显示属性信息
                viewProperties: [],
                //存放sku属性信息
                skuProperties: [],
                //默认展开的面板
                propertiesAddCollapse: ['0'],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                operatePropertysFormVisible: false,
                filters: {},
                propertys: [],
                listLoading: false,
                subListLoading: false,
                propertysSels: [],//列表选中列
                propertysOptionsSels: [],//列表选中列

                operateFormVisible: false,//编辑界面是否显示
                editLoading: false,
                addLoading: false,
                //新增属性界面数据
                operatePropertysForm: {
                    name: ''
                },
                //新增属性选项界面数据
                operatePropertysOptionForm: {
                    optionName: '',
                    index: ''
                }

            }
        },
        methods: {
            //左键单击节点事件：
            leftClick(event, object, value, element) {
                //判断被单击节点是否为叶子节点
                let child = object.data.children;
                if (child === null) {
                    this.operatePropertysFormVisible = true;

                    //根据单击节点获取其已有的显示属性
                    let productTypeId = object.data.id;
                    //显示属性
                    this.$http.get("/services/product/specification/viewList/" + productTypeId)
                        .then(({data}) => {
                            this.viewProperties = data;
                        })
                    //sku属性
                    this.$http.get("/services/product/specification/skuList/" + productTypeId)
                        .then(({data}) => {
                            this.skuProperties = data;
                        })
                } else {
                    this.operatePropertysFormVisible = false;
                }
            },
            //处理面板变化
            handleChange() {

            },
            getDataTrees() {
                this.$http.get("/services/product/productType/treeData")
                    .then(({data}) => {
                        this.productTypes = data;
                    })
            },
            handleCurrentChange(val) {
                this.propertyspage = val;
                this.getPropertys();
            },
            handleOptionCurrentChange(val) {
                this.propertysOptionspage = val;
                this.getPropertysOptions();
            }
            ,
            //获取属性列表
            getPropertys() {

                let para = {
                    page: this.propertyspage,
                    keyword: this.filters.propertyskeyword
                };
                this.listLoading = true;
                //NProgress.start();
                this.$http.post("/services/product/specification/json", para)
                    .then(({data}) => {
                        this.propertystotal = data.total;
                        this.propertys = data.rows;
                        this.listLoading = false;
                        //NProgress.done();
                    });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPropertys();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {

            },
            //显示新增界面
            handlePropertysAdd: function (index, row) {
                if (index === -1) {
                    //属性选项新增操作
                    this.operateFormVisible = true;
                    this.operatePropertysForm = {
                        name: '',
                    };
                } else {
                    //修改操作
                    this.operatePropertysForm = {
                        name: row.name
                    };
                    this.operateFormVisible = true;

                }

            },
            handlePropertysOptionAdd: function (index, row) {
                if (index === -1) {
                    //属性选项新增操作
                    this.operatePropertysOptionFormVisible = true;
                    this.operatePropertysOptionForm = {
                        optionName: '',
                        index: ''
                    };
                } else {
                    //修改操作
                    this.operatePropertysOptionForm = {
                        optionName: row.optionName,
                        index: row.index
                    };
                    this.operatePropertysOptionFormVisible = true;

                }
            },
            //编辑
            editSubmit: function () {
                this.$refs.operateForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.operateForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['operateForm'].resetFields();
                                this.operateFormVisible = false;
                                this.getPropertys();
                            });
                        });
                    }
                });
            },
            //新增
            addPropertysSubmit: function () {
                this.$refs.operatePropertysForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.operatePropertysForm);
                            this.$http.post("/services/product/specification/add", para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['operatePropertysForm'].resetFields();
                                this.operateFormVisible = false;
                                this.getPropertys();
                            });
                        });
                    }
                });
            },
            //新增属性选项
            addPropertysOptinoSubmit: function () {

            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPropertys();
                    });
                }).catch(() => {

                });
            },
            propertysSelsChange: function (sels) {
                this.propertysSels = sels;
            },
            propertysOptionsSelsChange: function (sels) {
                this.propertysOptionsSels = sels;
            },
            //双击事件
            handleDoubleClick(row, event) {
                if (!this.flag) {
                    this.propertysDetailTableSpan = 12;
                    this.propertysTableSpan = 12;
                    this.propertysOptions = row.options;
                    this.propertysOptionstotal = row.options.length;
                    this.show = true;
                    //修改标志位
                    this.flag = true;
                } else {
                    this.flag = false;
                    this.propertysTableSpan = 24;
                    this.show = false;
                }

            },
            //行单击事件
            handleClick(row, event) {
                this.propertysOptions = row.options;
                this.propertysOptionstotal = row.options.length;
            }
        },
        mounted() {
            this.getPropertys();
            this.getDataTrees();
        }
    }

</script>

<style scoped>
</style>