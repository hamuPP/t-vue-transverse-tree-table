<template>
  <div class="app" id="app">
    <h1>basic例子</h1>
    <button class="btn" @click="refreshTable">刷新表格</button>
    <button class="btn" @click="refreshTable('empty')">空数据</button>
    <div class="demo-wrapper">
      <TransverseTreeTable
        :tableData="tableData"
        :headerData="headerData"
        :columnWidth="columnWidth"
        border
        :loading="loadingVisible"
      >

        <!--自定义loading层-->
        <template v-slot:loadingLayer>
          <div class="my-loading">
            <img class="img" src="./assets/images/loading.gif" alt="">
          </div>
        </template>
      </TransverseTreeTable>
    </div>
  </div>
</template>
<script>
  // import mockTableData from './mockData/basicDemoDataAll'
  import mockTableData from './mockData/basicDemoData'
  import mockRereshedTableData from './mockData/refresh'

  export default {
    data() {
      return {
        tableData: [],//表体数据
        headerData: [],//表头数据
        columnWidth: 100,//平局列宽。若有合并的列，则合并列的宽度是此宽度的倍数
        loadingVisible: true
      }
    },
    created() {
      debugger;
    },
    mounted() {
      //模仿请求接口数据
      setTimeout(()=>{
        this.tableData = mockTableData.newDatas;//表格正文数据
        this.headerData = this.generateHeaderData(mockTableData.headers);//表头数据
        // 请求数据完成、关闭loading
        this.loadingVisible = false;
      }, 1000);
    },
    beforeDestroy() {

    },
    methods: {
      //处理表头数据，主要是前两列要锁定，所以给前两列加上fixed字段
      generateHeaderData(data){
        return data.map((child, index) => {
          child.fixed = index < 2;//左数第0,1列锁定
          return child;
        });
      },

      //使用新数据刷新表格
      refreshTable(type){
        //打开loading
        this.loadingVisible = true;
        let newTableData = [];
        let newHeaderData = [];
        if(type === 'empty'){
          newTableData = [];
          newHeaderData = this.generateHeaderData(mockRereshedTableData.headers);//表头数据
        }else{
          newTableData = [].concat(mockRereshedTableData.newDatas);
          newHeaderData = this.generateHeaderData(mockRereshedTableData.headers);//表头数据
        }
        setTimeout(()=>{
          this.tableData = newTableData;
          this.headerData = newHeaderData;
          //关闭loading
          this.loadingVisible = false;
        }, 300)
      }
    }
  }
</script>

<style lang="scss">
  .demo-wrapper {
    width: 90%;
    height: 340px;
  }
  .btn{
    padding: 4px;
    cursor: pointer;
    display: inline-block;
    margin: 10px 10px 0 0;
  }
</style>
