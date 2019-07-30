<template>
  <div class="block">
    <el-row>
      <el-col :span="6">
        <div>
          <el-tree
            node-key="id"
            default-expand-all
            :props="props"
            :data="orgaData"
            :show-checkbox="false"
            :expand-on-click-node="false"
            @current-change="handleCurrentNodeChange">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => modifyOrga(data)">
            修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => deleteOrga(node, data)">
            刪除
          </el-button>
        </span>
      </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div>
          <el-row>
            <el-col :span="24">
              <el-form :inline="true" align="left" class="demo-form-inline">
                <el-form-item label="请选择新增组织的上级组织">
                  <OrgaSelector v-model="orgaIdToBeAdd" ref="orgaSelector"></OrgaSelector>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="orgaNameToBeAdd" size="mini" placeholder="请输入组织名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="mini" type="primary" @click="createOrga()" :disabled="orgaNameToBeAdd.length === 0">
                    添加组织
                  </el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div>
                <User ref="user" :showCreateUser="false" :showOpt="false" :selectedNode="selectedNode"></User>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <OrgaForm v-if="showOrgaForm" ref="orgaForm" :orga="selectedOrga" @close="closeForm"></OrgaForm>
  </div>
</template>

<script>

  import OrgaForm from '@/views/org/OrgaForm';
  import OrgaSelector from '@/components/OrgaSelector.vue';
  import User from '@/views/user/User';
  import orgApi from '@/api/org/index'

  export default {
    name: 'Orga',
    components: {
      OrgaForm,
      OrgaSelector,
      User
    }, data() {
      return {
        //ztee数据
        orgaData: [],
        //将label的值改为orgaName
        props: {
          label: function (row) {
            return row.orga.orgaName;
          },
          children: 'children'
        },
        //是否展示OrgaForm
        showOrgaForm: false,
        //当前选中的组织
        selectedOrga: null,
        //要添加的组织Id
        orgaIdToBeAdd: 0,
        //要添加的组织名称
        orgaNameToBeAdd: '',
        selectedNode: null
      }
    },
    methods: {
      /**
       * 组织添加
       */
      async createOrga() {
        let orga = {
          orgaName: this.orgaNameToBeAdd,
        }
        if (this.orgaIdToBeAdd === 0) {
          orga.orgaParent = null;
        } else {
          orga.orgaParent = this.orgaIdToBeAdd;
        }
        let resp = await orgApi.createOrga(orga);
        if (resp.code === "10000") {
          this.orgaIdToBeAdd = 0;
          this.orgaNameToBeAdd = '';
          this.$refs['orgaSelector'].loadOrgaSelector();
          this.loadOrgas();
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success'
          });
        }
      },
      /**
       *组织删除
       */
      async deleteOrga(node, data) {
        let a1 = this.$confirm('此操作将永久删除该组织, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let resp = orgApi.deleteOrga(data.orga.orgaId);
          resp.then(data => {
            if (data.code === "10000") {
              this.$refs['orgaSelector'].loadOrgaSelector();
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              this.loadOrgas();
              const parent = node.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex(d => d.id === data.id);
              children.splice(index, 1);
            }
          })
        }).catch(() => {
          this.$notify({
            title: '取消',
            message: '已取消删除',
            type: 'info'
          });
        })
      },
      /**
       * 组织修改
       */
      modifyOrga(data) {
        this.selectedOrga = data.orga;
        this.showOrgaForm = true;
      },
      /**
       * 加载tree数据
       */
      async loadOrgas() {
        //前端需要一个数组[id,label,children] children还是一个组织对象
        let resp = await orgApi.nestedOrga()
        if (resp.code === "10000") {
          this.orgaData = resp.data;
        }
      },
      /**
       * 显示对应部门的员工
       */
      handleCurrentNodeChange(row) {
        this.selectedNode = row;
        setTimeout(() => {
          this.$refs['user'].loadUsers();
        }, 100)
      },
      /**
       * 关闭窗口
       */
      closeForm() {
        this.$refs['orgaSelector'].loadOrgaSelector();
        this.showOrgaForm = false;
      }
    },
    /**
     * 页面初始化执行的方法
     */
    created() {
      this.loadOrgas();
    }
  }
</script>
