<template>
  <div>
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-row>
        <el-col :span="22">
          <div>
            <el-menu-item index="1">组织用户后台管理系统</el-menu-item>
          </div>
        </el-col>
        <el-col :span="1">
          <div>
            <el-menu-item index="2">欢迎你,{{loginUser.userName}}</el-menu-item>
          </div>
        </el-col>
        <el-col :span="1">
          <div>
            <el-dropdown class="pull-right">
            <span class="el-dropdown-link">
              <div>
                <img :src="loginUser.userRemart" v-if="loginUser.userRemart.length>0" @click="personCenter()"
                     style="height: 50px;width: 50px" alt="" class="pull-right">
              <img src="./assets/UserPictrue.jpg" v-else @click="personCenter()" style="height: 50px;width: 50px"
                   class="pull-right">
              </div>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="updatePassword">修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
                <el-dropdown-item>
                  <el-upload
                    aria-disabled="true"
                    class="avatar-uploader"
                    action="http://localhost:12319/upload/actions/image"
                    method="post"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                    <el-button>修改头像</el-button>
                  </el-upload>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </el-menu>

    <el-container style="border: 0px solid #eee">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>菜单</span>
          </template>
          <el-menu-item-group>
            <template slot="title">
              <el-menu-item @click="toUser()" index="1">用户管理</el-menu-item>
            </template>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">
              <el-menu-item @click="toOrga()" index="2">组织管理</el-menu-item>
            </template>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>

      <el-container class="main">
        <el-main>
          <div>
            <User v-if="showUsers"></User>
          </div>
          <div>
            <Orga v-if="showOrgas"></Orga>
          </div>
          <div>
            <PersonCenter v-if="showPersonCenter"></PersonCenter>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <!--引入UserForm组件-->
    <!--v-if 这个组件是否显示,有父组件控制-->
    <!--ref:给组件起一个别名-->
    <!--:user(冒号+user) 在父组件中取出来的数据,传递到子组件中-->
    <!--@close:是由子组件发射过来的方法,在父组件中控制--><!--@close="closeForm"-->
    <UpdatePassword v-if="showUpdate" ref="UpdatePassword" :user="loginUser" @close="closeForm"></UpdatePassword>
    <!--<PersonCenter v-if="showPersonCenter" ref="PersonCenter" :user="loginUser" @close="closeForm"></PersonCenter>-->
  </div>
</template>

<script>
  import UpdatePassword from '@/views/user/UpdatePassword';
  import PersonCenter from '@/views/user/PersonCenter';
  import User from '@/views/user/User'
  import Orga from '@/views/org/Orga'
  import sysApi from '@/api/user/index'

  export default {
    name: 'Welcome',
    components: {
      User,
      Orga,
      UpdatePassword,
      PersonCenter
    },
    data() {
      return {
        loginUser: '',
        showUsers: true,
        showOrgas: false,
        imageUrl: '',
        //默认情况showUpdate不显示
        showUpdate: false,
        //默认情况showPersonCenter不显示
        showPersonCenter: false
      };
    },
    methods: {
      shangchuan() {

      },
      handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
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
      },
      /**
       * 修改密码
       */
      async updatePassword() {
        this.loginUser = this.loginUser;
        this.showUpdate = true;
      },
      async personCenter() {
        this.loginUser = this.loginUser;
        this.showUsers = false;
        this.showOrgas = false;
        this.showPersonCenter = true;
      },
      /**
       * 用户退出方法
       * @returns {Promise<void>}
       */
      async logout() {
        let resp = await sysApi.logout()
        if (resp.code === "10000") {
          this.$notify({
            title: '成功',
            message: '退出成功',
            type: 'success'
          });
          //调用window删除localStorage中的数据
          window.localStorage.removeItem('loginUser');
          //设置跳转时间,跳转到主页面
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        }
      },
      closeForm() {
        this.showUpdate = false;
        this.showPersonCenter = false;
      },
      toUser() {
        this.showUsers = true
        this.showOrgas = false
      },
      toOrga() {
        this.showUsers = false
        this.showOrgas = true
      }
    },

    created() {
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
  html, body {
    width: 100%;
    height: 100%;
    background: url(assets/login.jpg) no-repeat;
    background-size: 100% 100%;
    border: hidden;
    overflow: hidden;
    border: hidden;
    padding: 0px;
    margin: 0px;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .main {
    width: 1200px;
    height: 888px;
    background: #ffffff;
    background-size: 100% 100%;
  }

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
    width: 54px;
    height: 54px;
    line-height: 54px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
