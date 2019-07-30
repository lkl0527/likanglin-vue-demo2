<template>
  <div>
    <el-dialog title="更新密码" :visible.sync="dialogFormVisible" @close="closeUserForm">
      <el-form :model="formData" ref="formData" :rules="rules" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" readonly></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="userPassword">
          <el-input v-model="formData.userPassword" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="NewPassword1">
          <el-input v-model="formData.NewPassword1" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="NewPassword2">
          <el-input v-model="formData.NewPassword2" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUserForm">取 消</el-button>
        <el-button @click="updatePassword()" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import axios from 'axios';
  import {Notification} from 'element-ui';
  import userApi from '@/api/user/index'

  export default {

    name: "UpdatePassword",
    /**
     * 引用父组件中的对象
     */
    props: {
      user: {
        type: Object,
        default: false,
      },
    },
    data() {
      return {
        //默认userForm表单是否显示
        dialogFormVisible: true,
        //初始化表单数据
        formData: {
          userId: 0,
          userName: '',
          userPassword: '',
          NewPassword1: '',
          NewPassword2: ''
        }, rules: {
          userPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 10, message: '长度在 6 10 个字符', trigger: 'blur'}
          ],
          userNewPassword1: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 10, message: '长度在 6 10 个字符', trigger: 'blur'}
          ],
          userNewPassword2: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 10, message: '长度在 6 10 个字符', trigger: 'blur'}
          ]
        }
      };
    },

    methods: {
      /**
       * 保存用户
       */
      async updatePassword() {

        /**
         * 调用更新用户
         */
        if (this.NewPassword1 === this.NewPassword2) {
          let user = {
            userId: this.formData.userId,
            userName: this.formData.userName,
            userPassword: this.formData.userPassword,
            newPassword: this.formData.NewPassword1,
          }
          let resp = await userApi.updatePassword(user)
          if (resp.code === "10000") {
            this.$emit('close');
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            });
          }
        }
      },
      /**
       * 将close方法发送给父组件处理
       */
      closeUserForm() {
        this.$emit('close');
      }
    },
    /**
     * 页面初始化执行的数据
     */
    created() {
      //将数据回显到表单中
      if (this.user != null) {
        this.formData.userId = this.user.userId;
        this.formData.userName = this.user.userName;
        this.formData.userPassword = this.user.userPassword;
      }
    }
  }
</script>
