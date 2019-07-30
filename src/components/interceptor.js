import axios from 'axios'
import {Message} from 'element-ui'
import {Notification} from 'element-ui'

axios.interceptors.request.use(config => {
  // ==========  所有请求之前都要执行的操作  ==============
  return config
}, err => {
  // ==================  错误处理  ====================
  Message.error({message: '请求超时!'})
  return Promise.resolve(err)
})
var count = 1;
axios.interceptors.response.use(response => {
// ==============  所有请求完成后都要执行的操作  ==================
  // 第二种方式，仅对200和error状态处理
  if (response.status === 200) {
    var result = response.data;
    if (result.code === "10000") {
      return response
    }
  }
}, error => {
  var result = error.response;
  if (result.status === 500) {
    if (result.data.code === "00003") {
      count++;
      if (count === 2) {
        Notification({
          title: '提示',
          message: result.data.error,
          type: 'error'
        });
      }
      setTimeout(() => {
        // router.push('/');
        window.location.href = "http://localhost:22319/#/";
      }, 1000);
    }
    else {
      Notification({
        title: '失败',
        message: result.data.error,
        type: 'error'
      });
    }
  }
  return Promise.resolve(error.response)
})

export default {
  post(url, data) {
    return axios({
      method: 'post',
      url,
      data: data,
      timeout: 30000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    })
  },
  get(url, params) {
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
  },
  //  PUT 方法封装
  put(url, params) {
    return axios({
      method: 'put',
      url: url,
      data: params,
      timeout: 30000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    })
  },
  //  DELETE 方法封装
  delete(url, params) {
    return axios({
      method: 'delete',
      url,
      params,
      timeout: 30000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
  }
}
