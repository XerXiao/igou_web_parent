<template>
    <section>
        <div style="padding-top: 20px;">
            <el-row :gutter="20">
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
                    <!--鼠标右键点击出现页面-->
                    <div v-show="menuVisible">
                        <el-menu
                                id="rightClickMenu"
                                class="el-menu-vertical"
                                @select="handleRightSelect"
                                active-text-color="#fff"
                                text-color="#fff">
                            <el-menu-item index="1" class="menuItem">
                                <span slot="title">添加标签</span>
                            </el-menu-item>
                            <el-menu-item index="2" class="menuItem">
                                <span slot="title">修改标签</span>
                            </el-menu-item>
                            <el-menu-item index="3" class="menuItem">
                                <span slot="title">删除标签</span>
                            </el-menu-item>
                            <el-menu-item index="4" class="menuItem">
                                <span slot="title">添加子标签</span>
                            </el-menu-item>
                        </el-menu>
                    </div>
                </el-col>


                <el-col :span="18">
                    <div style="border: 1px solid lightgray;border-radius: 8px;padding: 30px;padding-top: 40px;"
                         v-show="editDivVisible"
                    >
                        <el-form ref="form"
                                 :model="form"
                                 label-width="80px"
                        >
                            <el-form-item label="分类名称" prop="name">
                                <el-input :disabled="inputDisabled" v-model="form.name" placeholder="请输入分类名"></el-input>
                            </el-form-item>
                            <el-form-item label="Logo">
                                <el-upload
                                        class="upload-demo"
                                        drag
                                        v-model="form.logo"
                                        action="https://jsonplaceholder.typicode.com/posts/"

                                        multiple>
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="描述" prop="description">
                                <el-input type="textarea" :rows="2" v-model="form.description"></el-input>
                            </el-form-item>
                            <el-form-item label="排序">
                                <el-input v-model="form.sortIndex" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="subFatherForm">提交</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <!--添加子标签-->
                    <div style="border: 1px solid lightgray;border-radius: 8px;padding: 30px;padding-top: 40px;"
                         v-show="subAddDivVisible"
                    >
                        <el-form :model="subForm" ref="subForm" label-width="100px"
                                 class="demo-dynamic">
                            <el-form-item label="分类名称" prop="name">
                                <el-input :disabled="true" v-model="this.subForm.name"
                                          placeholder="请输入分类名"></el-input>
                            </el-form-item>
                            <!--折叠效果-->
                            <el-collapse v-model="subAddCollapse" @change="handleChange">
                                <el-row v-for="(sub,index) in subForm.children"
                                >
                                    <el-col :span="22">
                                        <el-collapse-item
                                                :key="sub.key"
                                                :title="'子标签'+index"
                                                :prop="'sub.' + index + '.value'"

                                        >
                                            <el-form-item label="子分类名" prop="name_sub"

                                            >
                                                <el-input v-model="sub.name" placeholder="请输入子分类名"></el-input>
                                            </el-form-item>
                                            <el-form-item label="描述" prop="description">
                                                <el-input type="textarea" :rows="2"
                                                          v-model="sub.description"></el-input>
                                            </el-form-item>
                                            <el-form-item label="排序">
                                                <el-input v-model="sub.sortIndex" auto-complete="off"></el-input>
                                            </el-form-item>
                                        </el-collapse-item>
                                    </el-col>
                                    <el-col :span="2" style="line-height: 40px">
                                        <el-button @click.prevent="removeDomain(sub)">删除</el-button>
                                    </el-col>

                                </el-row>


                            </el-collapse>
                            <el-form-item>
                                <el-button type="primary" @click="submitSubForm">提交</el-button>
                                <el-button @click="addDomain">新增子标签</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>

            </el-row>
        </div>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';

    export default {
        data() {
            return {
                DATA: null,
                NODE: null,
                //判断是否需要添加自己节点
                flag: true,
                tree: {},
                //父级id数据
                parentIds: [],
                addLoading: false,
                collapseName: '子标签',
                inputDisabled: false,
                //默认展开
                subAddCollapse: ['0'],
                form: {
                    id: '',
                    name: '',
                    description: '',
                    sortIndex: '',
                    logo: '',
                    path: []
                },
                editDivVisible: false,
                //添加子标签
                subAddDivVisible: false,
                menuVisible: false,
                productTypes: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                FormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                subForm: {
                    children: [{
                        name: '',
                        description: '',
                        sortIndex: '',
                        path: ''
                    }],
                    id: '',
                    name: ''
                }
            }
        },
        methods: {
            getDataTrees() {
                this.$http.get("/services/product/productType/treeData")
                    .then(({data}) => {
                        this.productTypes = data;
                    })
            },
            rightClick(event, object, value, element) {
                if (this.objectID !== object.id) {
                    this.objectID = object.id;
                    this.menuVisible = true;
                    this.DATA = object;

                    this.NODE = value;
                } else {
                    this.menuVisible = !this.menuVisible;
                }
                let menu = document.querySelector("#rightClickMenu");
                /* 菜单定位基于鼠标点击位置 */
                menu.style.left = event.clientX - 230 + "px";
                menu.style.top = event.clientY - 120 + "px";
                menu.style.position = "absolute"; // 为新创建的DIV指定绝对定位
                menu.style.width = 160 + "px";
            },
            leftClick(event, object, value, element) {

                //判断菜单是否为显式状态
                if (this.menuVisible) {
                    this.menuVisible = !this.menuVisible;
                }
            },
            append(data) {

            },
            //删除节点
            handleDel: function (obj) {
                //先判断该节点是否含有子节点
                if (obj.children == null || obj.children.length == 0) {
                    this.$confirm('确认删除该节点吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        //NProgress.start();.
                        this.$http.delete("/services/product/productType/delete/" + obj.id).then((res) => {
                            this.listLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });

                            this.editDivVisible = false;
                            this.getDataTrees();
                        });
                    }).catch(() => {
                        this.$message({
                            message: '提交异常',
                            type: 'error'
                        });
                        this.editDivVisible = false;
                        this.getDataTrees();
                    });
                } else {
                    this.$confirm('该节点含有子节点?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let current = this.$refs.tree.getCurrentNode().id
                        let nodes = this.$refs.tree.getCheckedNodes(true);
                        let nodesIds = [];
                        for (let i = 0; i < nodes.length; i++) {
                            if (nodes[i].id) {
                                nodesIds.push(nodes[i].id)
                            }
                        }
                        nodesIds.push(current);
                        console.debug(nodesIds)
                        let ids = nodesIds.toString();
                        this.$http.delete("/services/product/productType/deleteBatch?ids=" + ids).then((res) => {
                            this.listLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.editDivVisible = false;
                            this.getDataTrees();
                        });
                    });

                }


            },
            handleRightSelect(key) {
                //传入key为菜单选项排序id
                /**
                 * 1为添加分类
                 * 2为修改分类
                 * 3为删除分类
                 * 4为添加子标签
                 */
                //显示修改form
                switch (key) {
                    case '1':
                        //添加分类
                        this.form = {
                            name: '',
                            description: '',
                            sortIndex: '',
                            logo: ''
                        };
                        //清除父id
                        this.parentIds = [];
                        this.editDivVisible = true;
                        this.subAddDivVisible = false;
                        break;
                    case '2':
                        //修改分类
                        let obj = this.DATA;
                        this.form = {
                            id: obj.id,
                            name: obj.name,
                            description: obj.description,
                            sortIndex: obj.sortIndex,
                            logo: obj.logo
                        };
                        this.editDivVisible = true;

                        break;
                    case '3':
                        //删除分类
                        let node = this.DATA;
                        this.handleDel(node);
                        break;
                    case '4':
                        //添加子标签
                        //打开编辑界面，禁用父类标签编辑
                        //修改分类
                        console.debug("in this")
                        var nodeObj = this.DATA;
                        this.subForm = {
                            name: nodeObj.name,
                            children: [{
                                name: '',
                                description: '',
                                sortIndex: '',
                                pid: nodeObj.id,
                                path: nodeObj.path
                            }]
                        };
                        this.editDivVisible = false;
                        this.subAddDivVisible = true;
                        break;
                }
            },
            //面板变化处理
            handleChange(val) {
            },
            removeSub(item) {
                var index = this.subForm.children.indexOf(item);
                if (index !== -1) {
                    this.subForm.children.splice(index, 1)
                }
            },
            addSub() {
                this.subForm.children.push({
                    name_sub: '',
                    description: '',
                    sortIndex: '',
                    key: Date.now()
                });
            },
            //提交保存子标签
            submitSubForm() {
                this.$refs.subForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = this.subForm.children;
                            this.$http.post("/services/product/productType/saveBatch", para).then((res) => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.getDataTrees();
                                this.subAddDivVisible = false;
                            });
                        });
                    }
                });
            },
            //提交父级分类
            subFatherForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.form);
                            this.$http.post("/services/product/productType/save", para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.getDataTrees();
                                this.editDivVisible = false;
                            });
                        });
                    }
                });
            },
            resetForm() {
                this.$refs.subForm.resetFields();
            },
            removeDomain(item) {
                var index = this.subForm.children.indexOf(item)
                if (index !== -1) {
                    this.subForm.children.splice(index, 1)
                }
            },
            addDomain() {
                this.subForm.children.push({
                    name: '',
                    description: '',
                    sortIndex: '',
                    pid: this.DATA.id,
                    path: this.DATA.path
                });
            },
            appendPids(object) {
                console.debug("in here")
                try {
                    if (object.id != null) {
                        this.parentIds.push(object.id);
                    }
                    this.appendPids(this.$refs.tree.getNode(object).parent.data);
                } catch (e) {
                    return false;
                }

            }
        },
        mounted() {
            this.getDataTrees();
        }
    }

</script>

<style scoped>
    /*************************标签鼠标右击页面样式******************************/
    .el-menu-vertical {
        border: 3px solid rgb(84, 92, 100);
        border-radius: 10px;
        position: absolute;
        z-index: 9999;
    }

    .el-menu-vertical i {
        color: #777777;
    }

    .menuItem {
        height: 40px;
        line-height: 40px;
        background-color: #545c64;
        font-size: 1.2rem;
    }

    .menuItem:hover {
        background-color: #409EFF;
    }

</style>