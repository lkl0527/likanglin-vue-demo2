<template>
  <div>
    <div>当前头像
      <img :src="loginUser.userRemart" v-if="loginUser.userRemart.length>0" @click="personCenter()"
           style="height: 50px;width: 50px" alt="" class="pull-right">
      <img src="@/assets/UserPictrue.jpg" v-else @click="personCenter()" style="height: 50px;width: 50px"
           class="pull-right">
    </div>
    <br>
    <div>
      修改头像
      <el-upload
        class="avatar-uploader"
        action="http://localhost:12319/upload/actions/image"
        method="post"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
  </div>
</template>

<script>

  import axios from 'axios';
  import {Notification} from 'element-ui';
  import userApi from '@/api/user/index'

  export default {
    name: "personCenter",
    data() {
      return {
        imageUrl: '',
        //默认userForm表单是否显示
        dialogFormVisible: true,
        //初始化表单数据
        loginUser: '',
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.loginUser.userRemart = res.data;

      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }, created() {
      var user = window.localStorage.getItem('loginUser');
      if (user && user.length > 0) {
        user = JSON.parse(user);
        if (user && user.userId > 0) {
          this.loginUser = user;
        } else {
          this.$router.push('/');
        }
      } else {
        this.$router.push('/');
      }
    }
  }
</script>


<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
</style>
