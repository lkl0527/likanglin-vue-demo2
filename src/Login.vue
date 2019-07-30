<template>
  <div>
    <div class="Land">
      <div class="topzi">系统登录</div>
      <el-form :model="formParams" status-icon :rules="rules" ref="formParams" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="formParams.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input type="password" v-model="formParams.userPassword" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doLogin()">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  import ElCard from "element-ui/packages/card/src/main";
  import userApi from '@/api/user/index'

  export default {
    components: {ElCard},
    name: 'Login',
    data() {
      return {
        //定义表单数据
        formParams: {
          //定义表单数据
          userName: '',
          userPassword: ''
        }, rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3  5 个字符', trigger: 'blur'}
          ],
          userPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 10, message: '长度在 6 10 个字符', trigger: 'blur'}
          ]
        }
      };
    },
    /**
     * 界面所有的操作方法
     */
    methods: {
      /**
       * 用户登录方法
       */
      async doLogin() {
        if (this.formParams.userName === '') {
          this.$notify({
            title: '失败',
            message: '请输入用户名',
            type: 'info'
          });
          return
        }
        if (this.formParams.userPassword === '') {
          this.$notify({
            title: '失败',
            message: '请输入密码',
            type: 'info'
          });
        }
        var user = {
          userName: this.formParams.userName,
          userPassword: this.formParams.userPassword
        }
        /**
         * 调用后端的登录方法
         */
        let resp = await userApi.login(user)
        if (resp.code === "10000") {
          this.$notify({
            title: '成功',
            message: '恭喜您,登录成功,跳转中...',
            type: 'success'
          });
          //将用户信息存储在localSorage中
          window.localStorage.setItem('loginUser', JSON.stringify(resp.data));
          //设置跳转时间
          setTimeout(() => {
            this.$router.push('/index');
          }, 1000)
        }
      }
    }
  }
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    background: url(assets/login.jpg);
    background-size: 100% 100%;
    border: hidden;

    overflow: hidden;
  }

  #app .topzi {
    font-size: 40px;
    margin-bottom: 20px;
  }

  #app .Land {
    width: 30%;
    position: fixed;
    top: 20%;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 40px;
  }
</style>
