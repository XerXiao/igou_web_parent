import axios from 'axios';

let productBase = '/services/product';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const getProductListPage = params => { return axios.get(`${base}/product/listpage`, { params: params }); };

export const removeProduct = id => { return axios.delete(`${productBase}/product/delete/`+id)};

export const batchRemoveProduct = params => { return axios.delete(`${productBase}/product/batchRemove`, { params : params }); };

export const editProduct = params => { return axios.get(`${base}/product/edit`, { params: params }); };

export const addProduct = params => { return axios.post(`${productBase}/product/save`, { product: JSON.stringify(params) }); };