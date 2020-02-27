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
  import mockTableData from './mockData/basicDemoAll2.json'
  // import mockTableData from './mockData/basicDemoData.json'
  // import mockTableData from './mockData/basicDemoData'
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
    },
    mounted() {
      //模仿请求接口数据
      setTimeout(()=>{
        this.startRenderPageTime = new Date().getTime();
        setTimeout(()=>{
          this.tableData = this.formateTableBodyData(mockTableData.newDatas);//表格正文数据
          this.headerData = this.generateHeaderData(mockTableData.headers);//表头数据
          // 请求数据完成、关闭loading
          this.loadingVisible = false;
        }, 1000)
      }, 1000);
    },
    beforeDestroy() {

    },
    updated(){
      this.endeRenderPageTime = new Date().getTime();
      console.log('渲染页面时长:', (this.endeRenderPageTime - this.startRenderPageTime)/1000 + 's')
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
      },
      _recusData(dataList, childrenName){
        return dataList.map((child, index) => {
          if(child.level === 0){//即为最后一个节点
            child.flatStartNode = true;
          }else if(child.level > 0 && child[childrenName] && child[childrenName].length){
            this._recusData(child[childrenName], childrenName);
          }
          return child;
        });
      },
      /**
       * 将表格正文数据处理成前端所需的格式
       * @param metaDataArr 原始数据，一般为从后台请求到的初始数据
       */
      formateTableBodyData(metaDataArr){
        // 原始数据中字段level为0的，即为树形结构的最后一节，故给该数据加上一个标识：flatStartNode.
        // 从此节点往后的数据都平铺，不再使用嵌套的ul li结构
        let resultArr = this._recusData(metaDataArr, 'children');
        // todo resultArr 和 metaDataArr相同，后期是否改为互不影响的数据？深拷贝？
        return resultArr;
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
