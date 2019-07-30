<template>
  <div>
    <el-dialog :title='"用户"+actionName' :visible.sync="dialogFormVisible" @close="closeUserForm">
      <el-form :model="formData" ref="formData" :rules="rules" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="user===null|| user===undefined" prop="userPassword">
          <el-input v-model="formData.userPassword" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="formData.userGender" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker
            v-model="formData.userBirthday"
            align="right"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="组织:">
          <OrgaSelector v-model="formData.orgaId"></OrgaSelector>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUserForm">取 消</el-button>
        <el-button @click="saveUser()" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import OrgaSelector from '@/components/OrgaSelector';
  import axios from 'axios';
  import {Notification} from 'element-ui';
  import userApi from '@/api/user/index'

  export default {

    name: "UserForm",
    /**
     * 注册组件
     */
    components: {
      OrgaSelector
    },
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
        //默认打开是编辑用户
        actionName: '编辑',
        //默认userForm表单是否显示
        dialogFormVisible: true,
        //初始化表单数据
        formData: {
          userId: 0,
          userName: '',
          userPassword: '',
          userGender: 1,
          userBirthday: null,
          orgaId: null,
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

    methods: {
      /**
       * 保存用户
       */
      async saveUser() {
        if (this.user === null || this.user === undefined) {
          /**
           * 调用保存用户
           */
          let user = {
            userName: this.formData.userName,
            userPassword: this.formData.userPassword,
            userGender: this.formData.userGender,
            userBirthday: this.formData.userBirthday,
            orgaId: this.formData.orgaId,
          }
          let resp = await userApi.createUser(user)
          if (resp.code === "10000") {
            //加载用户页面
            this.$parent.loadUsers();
            //关闭窗口
            this.$emit('close');
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success'
            });
          }
        } else {
          /**
           * 调用更新用户
           */
          let user = {
            userId: this.formData.userId,
            userName: this.formData.userName,
            userGender: this.formData.userGender,
            userBirthday: this.formData.userBirthday,
            orgaId: this.formData.orgaId,
          }
          let resp = await userApi.modifyUser(user)
          if (resp.code === "10000") {
            //加载用户页面
            this.$parent.loadUsers();
            //关闭窗口
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
        this.formData.userGender = this.user.userGender == null ? 1 : (this.user.userGender == 1 ? 1 : 0);
        this.formData.userBirthday = this.user.userBirthday;
        this.formData.orgaId = this.user.orgaId;
      } else {
        this.actionName = "添加";
      }
    }
  }
</script>
