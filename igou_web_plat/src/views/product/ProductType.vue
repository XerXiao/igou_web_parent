<template>
    <section>
        <div style="padding-top: 20px;">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-tree
                            style="height: 580px;overflow: scroll;overflow-x:hidden"
                            :data="productTypes"
                            node-key="id"
                            :props="defaultProps"
                            @node-contextmenu="rightClick"
                            @node-click="leftClick"
                    >

                    </el-tree>
                    <!--鼠标右键点击出现页面-->
                    <div v-show="menuVisible">
                        <el-menu
                                id = "rightClickMenu"
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
                         v-show= "editDivVisible"
                    >
                        <el-form ref="form"
                                 :model="form"
                                 label-width="80px"
                        >
                            <el-form-item label="分类名称" prop="name">
                                <el-input v-model="form.name" placeholder="请输入分类名"></el-input>
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
                                <el-input type="textarea"  :rows="2" v-model="form.description"></el-input>
                            </el-form-item>
                            <el-form-item label="排序" >
                                <el-input v-model="form.sortIndex" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">提交</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>

            </el-row>
            <!--编辑界面-->
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
                DATA:null,
                NODE:null,
                addLoading: false,
                form: {
                    name: '',
                    description: '',
                    sortIndex: '',
                    logo: ''
                },
                editDivVisible:false,
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
                document.addEventListener('click',(e)=>{
                    this.menuVisible = false;
                })
                let menu = document.querySelector("#rightClickMenu");
                /* 菜单定位基于鼠标点击位置 */
                menu.style.left = event.clientX -230 + "px";
                menu.style.top = event.clientY - 120 + "px";
                menu.style.position = "absolute"; // 为新创建的DIV指定绝对定位
                menu.style.width = 160 + "px";
                /*console.log("右键被点击的左侧:",menu.style.left);
                  console.log("右键被点击的顶部:",menu.style.top);*/
                //        console.log("右键被点击的event:",event);
                // console.log("右键被点击的object:", object);
                // console.log("右键被点击的value:", value);
                // console.log("右键被点击的element:", element);
            },
            leftClick() {
                //判断菜单是否为显式状态
                if(this.menuVisible) {
                    this.menuVisible = !this.menuVisible;
                }
            },
            append(data) {

            },
            //删除节点
            handleDel: function (obj) {
                //先判断该节点是否含有子节点
                if(obj.children == null || obj.children.length == 0) {
                    this.$confirm('确认删除该节点吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        //NProgress.start();
                        this.$http.delete("/services/product/productType/delete/"+obj.id).then((res) => {
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
                }else {
                    this.$confirm('该节点含有子节点?', '提示', {
                        type: 'warning'
                    })
                }




            },
            //提交操作
            onSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.form);
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            //后台根据id是否为null判断选择操作
                            this.$http.post("/services/product/productType/save",para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['operateForm'].resetFields();
                                this.editDivVisible = false;
                                this.getDataTrees();
                            }).catch(()=>{
                                this.$message({
                                    message: '提交异常',
                                    type: 'error'
                                });
                                this.editDivVisible = false;
                                this.getDataTrees();
                            });
                        });
                    }
                });
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
                        }
                        this.editDivVisible = true;
                        break;
                    case '2':
                        //修改分类
                        let obj = this.DATA;
                        this.form = {
                            name: obj.name,
                            description: obj.description,
                            sortIndex: obj.sortIndex,
                            logo: obj.logo
                        }
                        this.editDivVisible = true;
                        break;
                    case '3':
                        //删除分类
                        let node = this.DATA;
                        this.handleDel(node);
                        break;
                    case '4':
                        //添加子标签
                        break;
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
    .el-menu-vertical{
        border: 3px solid rgb(84, 92, 100);
        border-radius: 10px;
        position: absolute;
        z-index: 9999;
    }
    .el-menu-vertical i{
        color: #777777;
    }
    .menuItem{
        height: 40px;
        line-height: 40px;
        background-color: #545c64;
        font-size: 1.2rem;
    }
    .menuItem:hover{
        background-color: #409EFF;
    }

</style>