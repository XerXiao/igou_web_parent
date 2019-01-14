<template>
    <section>
        <div style="padding-top: 20px;">
            <el-row :gutter="20">
                <el-col :span="6">
                    <!--<el-tree-->
                            <!--style="height: 580px;overflow: scroll;overflow-x:hidden"-->
                            <!--:data="productTypes"-->
                            <!--show-checkbox-->
                            <!--node-key="id"-->
                            <!--:props="defaultProps"-->
                            <!--@node-click="rightClick"-->
                            <!--@node-contextmenu="rightClick"-->
                    <!--&gt;-->
                    <!--</el-tree>-->
                    <!--ref="SlotMenuList"-->
                    <el-tree
                            style="height: 580px;overflow: scroll;overflow-x:hidden"
                            :data="productTypes"
                            :props="defaultProps"
                            node-key="id"
                            @node-contextmenu='rightClick'
                            accordion
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
                                <span slot="title">添加分类</span>
                            </el-menu-item>
                            <el-menu-item index="2" class="menuItem">
                                <span slot="title">修改分类</span>
                            </el-menu-item>
                            <el-menu-item index="3" class="menuItem">
                                <span slot="title">删除分类</span>
                            </el-menu-item>
                            <hr style="color: #ffffff">
                            <el-menu-item index="4" class="menuItem">
                                <span slot="title">添加标签</span>
                            </el-menu-item>
                        </el-menu>
                    </div>
                </el-col>


                <el-col :span="18">
                    <div style="border: 1px solid lightgray;border-radius: 8px;padding: 30px;padding-top: 40px;">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="活动名称">
                                <el-input></el-input>
                            </el-form-item>
                            <el-form-item label="活动区域">
                                <el-select placeholder="请选择活动区域">
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="活动时间">
                                <el-col :span="11">
                                    <el-date-picker type="date" placeholder="选择日期"
                                                    style="width: 100%;"></el-date-picker>
                                </el-col>
                                <el-col class="line" :span="2">-</el-col>
                                <el-col :span="11">
                                    <el-time-picker type="fixed-time" placeholder="选择时间"
                                                    style="width: 100%;"></el-time-picker>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="即时配送">
                                <el-switch></el-switch>
                            </el-form-item>
                            <el-form-item label="活动性质">
                                <el-checkbox-group v-model="form.type">
                                    <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                                    <el-checkbox label="地推活动" name="type"></el-checkbox>
                                    <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                                    <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="特殊资源">
                                <el-radio-group>
                                    <el-radio label="线上品牌商赞助"></el-radio>
                                    <el-radio label="线下场地免费"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="活动形式">
                                <el-input type="textarea" v-model="form.desc"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                menuVisible: false,
                productTypes: [],
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    value: 'id'
                }
            }
        },
        methods: {
            getDataTrees(){
                this.$http.get("/services/product/productType/treeData")
                    .then(({data})=>{
                        this.productTypes = data;
                    })
            },
            rightClick(){
                console.debug("in")
                event.preventDefault();
                this.menuVisible = !this.menuVisible;
            },
            append(data) {

            },
            remove(data){

            },
            onSubmit() {

            }
        },
        mounted() {
            this.getDataTrees();
        }
    }

</script>

<style scoped>

</style>