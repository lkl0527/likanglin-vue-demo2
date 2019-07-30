<template>
  <div>
    <div v-if="showCreateUser" align="left">根据用户名模糊查询:<input type="text" v-model="params.userName" placeholder="请输入用户名">
      <button @click="loadUsers()">确定</button>
      <button @click="createUser()">添加用户</button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="userId"
        label="用户Id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userBirthday"
        label="生日">
        <template slot-scope="scope">
          <span>{{parseBirthday(scope.row.userBirthday)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userGender"
        label="性别">
        <template slot-scope="scope">
          <span>{{genderMap[scope.row.userGender]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="组织">
        <template slot-scope="scope">
          <span>{{orgasMap[scope.row.orgaId]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作" v-if="showOpt">
        <template slot-scope="scope">
          <el-button @click="modifyUser(scope)" type="text" size="small">修改</el-button>
          <el-button @click="deleteUser(scope)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="params.pageNum"
      :page-size="params.pageSize"
      :total="params.total"
      layout="total, prev, pager, next"
    >
    </el-pagination>
    <!--引入UserForm组件-->
    <!--v-if 这个组件是否显示,有父组件控制-->
    <!--ref:给组件起一个别名-->
    <!--:user(冒号+user) 在父组件中取出来的数据,传递到子组件中-->
    <!--@close:是由子组件发射过来的方法,在父组件中控制--><!--@close="closeForm"-->
    <UserForm v-if="showForm" ref="userForm" :user="selectedUser" @close="closeForm"></UserForm>
  </div>
</template>

<script>
  import UserForm from '@/views/user/UserForm';
  import userApi from '@/api/user/index'
  import orgApi from '@/api/org/index'

  /**
   * 暴露接口
   */
  export default {

    name: 'User',
    /**
     * 注册组件
     */
    components: {
      UserForm
    },
    /**
     * 组件之间传递数据
     */
    props: {
      //Orga传递过来的当前选中组织节点数据
      selectedNode: {
        type: Object,
        default: null
      },
      showCreateUser: {
        type: Boolean,
        default: true
      },
      showOpt: {
        type: Boolean,
        default: true
      }
    },
    watch: {},
    /**
     * 数据
     */
    data() {
      return {
        //默认情况userForm不显示
        showForm: false,
        //用户将选中行的数据在UserForm中显示
        selectedUser: null,
        //表格数据
        tableData: [],
        //初始化性别
        genderMap: {
          1: '男',
          0: '女'
        },
        //初始化组织
        orgasMap: {},
        //封装查询参数
        params: {
          pageNum: 1,
          pageSize: 10,
          userName: null,
          orgaId: null,
          pages: 0,
          total: 0
        },
        tempPageNum: 0
      }
    },
    /**
     * 方法
     */
    methods: {
      /**
       * 增加用户
       */
      createUser() {
        this.selectedUser = null,
          this.showForm = true;
      },
      /**
       * 删除用户
       * @param scope 选中的当前行的数据
       */
      async deleteUser(scope) {
        let index = scope.$index;//拿出这一行的下标
        let row = scope.row;//拿出这一行的数据
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let resp = userApi.deleteUser(row.userId)
          resp.then(data => {
            if (data.code === "10000") {
              var a = this.tableData.splice(index, 1);//删除table中对应的哪一行数据
              this.loadUsers();
              this.$notify({
                title: '成功',
                message: '刪除成功',
                type: 'success'
              });
            }
          })
        }).catch(() => {
          this.$notify({
            title: '取消',
            message: '已取消删除',
            type: 'info'
          });
        });
      },
      /**
       * 修改用户
       */
      modifyUser(scope) {
        //将当前行的数据封装到selectUser中
        this.selectedUser = scope.row;
        this.showForm = true;
      },
      /**
       * 初始化用户数据
       */
      async loadUsers() {
        if (this.selectedNode != null && this.selectedNode != undefined && this.selectedNode.orga != null) {
          this.params.orgaId = this.selectedNode.orga.orgaId;
        }
        var paramDate = "?";
        paramDate += "pageNum=" + this.params.pageNum + "&pageSize=" + this.params.pageSize;
        if (this.params.userName != null) {
          paramDate += "&userName=" + this.params.userName;
        }
        ;
        if (this.params.orgaId != null) {
          paramDate += "&orgaId=" + this.params.orgaId;
        }
        ;
        let resp = await userApi.queryUsers(paramDate)
        if (resp.code === "10000") {
          this.tableData = resp.data.list;
          this.params.pages = resp.data.pages;
          this.params.total = resp.data.total;
        }
      },
      /**
       * 初始化组织数据
       */
      async loadOrgas() {
        let resp = await orgApi.queryOrgas()
        if (!!resp.data) {
          let map = {};
          resp.data.forEach(function (orga) {
            map[orga.orgaId] = orga.orgaName;
          })
          this.orgasMap = map;
        }
      },
      /**
       * 将毫秒值转为日期格式
       *
       * @param 毫秒值
       */
      parseBirthday(date) {
        if (date === null || date === undefined || date === "") {
          return null;
        }
        date = new Date(date);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDay();
        return year + "年" + month + "月" + day + "日";
      }
      ,
      /**
       * 处理每页多少条数据的时候触发的事件
       */
      handleSizeChange() {

      }
      ,
      /**
       * 处理当前是第几页的时候出发的事件
       */
      handleCurrentChange(pageNo) {
        this.params.pageNum = pageNo;
        this.loadUsers();
      }
      ,

      /**
       * 处理制定页面点击
       */
      handleToPage() {
        if (this.temPageNum > 0 && this.temPageNum <= this.params.pages) {
          this.params.pageNum = this.temPageNum;
          this.loadUsers();
        }
      }
      ,
      /**
       * 处理上一页点击
       */
      prev() {
        if (this.params.pageNum <= 1) {
          this.params.pageNum = 1;
        } else {
          this.params.pageNum = this.params.pageNum - 1;
        }
        this.loadUsers();
      }
      ,
      /**
       * 处理下一页点击
       */
      next() {
        if (this.params.pageNum < this.params.pages) {
          this.params.pageNum = this.params.pageNum + 1;
        }
        this.loadUsers();
      }
      ,
      /**
       * 关闭窗口(表格的x和取消都调用这个方法)
       */
      closeForm() {
        this.showForm = false;
      }
      ,
    },
    /**
     * 初始化调用
     */
    created() {
      this.loadUsers();
      this.loadOrgas();
    }
    ,
  }
</script>
