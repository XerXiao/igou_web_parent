<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="poperateing-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="请输入名称" clearable=""></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getBrands">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAddEdit(-1,null)">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="brands" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="80" label="编号">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="englishName" label="英文名称" width="140" sortable>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="180" sortable>
            </el-table-column>
            <el-table-column prop="productType.name" label="类别" min-width="140" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable>
            </el-table-column>
            <el-table-column prop="logo" label="logo" min-width="180" sortable>
                <template slot-scope="scope">
                    <img    style="width: 60px"
                            :src="scope.row.logo !== null ?
                        'http://119.23.246.140'+JSON.parse(scope.row.logo.substring(1,scope.row.logo.length-1)).url : 'none'">
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleAddEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :total="total"
                           style="float:right;">
            </el-pagination>
        </el-col>

        <!--操作界面-->
        <el-dialog title="操作" :visible.sync="operateFormVisible" :close-on-click-modal="false">
            <el-form :model="operateForm" label-width="80px" :rules="operateFormRules" ref="operateForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="operateForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="englishName">
                    <el-input v-model="operateForm.englishName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品类别">
                    <div class="block">
                        <el-cascader
                                placeholder="请选择或输入"
                                :options="productTypes"
                                :props="productsProps"
                                change-on-select
                                filterable
                                v-model="operateForm.path"
                                size="medium"
                                style="width: 50%"
                        ></el-cascader>
                    </div>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input type="textarea" :rows="2" v-model="operateForm.description"></el-input>
                </el-form-item>

                <el-form-item label="排序">
                    <el-input v-model="operateForm.sortIndex" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Logo">
                    <el-upload
                            class="upload-demo"
                            action="http://127.0.0.1:9527/services/common/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="fileList2"
                            :on-success="getUrl"
                            list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="operateFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="operateSubmit" :loading="operateLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {batchRemoveBrand} from '../../api/api';

    export default {
        data() {
            return {
                tip :false,
                filters: {
                    keyword: ''
                },
                brands: [],
                productTypes: [],
                productsProps: {
                    value: 'id',
                    label: 'name',
                    children: 'children'
                },
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                fileList2: [],
                fileObj:[],
                operateFormVisible: false,//操作界面是否显示
                operateLoading: false,
                operateFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //操作界面数据
                operateForm: {
                    name: '',
                    sortIndex: '',
                    englishName: '',
                    productTypeId: 0,
                    logo: '',
                    path: [],
                    description: ''
                }

            }
        },
        methods: {
            handleRemove(file, fileList) {
                //请求后台删除文件
                let str = file.response.resultObject;
                this.$http.delete("/services/common/delete?filePath="+str)
                    .then(({data})=> {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.operateForm.logo = '';
                    }).catch(() => {
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                })
            },
            handlePreview(file) {
                console.log(file);
            },
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getBrands();
            },
            //获取品牌列表
            getBrands() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                this.listLoading = true;
                //NProgress.start();
                this.$http.post("/services/product/brand/json", para)
                    .then(({data}) => {
                        this.total = data.total;
                        this.brands = data.rows;
                        this.listLoading = false;
                        //NProgress.done();
                    });
            },
            //获取所有品牌
            getProductTypes: function () {
                this.$http.get("/services/product/productType/treeData")
                    .then(({data}) => {
                        if (data != null) {
                            this.productTypes = data;
                        }
                    })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    this.$http.delete("/services/product/brand/delete/" + row.id).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getBrands();
                    });
                }).catch(() => {

                });
            },
            //显示操作界面
            handleAddEdit: function (index, row) {
                //index为编辑时传入的行号，从零开始，新增时我传入-1来区分操作
                //编辑操作，回显数据
                this.getProductTypes();
                this.getBrands();
                if (index != -1) {
                    //先清空预览列表
                    this.fileList2 = [];
                    //级联回显处理
                    var path = row.productType.path;
                    //照片回显
                    this.photoFeed(row);
                    var arr = [];
                    arr = path.split(".").splice(1, 3);
                    for (let i = 0; i < arr.length; i++) {
                        arr[i] = parseInt(arr[i]);
                    }
                    this.operateForm = Object.assign({}, row);
                    this.operateForm.path = arr;
                } else {
                    this.fileList2 = [];
                    //新增操作;
                    this.operateForm = {
                        id: null,
                        name: '',
                        englishName: '',
                        productTypeId: 0,
                        path: [],
                        logo: '',
                        description: ''
                    };

                }
                this.operateFormVisible = true;
            },
            //新增或者编辑
            operateSubmit: function () {
                this.$refs.operateForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.operateLoading = true;
                            //NProgress.start();
                            this.operateForm.productTypeId = this.operateForm.path.pop();
                            let para = Object.assign({}, this.operateForm);
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            //后台根据id是否为null判断选择操作
                            this.$http.post("/services/product/brand/save", para).then((res) => {
                                this.operateLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['operateForm'].resetFields();
                                this.operateFormVisible = false;
                                this.getBrands();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
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
                    batchRemoveBrand(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getBrands();
                    });
                }).catch(() => {

                });
            },
            //上传成功回调
            getUrl(response, file, fileList) {
                this.fileObj.push({
                    "name" : file.name,
                    "url" : response.resultObject
                });

                this.operateForm.logo = JSON.stringify(this.fileObj);
            },
            photoFeed(row){
                try {
                    let lo = JSON.parse(row.logo);
                    for (let i = 0; i<lo.length;i++) {
                        lo[i].url = "http://119.23.246.140"+lo[i].url;
                        this.fileList2.push(lo[i])
                    }
                }catch(err) {
                    return false;
                }

            }
        },
        mounted() {
            this.getBrands();
            this.getProductTypes();
        }
    }

</script>

<style scoped>

</style>