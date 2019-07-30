<template>
  <div class="block">
    <el-cascader
      placeholder="请选择组织"
      :options="options"
      :value="theValue"
      filterable
      change-on-select
      @change="handleChange">
    </el-cascader>
    <!--options:要显示的数据，需要递归封装-->
    <!--value:下拉框默认显示的值-->
    <!--@change:点击出发的事件-->
  </div>
</template>

<script>

  import orgApi from '@/api/org/index'

  export default {
    name: "OrgaSelector",
    props: {
      value: Number | Array,
      default: []
    }, data() {
      return {
        theValue: [],
        options: [],
        idMap: {}//键:id 值:所有父节点组成的Id数组
      }
    },
    watch: {
      value: function (newValue) {
        if (+newValue === 0 || newValue === undefined || newValue === null) {
          this.theValue = [];
        }
      }
    }
    ,
    methods: {
      handleChange(value) {
        let theRealValue = value[value.length - 1];
        this.$emit('input', theRealValue);
      },
      /**
       * 封装级联数据,用于回显使用
       *
       * @param item 组织对象
       * @param parentIds 父节点数组
       * @returns {{value: number|*|null, label: *}}
       *
       */
      parseNode(item, parentIds = []) {
        //定义返回值,有子节点再添加
        let returnValue = {
          value: item.orga.orgaId,
          label: item.orga.orgaName,
        };
        //定义map的键是组织Id,值是所有的父Id
        this.idMap[item.orga.orgaId] = parentIds;
        //如果当前组织对象有子节点
        if (item.children && item.children.length > 0) {
          //遍历每一个组织对象
          for (let i = 0; i < item.children.length; i++) {
            //取到当前节点数据
            let node = item.children[i];
            //如果子节点还有子节点的话,调用自己本身,将组织orgaId传入parentIds中
            item.children[i] = this.parseNode(node, parentIds.concat(item.orga.orgaId));
          }
          //给当前组织对象添加children对象
          returnValue.children = item.children;
        }
        //返回封装好的数据
        return returnValue;
      },
      async loadOrgaSelector() {
        let resp = await orgApi.nestedOrga();
        if (resp.code === "10000") {
          var data = resp.data;
          let finalArray = [];
          //循环遍历,将每一个对象赋值到数组中
          for (let i = 0; i < data.length; i++) {
            //调用递归,如果有子节点,就封装子节点信息
            let item = this.parseNode(data[i]);
            //将每一个封装好的对象添加到数据中中
            finalArray.push(item);
          }
          //将封装好的数据进行赋值
          this.options = finalArray;
          //将显示的值,根据键将自己的值加载最后
          this.theValue = this.idMap[this.value].concat(this.value);
        }
      }
    },
    /**
     * 初始化方法
     */
    created() {
      this.loadOrgaSelector();
    }
  }
</script>
