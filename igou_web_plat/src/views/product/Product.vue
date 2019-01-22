<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input
                            placeholder="请输入名称"
                            v-model="filters.keyword"
                            prefix-icon="el-icon-search"
                            clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getProducts">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAddEdit(-1,null)">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="configViewProperties">配置显示属性</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="configSkuProperties">配置Sku属性</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="products"
                  highlight-current-row v-loading="listLoading"
                  @selection-change="selsChange"
                  @row-click="handleRowClick"
                  @select="handleRowSelect"
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
            <el-table-column prop="minPrice" label="最低价" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="state" label="状态" min-width="100" sortable>
                <template slot-scope="scope">
                    <el-tag
                            :type="scope.row.state === 1 ? 'primary' : 'warning'"
                            disable-transitions>{{scope.row.state === 1 ? '已上架':'未上架'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="viewCount" label="浏览量" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="120" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="commentCount" label="评论数" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="commentScore" label="评分" min-width="100" sortable>
            </el-table-column>
            <el-table-column label="操作" width="230" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="small"
                               @click="handleOnSaleOrOffSingle(scope.$index, scope.row)"
                               :disabled="sels.length > 1"
                    >
                        {{scope.row.state === 1 ? '下架':'上架'}}
                    </el-button>
                    <el-button size="small" @click="handleAddEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-button type="primary" @click="onSale" :disabled="this.sels.length===0">批量上架</el-button>
            <el-button type="primary" @click="offSale" :disabled="this.sels.length===0">批量下架</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog title="操作"
                   :visible.sync="operateFormVisible"
                   :close-on-click-modal="false"
        >
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
                                v-model="operateForm.path"
                                size="medium"
                                style="width: 50%"
                        ></el-cascader>
                    </div>
                </el-form-item>
                <el-form-item label="商品品牌">
                    <div class="block">
                        <el-select
                                v-model="operateForm.brandId"
                                clearable placeholder="请选择"
                        >
                            <el-option
                                    v-for="item in brands"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>

                    </div>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :rows="2"
                              v-model="operateForm.productExt.description"></el-input>
                </el-form-item>
                <el-form-item label="商品详情">
                    <!--<template>-->
                    <!--<vue-wangeditor ref="editor" id="editor"-->
                    <!--v-model="operateForm.productExt.richContent"></vue-wangeditor>-->
                    <!--</template>-->

                    <template>
                        <quill-editor
                                v-model="operateForm.productExt.richContent"
                                ref="myQuillEditor"
                                :options="editorOption"
                                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                                @change="onEditorChange($event)">
                        </quill-editor>
                    </template>


                </el-form-item>

                <!--<el-form-item label=" 上架时间
                        ">-->
                <!--<div class="block">-->
                <!--<el-date-picker-->
                <!--v-model="operateForm.onSaleTime"-->
                <!--type="datetime"-->
                <!--@change="getOnSaleTime"-->
                <!--placeholder="选择上架时间">-->
                <!--</el-date-picker>-->
                <!--</div>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="下架时间">-->
                <!--<div class="block">-->
                <!--<el-date-picker-->
                <!--v-model="operateForm.offSaleTime"-->
                <!--type="datetime"-->
                <!--@change="getOffSaleTime"-->
                <!--placeholder="选择下架时间">-->
                <!--</el-date-picker>-->
                <!--</div>-->
                <!--</el-form-item>-->
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

        <!--新增显示属性界面-->
        <el-dialog title="配置显示属性"
                   :visible.sync="propertiesFormVisible"
                   :close-on-click-modal="false"
        >
            <el-form>
                <el-row :gutter="12">
                    <el-col :span="12" v-for="(propertie,index) in this.properties"
                            style="padding-bottom: 10px">
                        <el-card shadow="hover">
                            <el-form-item :label="propertie.name">
                                <el-input auto-complete="off" v-model="propertie.selectValue"></el-input>
                            </el-form-item>
                        </el-card>
                    </el-col>
                    <el-card v-show="this.properties.length === 0 ? true:false">
                        暂无显示属性
                    </el-card>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="propertiesFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="viewPropertiesSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--新增Sku属性界面-->
        <el-dialog title="配置Sku属性"
                   :visible.sync="skuPropertiesFormVisible"
                   :close-on-click-modal="false"
        >
            <el-form>
                <div style="height: 350px;overflow: scroll;overflow-x: hidden;overflow-y: auto">
                    <el-row :gutter="12">
                        <el-col :span="12" v-for="(propertie,index) in this.skuProperties"
                                style="padding-bottom: 10px">
                            <el-card shadow="hover">
                                <el-form-item :label="propertie.name" :prop="propertie.name">
                                    <div v-for="index in propertie.skuValues.length+1">
                                        <el-input v-model="propertie.skuValues[index-1]">
                                            <el-button slot="append" icon="el-icon-delete"
                                                       @click="handleRemoveSkuValue(propertie.skuValues,index)"></el-button>
                                        </el-input>

                                    </div>
                                </el-form-item>
                            </el-card>
                        </el-col>
                        <el-card v-show="this.skuProperties.length === 0 ? true:false">
                            暂无Sku属性
                        </el-card>
                    </el-row>
                </div>

                <el-table
                        :data="dynamicTableDate"
                        style="width: 100%"
                        height="300"
                        border
                        :header-cell-style="{background:'#EEEEEE'}"
                >
                    <template v-for="(col,i) in this.tableHeader">
                        <el-table-column :prop="col.prop" :label="col.label"
                                         v-if="['price','availableStock','state'].includes(col.prop)">
                            <template slot-scope="scope">
                                <el-input auto-complete="off" v-model="dynamicTableDate[scope.$index].price"
                                          v-if="'price'===col.prop"></el-input>
                                <el-input auto-complete="off" v-model="dynamicTableDate[scope.$index].availableStock"
                                          v-if="'availableStock'===col.prop"></el-input>
                                <el-checkbox v-if="'state'===col.prop"></el-checkbox>
                            </template>
                        </el-table-column>
                        <!--正常显示-->
                        <el-table-column :prop="col.prop"
                                         :label="col.label.split(':').length >= 1 ? col.label.split(':')[1] : col.label"
                                         min-width="100"
                                         v-if="!['price','availableStock','state'].includes(col.prop)"
                        >
                            <!--<template slot-scope="scope">-->
                            <!--<el-input auto-complete="off" v-model="scope.row[col.prop]" ></el-input>-->
                            <!--</template>-->
                        </el-table-column>
                    </template>

                </el-table>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="skuPropertiesFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="skuPropertiesSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import vueWangeditor from 'vue-wangeditor'
    //import NProgress from 'nprogress'
    import {getProductListPage, removeProduct, batchRemoveProduct, editProduct, addProduct} from '../../api/api';


    export default {
        data() {
            return {
                filters: {
                    keyword: ''
                },
                //动态表格数据
                dynamicTableDate: null,
                tableHeader: [],
                //标识sku是否为空
                skuIsNull: true,
                editorOption: {},
                products: [],
                productTypes: [],

                tableData: [],
                properties: [],
                skuProperties: [],
                productsProps: {
                    value: 'id',
                    label: 'name',
                    children: 'children'
                },
                brands: [],
                brandProps: {
                    value: 'id',
                    label: 'name'
                },
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                currentRow: null,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                operateFormVisible: false,//新增界面是否显示
                propertiesFormVisible: false,
                skuPropertiesFormVisible: false,
                addLoading: false,
                operateFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //操作界面数据
                operateForm: {
                    id: '',
                    name: '',
                    subName: '',
                    code: '',
                    path: [],
                    productTypeId: '',
                    brandId: '',
                    onSaleTime: '',
                    offSaleTime: '',
                    productExt: {
                        richContent: '',
                        description: ''
                    }
                },
                propertiesForm: {
                    name: '',
                    isSku: 0,
                    typeId: ''
                }

            }
        },
        methods: {
            //上架.
            onSale() {
                this.onSaleOrOff(0);
            },
            //下架
            offSale() {
                this.onSaleOrOff(1);
            },
            //上下架操作
            onSaleOrOff(flag, row) {
                let inIf = true;
                let idStr = '';
                //flag为0表示上架，flag为1表示下架
                let ids = this.sels;
                if (this.sels.length === 0) {
                    console.debug("in lenght")
                    // ids.push(row.id);
                    // idStr = ids.map(item => item.id).toString();
                    idStr = row.id.toString();
                    inIf = true;
                } else {
                    for (let i = 0; i < ids.length; i++) {
                        if (ids[i].state !== flag) {
                            //其中某一商品状态异常,要操作商品已处于该状态
                            if (flag === 1) {
                                this.$message({
                                    message: '某一商品已经下架',
                                    type: 'error'
                                });
                                inIf = false;
                            } else if (flag === 0) {
                                this.$message({
                                    message: '某一商品已经上架',
                                    type: 'error'
                                });
                                inIf = false;
                            }
                            break;
                        } else {
                            //一切正常，可以进行后续操作
                            if (i < ids.length - 1) {
                                idStr += ids[i].id + ",";
                            } else {
                                idStr += ids[i].id;
                            }
                            inIf = true;
                        }
                    }
                }

                // this.sels = [];
                // ids = this.sels.map(item => item.id).toString();
                // {
                //     // if(item.state !== flag) {
                //     //     //其中某一商品状态异常,要操作商品已处于该状态
                //     //     if(flag === 1) {
                //     //         this.$message({
                //     //             message: '某一商品已经下架',
                //     //             type: 'error'
                //     //         });
                //     //         inIf = false;
                //     //     }else if(flag === 0) {
                //     //         this.$message({
                //     //             message: '某一商品已经上架',
                //     //             type: 'error'
                //     //         });
                //     //         inIf = false;
                //     //     }
                //     // }
                //
                // }
                if (inIf) {
                    this.$confirm('确认进行该操作吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                        let para = {ids: idStr, onSale: flag};
                        this.$http.post("/services/product/product/onSaleOrOff", para).then((res) => {
                            this.listLoading = false;
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getProducts();
                            this.sels = [];
                        });
                    }).catch(({data}) => {
                        this.$message({
                            message: '操作失败',
                            type: 'error' + data.message
                        });
                        this.sels = [];
                    });
                }


            },
            //单击删除添加的输入框
            handleRemoveSkuValue(skuValues, index) {
                skuValues.splice(index - 1, 1);
            },
            //sku属性输入时
            handleSkuInputChange() {
                this.skuProperties.skuValues.push({});
            },
            handleRowClick(row, event, column) {
                this.propertiesForm.typeId = row.productTypeId;
                this.currentRow = row;
            },
            handleRowSelect(selection, row) {
                this.propertiesForm.typeId = row.productTypeId;
                this.currentRow = row;
            },
            configViewProperties() {
                if (this.currentRow === null) {
                    //没有选择行
                    this.$message({
                        message: '请选择行再进行操作',
                        type: 'warning'
                    });
                } else {
                    //获取选中行id传递
                    let productId = this.currentRow.id;
                    this.$http.get("/services/product/specification/product/" + productId)
                        .then(({data}) => {
                            this.propertiesFormVisible = true;
                            this.properties = data;
                        })
                }
            },
            configSkuProperties() {
                if (this.currentRow === null) {
                    //没有选择行
                    this.$message({
                        message: '请选择行再进行操作',
                        type: 'warning'
                    });
                } else {
                    //获取选中行id传递
                    let productId = this.currentRow.id;
                    //请求获得sku属性相关信息
                    this.$http.get("/services/product/specification/productSku/" + productId)
                        .then(({data}) => {
                            this.skuPropertiesFormVisible = true;
                            this.skuProperties = data;
                            this.tableHeader = [];
                        });
                    this.$http.get("/services/product/sku/list/" + productId)
                        .then(({data}) => {
                            this.skuPropertiesFormVisible = true;
                            if (data.length > 0) {
                                console.debug("大于0 不为空 走元数据")
                                this.dynamicTableDate = []
                                this.dynamicTableDate = data;
                            }
                            this.tableHeader = [];
                            this.skuIsNull = false;
                        });

                }
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
                    this.$message({
                        message: '删除异常',
                        type: 'error'
                    });
                });
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
                            para.onSaleTime = (!para.onSaleTime || para.onSaleTime == '') ? '' : util.formatDate.format(new Date(para.onSaleTime), 'yyyy-MM-dd hh:mm:ss');
                            //后台根据id是否为null判断选择操作
                            this.$http.post("/services/product/product/save", para).then((res) => {
                                this.operateLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['operateForm'].resetFields();
                                this.operateFormVisible = false;
                                this.getBrands();
                                this.getProducts();
                            });
                        });
                    }
                });
            },
            //商品编辑
            handleAddEdit: function (index, row) {
                //index为编辑时传入的行号，从零开始，新增时我传入-1来区分操作
                //编辑操作，回显数据
                this.getProductTypes();
                this.getBrands();
                console.debug(row.productExt.richContent)
                if (index !== -1) {
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
            handleOnSaleOrOffSingle(index, row) {
                this.onSaleOrOff(row.state, row);
                // let flag = 0;
                // if (row.state === 1) {
                //     //下架操作
                //
                // } else {
                //     //上架操作
                //     flag = 1;
                // }
                // let para = {
                //     id: row.id,
                //     state: flag
                // };
                // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                //     this.$http.post("/services/product/product/save", para).then((res) => {
                //         this.addLoading = false;
                //         //NProgress.done();
                //         this.$message({
                //             message: '操作成功',
                //             type: 'success'
                //         });
                //         this.getProducts();
                //     }).catch(() => {
                //         this.$message({
                //             message: '操作失败',
                //             type: 'error'
                //         });
                //         this.getProducts();
                //     })
                // });
            },
            //显示属性提交
            viewPropertiesSubmit() {
                //获取当前商品id
                let id = this.currentRow.id;
                let map = {
                    productId: id,
                    properties: this.properties
                };
                this.$http.post("/services/product/product/saveViewProperties", map)
                    .then(({data}) => {
                        this.addLoading = false;
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$refs['propertiesForm'].resetFields();
                        this.propertiesFormVisible = false;
                        this.getProducts();
                    })
            },
            //sku属性提交
            skuPropertiesSubmit() {
                //获取当前商品id
                let id = this.currentRow.id;
                let skus = {
                    productId: id,
                    skuProperties: this.skuProperties,
                    skuPro: []
                };
                let arr = [];
                this.dynamicTableDate.forEach(function (val, index) {
                    //替换中文
                    let price = JSON.parse(JSON.stringify(val).replace(/价格/g, 'price')
                        .replace(/库存/g, 'availableStock').replace(/是否可用/g, 'state'));
                    let sku = Object.assign({}, price);
                    skus.skuPro.push(sku);
                });

                this.$http.post("/services/product/product/saveSkuProperties", skus)
                    .then(({data}) => {
                        this.addLoading = false;
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$refs['propertiesForm'].resetFields();
                        this.skuPropertiesFormVisible = false;
                        this.getProducts();
                    })
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
            getBrands: function () {
                this.$http.get("/services/product/brand/treeData")
                    .then(({data}) => {
                        if (data != null) {
                            this.brands = data;
                        }
                    })
            },
            //时间格式化
            getOnSaleTime(val) {
                this.operateForm.onSaleTime = val;
            },
            //时间格式化
            getOffSaleTime(val) {
                this.operateForm.offSaleTime = val;
            },
            //照片回显方法
            photoFeed(row) {
                try {
                    let lo = JSON.parse(row.logo);
                    for (let i = 0; i < lo.length; i++) {
                        lo[i].url = "http://119.23.246.140" + lo[i].url;
                        this.fileList2.push(lo[i])
                    }
                } catch (err) {
                    return false;
                }

            },
            onEditorBlur() {//失去焦点事件
            },
            onEditorFocus() {//获得焦点事件
            },
            onEditorChange() {//内容改变事件
            }
        },
        mounted() {
            this.getProducts();
            this.getProductTypes();
            this.getBrands();
        },
        components: {
            vueWangeditor
        },
        watch: {
            skuProperties: {
                handler(currentVal, oldVal) {
                    if (!this.skuIsNull) {
                        console.debug("in null")
                        this.skuIsNull = true;
                    } else {
                        console.debug("in fill")
                        // 循环每一个商品属性
                        //过滤没有值的选项
                        currentVal = currentVal.filter(item => item.skuValues.length > 0);
                        const data = Object.keys(currentVal).reduce((result, key) => {
                            // 循环属性的每一个值
                            return currentVal[key].skuValues.reduce((acc, value) => {
                                let name = currentVal[key].name;
                                let id = currentVal[key].id;
                                // 对于第一个属性
                                if (!result.length) {
                                    // 将数值转化为对象格式
                                    return acc.concat({[id + ":" + name]: value});
                                }
                                // 对于第一个之后的属性，将新的属性和值添加到已有结果，并进行拼接。
                                return acc.concat(result.map(ele => (Object.assign({}, ele, {[id + ":" + name]: value}))));
                            }, []);
                        }, []);


                        // console.log("jjjj",this.skuProperties);
                        // // 过滤掉用户没有填写数据的规格参数
                        // const arr = this.skuProperties.filter(s => s.skuValues.length > 0);
                        // // 通过reduce进行累加笛卡尔积
                        // var skus =  arr.reduce((last, spec) => {
                        //     const result = [];
                        //     last.forEach(o => {
                        //         spec.skuValues.forEach(option => {
                        //             // option //一个一一个值 黄皮肤
                        //             const obj = {};
                        //             Object.assign(obj, o);
                        //             obj[spec.name] = option;
                        //             result.push(obj);
                        //         })
                        //     })
                        //     return result
                        // }, [{}]);
                        //假数据测试是否能够绑定数据
                        data.forEach(function (item) {
                            item['price'] = '';
                            item['availableStock'] = '';
                            item['state'] = 0;
                        });
                        // this.dynamicTableDate = skus;
                        this.dynamicTableDate = data;
                    }
                    // {"是否可用":0,"价格":0,"库存":0}

                    // let header = Object.keys(this.dynamicTableDate[0]);
                    // this.dynamicTableDate = [];
                    // this.dynamicTableDate = this.tableData;
                    // header.push({"label":"价格","prop":"price"},{"label":"库存","prop":"availableStock"},{"label":"是否可用","prop":"state"})
                    // console.debug(header)
                    // this.tableHeader = header;

                    let header = []
                    Object.keys(this.dynamicTableDate[0]).forEach(sku => {
                        let value = sku;
                        if (sku === 'price') {
                            value = '价格'
                        }
                        if (sku === 'availableStock') {
                            value = '库存'
                        }
                        if (sku === 'state') {
                            value = '是否可用'
                        }
                        let col = {"label": value, "prop": sku};
                        header.push(col);
                    });
                    this.tableHeader = header;
                },
                //是否监视该对象深层变化
                deep: true
            }
        }
    }

</script>

<style scoped>

    .quill-editor {

        height: 400px;
        padding-bottom: 50px;
    }
</style>