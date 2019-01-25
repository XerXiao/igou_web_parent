<template>
    <section>
        <el-row :gutter="20" style="padding-top: 20px">
            <!--对应商品类别信息-->
            <el-col :span="6">
                <el-input
                        placeholder="输入关键字进行过滤"
                        clearable
                        prefix-icon="el-icon-search"
                        v-model="filterText">
                </el-input>
                <el-tree
                        style="height: 580px;overflow: scroll;overflow-x:hidden;"
                        :data="productTypes"
                        node-key="id"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
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
                                <el-button style="float: right; padding: 3px 0 0 10px" type="text"
                                           v-show="saveViewChangeShow"
                                           @click="changeSubmit(0)"><i
                                        class="el-icon-circle-check"></i>&nbsp;保存修改
                                </el-button>

                                <el-button style="float: right; padding: 3px 0" type="text"
                                           @click="handleAddViewPropertie"><i
                                        class="el-icon-circle-plus"></i>&nbsp;添加显示属性
                                </el-button>

                            </div>
                            <el-row :gutter="12">
                                <el-col :span="6" v-for="(propertie,index) in this.viewProperties"
                                        style="padding-bottom: 10px">
                                    <el-card shadow="hover" style="line-height: 40px;" class="card">
                                        <el-input
                                                v-model="propertie.name"
                                                class="change-input"
                                                @blur="checkInput(0,index)"
                                        >
                                        </el-input>

                                        <div style="float: right;" class="change-status">
                                            <!--<el-button type="primary" @click="handleViewCardEditBtnClick(index)"-->
                                            <!--icon="el-icon-edit"></el-button>-->
                                            <el-button type="primary"
                                                       @click="handleViewCardDelBtnClick(index,propertie)"
                                                       icon="el-icon-delete"></el-button>
                                        </div>
                                    </el-card>
                                </el-col>
                                <el-card v-show="this.viewProperties.length === 0 ? true:false">
                                    暂无显示属性
                                </el-card>

                            </el-row>
                            <el-popover
                                    placement="right"
                                    width="400"
                                    v-show="delInfoShow"
                                    trigger="hover">
                                <el-table :data="delCardArr">
                                    <el-table-column property="name" label="属性名称"></el-table-column>
                                    <el-table-column>
                                        <template slot-scope="scope">
                                            <el-button type="success" size="small"
                                                       style="float: right"
                                                       @click="reBackCard(0,scope.$index,scope.row)">恢复
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column>
                                        <template slot="header" slot-scope="scope">
                                            <el-button type="danger" style="height: 30px;line-height: 0px"
                                                       @click="cleanDelArr"
                                            >删除属性
                                            </el-button>
                                        </template>
                                    </el-table-column>

                                </el-table>


                                <el-badge slot="reference"
                                          :value="delCardArr.length"
                                          class="item"
                                          style="float: right;padding-bottom: 10px">
                                    <el-button size="small"><i class="el-icon-delete"></i></el-button>
                                </el-badge>
                            </el-popover>
                        </el-card>
                    </el-row>

                    <el-row style="padding-top: 20px">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>SKU属性</span>

                                <el-button style="float: right; padding: 3px 0 0 10px" type="text"
                                           v-show="saveSkuChangeShow"
                                           @click="changeSkuSubmit"><i
                                        class="el-icon-circle-check"></i>&nbsp;保存修改
                                </el-button>

                                <el-button style="float: right; padding: 3px 0" type="text"
                                           @click="handleAddSkuPropertie"
                                ><i
                                        class="el-icon-circle-plus"></i>&nbsp;添加Sku属性
                                </el-button>


                            </div>
                            <el-row :gutter="12">
                                <el-col :span="6" v-for="(propertie,index) in this.skuProperties"
                                        style="padding-bottom: 10px">
                                    <!--<el-card shadow="hover">-->
                                    <!--{{propertie.name}}-->
                                    <!--</el-card>-->

                                    <el-card shadow="hover" style="line-height: 40px;" class="card">
                                        <el-input v-model="propertie.name" class="change-input"
                                                  @blur="checkInput(1,index)"
                                        >
                                        </el-input>
                                        <div style="float: right;" class="change-status">
                                            <!--<el-button type="primary" @click="handleViewCardEditBtnClick(index)"-->
                                            <!--icon="el-icon-edit"></el-button>-->
                                            <el-button type="primary"
                                                       @click="handleSkuCardDelBtnClick(index,propertie)"
                                                       icon="el-icon-delete"></el-button>
                                        </div>
                                    </el-card>
                                </el-col>

                                <el-card v-show="this.skuProperties.length === 0 ? true:false">
                                    暂无Sku属性
                                </el-card>
                            </el-row>

                            <el-popover
                                    placement="right"
                                    width="400"
                                    v-show="delSkuInfoShow"
                                    trigger="hover">
                                <el-table :data="delSkuCardArr">
                                    <el-table-column property="name" label="属性名称"></el-table-column>
                                    <el-table-column>
                                        <template slot-scope="scope">
                                            <el-button type="success" size="small"
                                                       style="float: right"
                                                       @click="reBackCard(1,scope.$index,scope.row)">恢复
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column>
                                        <template slot="header" slot-scope="scope">
                                            <el-button type="danger" style="height: 30px;line-height: 0px"
                                                       @click="cleanDelArr"
                                            >删除属性
                                            </el-button>
                                        </template>
                                    </el-table-column>

                                </el-table>


                                <el-badge slot="reference"
                                          :value="delSkuCardArr.length"
                                          class="item"
                                          style="float: right;padding-bottom: 10px">
                                    <el-button size="small"><i class="el-icon-delete"></i></el-button>
                                </el-badge>
                            </el-popover>
                        </el-card>
                    </el-row>

                </div>
            </el-col>
        </el-row>


        <!--新增属性选项界面-->
        <!--<el-dialog title="新增" :visible.sync="operatePropertysOptionFormVisible" :close-on-click-modal="false">-->
        <!--<el-form :model="operatePropertysOptionForm" label-width="80px" ref="operatePropertysOptionForm">-->
        <!--<el-form-item label="名称" prop="optionName" >-->
        <!--<el-input v-model="operatePropertysOptionForm.optionName" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="排序">-->
        <!--<el-input v-model="operatePropertysOptionForm.index" auto-complete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="operatePropertysOptionFormVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="addPropertysOptinoSubmit" :loading="addLoading">提交</el-button>-->
        <!--</div>-->
        <!--</el-dialog>-->
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';

    export default {
        data() {
            return {

                //树节点搜索输入框
                filterText: '',
                DATA: null,
                NODE: null,
                iconShow: false,
                inputVisible: false,
                //记录被删除元素
                CardDelArr: [],
                test: [],
                tree: {},
                //双击显示隐藏选项标志位
                flag: false,
                //存放商品类别信息
                productTypes: [],
                viewPropertiesLength: 0,
                skuPropertiesLength: 0,
                //存放类别对应属性信息
                properties: [],
                //存放显示属性信息
                viewProperties: [],
                //存放准备删除的显示属性数组
                delCardArr: [],
                //存放准备删除的sku属性数组
                delSkuCardArr: [],
                //显示属性删除信息图标显示与否标志
                delInfoShow: false,
                //sku属性
                delSkuInfoShow: false,
                //保存修改按钮是否显示标志
                saveViewChangeShow: false,
                saveSkuChangeShow: false,
                addViewProperties: [],
                //存放sku属性信息
                skuProperties: [],
                //默认展开的面板
                propertiesAddCollapse: ['0'],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                //属性操作按钮是否显示
                mouseHover: false,
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
            //树节点搜索过滤
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //输入内容后检测输入数据
            checkInput(flag, index) {
                if (flag === 1) {
                    //sku检测
                    //显示检测
                    if (!this.skuProperties[index].name) {
                        this.$notify.warning({
                            title: '警告',
                            message: '属性不能为空'
                        });
                        this.saveSkuChangeShow = false;
                    }else {
                        //显示修改按钮
                        this.saveSkuChangeShow = true;
                    }
                } else {
                    //显示检测
                    if (!this.viewProperties[index].name) {
                        this.$notify.warning({
                            title: '警告',
                            message: '属性不能为空'
                        });
                        this.saveViewChangeShow = false;
                    }else {


                        //显示修改按钮
                        this.saveViewChangeShow = true;
                    }

                }
            },
            //清空待删除属性数组即执行删除操作
            cleanDelArr() {
                this.$confirm('确认进行删除操作?将无法恢复！', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = this.CardDelArr.toString();
                    this.$http.delete("/services/product/specification/delete?ids=" + para)
                        .then(({data}) => {
                            this.listLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getPropertys();
                            //操作完成清空记录删除数据数组
                            this.CardDelArr = [];
                            this.delCardArr = [];
                            this.delSkuCardArr = [];
                            this.delInfoShow = false;
                            this.delSkuInfoShow = false;
                            this.saveViewChangeShow = false;
                            this.saveSkuChangeShow = false;
                        });
                });
            },
            //保存sku
            changeSkuSubmit() {
                this.$confirm('确认保存修改?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = Object.assign(this.skuProperties);
                    this.$http.post("/services/product/specification/save", para)
                        .then(({data}) => {
                            this.listLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.skuProperties.push(para);
                        });
                });
            },
            //输入后弹出保存提示
            changeSubmit(flag) {
                //0表示保存显示属性
                //1表示保存sku属性
                this.$confirm('确认保存修改?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //
                    let arr = [];
                    let len = this.viewProperties.length - this.viewPropertiesLength;

                    let arrSku = [];
                    let lenSku = this.skuProperties.length - this.skuPropertiesLength;


                    if (len > 0 && flag === 0) {
                        //新增显示属性
                        for (let i = 0; i < len; i++) {
                            arr.push(this.viewProperties.pop());
                        }
                        //NProgress.start();
                        let para = Object.assign(arr);
                        this.$http.post("/services/product/specification/save", para)
                            .then(({data}) => {
                                this.listLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.viewProperties.push(para);
                            });
                    } else if (len > 0 && flag === 1) {
                        //新增sku属性
                        this.$confirm('确认保存修改?', '提示', {
                            type: 'warning'
                        }).then(() => {
                            for (let i = 0; i < lenSku; i++) {
                                arrSku.push(this.skuProperties.pop());
                            }
                            //NProgress.start();
                            let para = Object.assign(arrSku);
                            this.listLoading = true;
                            this.$http.post("/services/product/specification/save", para)
                                .then(({data}) => {
                                    this.listLoading = false;
                                    //NProgress.done();
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.skuProperties.push(para);
                                });
                        });
                    }
                })
            },
            //单击添加属性
            handleAddViewPropertie() {

                this.viewProperties.push({
                    id: null,
                    name: '',
                    isSku: 0,
                    productTypeId: this.DATA.data.id,
                    isDeleted: 0,
                    selectValue: null,
                    skuValues: []
                })
            },
            //单击添加sku属性
            handleAddSkuPropertie() {
                this.skuProperties.push({
                    id: null,
                    name: '',
                    isSku: 1,
                    productTypeId: this.DATA.data.id,
                    isDeleted: 0,
                    selectValue: null,
                    skuValues: []
                })
            },
            //
            handleViewCardEditBtnClick(index) {
                this.inputShow = true;
            },
            //恢复删除数据
            reBackCard(flag, index, row) {
                if (flag === 1) {
                    //sku
                    this.skuProperties.push(row);
                    this.delSkuCardArr.splice(index, 1);
                    this.CardDelArr.splice(index,1);

                    //当已选择要删除属性列表为空时隐藏按钮
                    if (this.delSkuCardArr.length === 0) {
                        this.delSkuInfoShow = false;
                    }
                } else {
                    //显示
                    this.viewProperties.push(row);
                    this.delCardArr.splice(index, 1);
                    this.CardDelArr.splice(index,1);
                    //当已选择要删除属性列表为空时隐藏按钮
                    if (this.delCardArr.length === 0) {
                        this.delInfoShow = false;
                    }
                }

            },
            handleViewCardDelBtnClick(index, row) {
                if(row.name && row.id) {
                    //当输入框中有值并且是原有属性时才进入回收站，否则直接丢弃
                    //记录删除卡片数据
                    this.CardDelArr.push(row.id);
                    this.viewProperties.splice(index, 1);
                    //记录备删除数据
                    this.delCardArr.push(row);
                    this.delInfoShow = true;

                }else {
                    this.viewProperties.splice(index, 1);
                }
                //当删除按钮出现之后隐藏保存按钮
                this.saveViewChangeShow = false;

            },
            handleSkuCardDelBtnClick(index, row) {
                if(row.name && row.id) {
                    //当输入框中有值并且是原有属性时才进入回收站，否则直接丢弃
                    //记录删除卡片数据
                    this.CardDelArr.push(row.id);
                    this.skuProperties.splice(index, 1)
                    //记录备删除数据
                    this.delSkuCardArr.push(row);
                    this.delSkuInfoShow = true;
                }else {
                    this.skuProperties.splice(index, 1)
                }
                //当删除按钮出现之后隐藏保存按钮
                this.saveSkuChangeShow = false;
            },
            //鼠标悬浮属性卡片事件
            handleMouseIn() {
                this.mouseHover = true;
            },
            //鼠标移出卡片事件
            handleMouseOut() {
                this.mouseHover = false;
            },
            //左键单击节点事件：
            leftClick(event, object, value, element) {
                //判断被单击节点是否为叶子节点
                let child = object.data.children;
                if (child === null) {
                    this.operatePropertysFormVisible = true;
                    //根据单击节点获取其已有的显示属性
                    let productTypeId = object.data.id;

                    this.DATA = object;
                    //显示属性
                    this.$http.get("/services/product/specification/viewList/" + productTypeId)
                        .then(({data}) => {
                            this.viewProperties = data;
                            //记录属性长度
                            this.viewPropertiesLength = this.viewProperties.length;
                        });
                    //sku属性
                    this.$http.get("/services/product/specification/skuList/" + productTypeId)
                        .then(({data}) => {
                            this.skuProperties = data;
                            //记录属性长度
                            this.skuPropertiesLength = this.skuProperties.length;
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
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        }
    }

</script>

<style scoped>

    .card .change-status {
        display: none;
    }

    .card .change-input {
        width: 100%;
    }

    .card:hover .change-status {
        display: block;
    }

    .card:hover .change-input {
        width: 60%;
    }


    .el-icon-edit:hover {
        cursor: pointer;
    }
</style>