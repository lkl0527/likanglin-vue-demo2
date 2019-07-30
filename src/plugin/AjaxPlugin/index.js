// import axios from 'axios';
//
// let AjaxPlugin = {};
//
// AjaxPlugin.install = function (Vue) {
//   if (!AjaxPlugin.installed) {
//     AjaxPlugin.installed = true;
//     /**
//      *
//      * @param vm
//      * @param method
//      * @param apiUrl
//      * @param params
//      * @returns {Promise<any>}
//      */
//     Vue.prototype.http = function (vm, method, apiUrl, params = {}) {
//       return new Promise((resolve, reject) => {
//         let promise = null;
//         if (method.toUpperCase() === "GET") {
//           apiUrl = apiUrl + "?" + params;
//           promise = axios[method](apiUrl);
//         } else {
//           promise = axios[method](apiUrl, params);
//         }
//         promise.then((response) => {
//           let result = response.data;
//           if (result && result.code === "10000") {
//             resolve(result.data);
//           }
//         }).catch((response) => {
//           let result = response.response.data;
//           if (result && result.code === "00003") {
//             vm.$notify({
//               title: '提示',
//               message: result.error,
//               type: 'error'
//             });
//             setTimeout(() => {
//               this.$router.push('/');
//             }, 1000);
//             reject();
//           } else {
//             vm.$notify({
//               title: '提示',
//               message: result.error,
//               type: 'error'
//             });
//           }
//         });
//       });
//     }
//   }
// };
// export default AjaxPlugin;
//
