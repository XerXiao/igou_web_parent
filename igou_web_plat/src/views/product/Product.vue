<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input
                            placeholder="请输入名称"
                            v-model="filters.keyword"
                            clearable>
                    </el-input>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getProducts">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAddEdit(-1,null)">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="商品名" width="120" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="subName" label="副名称" width="100" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="productType.name" label="商品分类" width="120" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="brand.name" label="商品品牌" width="120" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="code" label="编码" width="120" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="maxPrice" label="最高价" width="100" sortable>
            </el-table-column>
            <el-table-column prop="minPrice" label="最低价" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="saleCount" label="销量" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="viewCount" label="浏览量" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="120" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="commentCount" label="评论数" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="commentScore" label="评分" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="productType.path" label="路径" min-width="120" :formatter="pathFormatter">
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template scope="scope">
                    <el-button size="small" @click="handleAddEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog title="操作" v-model="operateFormVisible" :close-on-click-modal="false">
            <el-form :model="operateForm" label-width="80px" :rules="operateFormRules" ref="operateForm">
                <input type="hidden" name="id" v-model="operateForm.id"/>
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="operateForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="副名称">
                    <el-input v-model="operateForm.subName" auto-complete="off"></el-input>
                    <!--<el-radio-group v-model="operateForm.subName">-->
                    <!--<el-radio class="radio" :label="1">男</el-radio>-->
                    <!--<el-radio class="radio" :label="0">女</el-radio>-->
                    <!--</el-radio-group>-->
                </el-form-item>
                <el-form-item label="商品编码">
                    <el-input v-model="operateForm.code" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品类别">
                    <div class="block">
                        <el-cascader
                                placeholder="请选择或输入"
                                :options="productTypes"
                                :props="productsProps"
                                filterable
                                v-model="operateForm.path"></el-cascader>
                    </div>
                </el-form-item>
                <el-form-item label="商品品牌">
                    <div class="block">
                        <el-cascader
                                placeholder="请选择或输入"
                                filterable
                                :options="brands"
                                :props="brandProps"
                                v-model="operateForm.brandId"
                        ></el-cascader>
                    </div>
                </el-form-item>

                <el-form-item label="上架时间">
                    <div class="block">
                        <el-date-picker
                                v-model="operateForm.onSaleTime"
                                type="datetime"
                                @change="getOnSaleTime"
                                placeholder="选择上架时间">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="下架时间">
                    <div class="block">
                        <el-date-picker
                                v-model="operateForm.offSaleTime"
                                type="datetime"
                                @change="getOffSaleTime"
                                placeholder="选择下架时间">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <!--<el-form-item label="生日">-->
                <!--<el-date-picker type="date" placeholder="选择日期" v-model="operateForm.birth"></el-date-picker>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="地址">-->
                <!--<el-input type="textarea" v-model="operateForm.addr"></el-input>-->
                <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="operateFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="operateSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getProductListPage, removeProduct, batchRemoveProduct, editProduct, addProduct} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    keyword: ''
                },
                products: [],
                productTypes: [],
                productsProps: {
                    value : 'id',
                    label: 'name',
                    children : 'children'
                },
                brands : [],
                brandProps : {
                    value : 'id',
                    label : 'name'
                },
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                operateFormVisible: false,//新增界面是否显示
                addLoading: false,
                operateFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //操作界面数据
                operateForm: {
                    id : '',
                    name: '',
                    subName: '',
                    code: '',
                    path: [],
                    brandId: '',
                    onSaleTime: '',
                    offSaleTime: ''
                }

            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getProducts();
            },
            //获取数据列表
            getProducts() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                this.listLoading = true;
                //NProgress.start();
                this.$http.post("/services/product/product/json", para)
                    .then(({data}) => {
                        this.total = data.total;
                        this.products = data.rows;

                        this.listLoading = false;
                        //NProgress.done();
                    });
                // getUserListPage(para).then((res) => {
                // 	this.total = res.data.total;
                // 	this.users = res.data.users;
                // 	this.listLoading = false;
                // 	//NProgress.done();
                // });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let id = row.id;
                    removeProduct(id).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getProducts();
                    });
                }).catch(() => {

                });
            },
            //显示操作界面
            handleAddEdit: function (index,row) {

                //index为编辑时传入的行号，从零开始，新增时我传入-1来区分操作
                if(index != -1) {
                    //编辑操作，回显数据
                    this.getProductTypes();
                    this.getBrands();
                    //级联回显处理
                    var path = row.productType.path;
                    var arr = [];
                    arr = path.split(".").splice(1,3);
                    for(let i = 0;i<arr.length;i++) {
                        arr[i] = parseInt(arr[i]);
                    }
                    this.operateForm = Object.assign({}, row);
                    this.operateForm.path = arr;
                }else {
                    //新增操作
                    this.operateForm = {
                        id : null,
                        name: '',
                        subName: '',
                        code: '',
                        path: '',
                        brandId: '',
                        onSaleTime: '',
                        offSaleTime: ''
                    };
                }
                this.operateFormVisible = true;
            },
            //新增或者编辑
            operateSubmit: function () {
                this.$refs.operateForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            this.operateForm.productTypeId = this.operateForm.productTypeId.pop();
                            let para = Object.assign({}, this.operateForm);
                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            //后台根据id是否为null判断选择操作
                                this.$http.post("/services/product/product/save",para).then((res) => {
                                    this.addLoading = false;
                                    //NProgress.done();
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['operateForm'].resetFields();
                                    this.operateFormVisible = false;
                                    this.getProducts();
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
                    batchRemoveProduct(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getProducts();
                    });
                }).catch(() => {

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
            //获取所有品牌
            getBrands : function () {
                this.$http.get("/services/product/brand/treeData")
                    .then(({data}) => {
                        if(data != null) {
                            this.brands = data;
                        }
                })
            },
            //时间格式化
            getOnSaleTime(val) {
                this.operateForm.onSaleTime =val;
            },
            //时间格式化
            getOffSaleTime(val) {
                this.operateForm.offSaleTime =val;
            },
            pathFormatter(row, column, cellValue, index) {
                var arr = [];
                arr = cellValue.split(".").splice(1,3);
                for (let a of arr) {
                    parseInt(a);
                }
                return arr;
            }
        },
        mounted() {
            this.getProducts();
            this.getProductTypes();
            this.getBrands();
        }
    }

</script>

<style scoped>

</style>