<template>
	<section>
		<el-row :gutter="20">
			<!--属性管理-->
			<el-col :span="propertysTableSpan">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input clearable v-model="filters.propertyskeyword" placeholder="名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getPropertys">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handlePropertysAdd(-2,null)">新增</el-button>
						</el-form-item>
						<el-form-item style="float: right">
							<label>商品属性</label>
						</el-form-item>
					</el-form>
				</el-col>

				<!--属性列表-->
				<el-table :data="propertys"
						  highlight-current-row
						  v-loading="listLoading"
						  @selection-change="propertysSelsChange"
						  @row-dblclick="handleDoubleClick"
						  @row-click="handleClick"
						  style="width: 100%;">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column prop="specName" label="属性名" sortable>
					</el-table-column>
					<el-table-column label="操作" width="150">
						<template scope="scope">
							<el-button size="small" @click="handlePropertysAdd(scope.$index, scope.row)">编辑</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-button type="danger" @click="batchRemove" :disabled="this.propertysSels.length===0">批量删除</el-button>
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :total="propertystotal" style="float:right;">
					</el-pagination>
				</el-col>
			</el-col>
			<transition name="el-fade-in">
			<!--属性选项管理-->
			<el-col v-show="show" class="transition-box" :span="propertysDetailTableSpan">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-button type="primary" @click="handlePropertysAdd(-1,null)">新增</el-button>
						</el-form-item>
						<el-form-item style="float: right">
							<label>商品属性选项</label>
						</el-form-item>
					</el-form>
				</el-col>

				<!--属性列表-->
				<el-table :data="propertysOptions"
						  highlight-current-row
						  v-loading="listLoading"
						  @selection-change="propertysOptionsSelsChange" style="width: 100%;">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column prop="optionName" label="属性选项名" sortable>
					</el-table-column>
					<el-table-column label="操作" width="150">
						<template scope="scope">
							<el-button size="small" @click="handlePropertysAdd(scope.$index, scope.row)">编辑</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-button type="danger" @click="batchRemove" :disabled="this.propertysOptionsSels.length===0">批量删除</el-button>
					<el-pagination layout="prev, pager, next" @current-change="handleOptionCurrentChange" :total="propertysOptionstotal" style="float:right;">
					</el-pagination>
				</el-col>
			</el-col>
			</transition>
		</el-row>



		<!--新增属性界面-->
		<el-dialog title="新增" :visible.sync="operateFormVisible" :close-on-click-modal="false">
			<el-form :model="operatePropertysForm" label-width="80px" ref="operatePropertysForm">
				<el-form-item label="名称" prop="specName" :rules="operatePropertysFormRules" >
					<el-input v-model="operatePropertysForm.specName"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input v-model="operatePropertysForm.index" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="operateFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addPropertysSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--新增属性选项界面-->
		<el-dialog title="新增" :visible.sync="operatePropertysOptionFormVisible" :close-on-click-modal="false">
			<el-form :model="operatePropertysOptionForm" label-width="80px" ref="operatePropertysOptionForm">
				<el-form-item label="名称" prop="optionName" :rules="operatePropertysOptionFormRules">
					<el-input v-model="operatePropertysOptionForm.optionName"  auto-complete="off"></el-input>
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
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
			    //双击显示隐藏选项标志位
			    flag:false,
                propertysTableSpan: 24,
                propertysDetailTableSpan:0,
				show: false,
				filters: {
                    propertyskeyword: '',
					propertysOptionskeyword: '',

				},
				propertys: [],
                propertysOptions:[],
				propertystotal: 0,
				propertysOptionstotal: 0,
				propertyspage: 1,
				propertysOptionspage: 1,
				listLoading: false,
				subListLoading: false,
                propertysSels: [],//列表选中列
                propertysOptionsSels: [],//列表选中列

				operateFormVisible: false,//编辑界面是否显示
				editLoading: false,
				operatePropertysOptionFormRules: {
					optionName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				operatePropertysOptionFormVisible: false,//新增界面是否显示
				addLoading: false,
				operatePropertysFormRules: {
					specName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增属性界面数据
				operatePropertysForm: {
					specName: ''
				},
				//新增属性选项界面数据
				operatePropertysOptionForm: {
					optionName: '',
					index: ''
				}

			}
		},
		methods: {
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
				this.$http.post("/services/product/specification/json",para)
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
					let para = { id: row.id };
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
            handlePropertysAdd: function (index,row) {
			    if(index === -1) {
                    //属性选项新增操作
                    this.operatePropertysOptionFormVisible = true;
                    this.operatePropertysOptionForm = {
                        optionName: '',
                        index:''
                    };
				}else if(index === -2){
                    //属性新增
                    this.operateFormVisible = true;
                    this.operatePropertysForm = {
                        specName: '',
                        index:''
                    };
                }else {
                    //修改操作
                    this.operateForm = {
                        name:row.name,
                        index:row.index
                    };
                    this.operateFormVisible = true;

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
							this.$http.post("/services/product/specification/add",para).then((res) => {
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
            addPropertysOptinoSubmit:function () {
                
            },
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
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
            handleDoubleClick(row,event) {
			    if(!this.flag) {
                    this.propertysDetailTableSpan = 12;
                    this.propertysTableSpan = 12;
                    this.propertysOptions = row.options;
                    this.propertysOptionstotal = row.options.length;
                    this.show = true;
                    //修改标志位
                    this.flag = true;
				}else {
			        this.flag = false;
                    this.propertysTableSpan = 24;
                    this.show = false;
				}

			},
			//行单击事件
            handleClick(row,event) {
                this.propertysOptions = row.options;
                this.propertysOptionstotal = row.options.length;
			}
        },
		mounted() {
			this.getPropertys();
		}
	}

</script>

<style scoped>
</style>