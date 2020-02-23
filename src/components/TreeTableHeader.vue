/**
* Created by tangyue on 20/1/6
* 表头
*/
<template>
  <div class="T-transverseTreeTable-header"
       ref='myHeadWrapper'
       :style="headWrapperStyleObj"
       >
      <table
              class="my-table"
              cellspacing="0"
              cellpadding="0"
              border="0">
        <colgroup>
          <template v-for="it in allColumns">
            <col :width="it.width"/>
          </template>
        </colgroup>
        <thead>
        <tr v-for="row in rows">
          <th v-for="col in row"
              class="head-col"
              :colSpan="col.colSpan"
              :rowSpan="col.rowSpan">
            <div class="col-inner">
              {{col.headerName}}
            </div>
          </th>
        </tr>
        </thead>
      </table>
  </div>
</template>

<script>
  export default {
    name: 'treeTableHeader',
    props: {
      rows: {
        type: Array,
        default() {
          return []
        }
      },
      allColumns:  {
        type: Array,
        default() {
          return []
        }
      },
      headerData: {
        type: Array,
        default() {
          return []
        }
      },
      headWrapperStyleObj: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        fixedColumns: [],
        tableHeaderWidth: 0,// 表头的宽度
      }
    },
    created() {

    },
    mounted() {

    },
    watch: {
      // headerData(val, oldData) {
      //   // 处理表头数据，整理出行和列数据，并使行列数据格式成为前端需要的格式
      //   this.rows = this.generateRows(val, 'detail', this.cellWidth);
      // },
      // fixedColumns(val, oldData){
      //   //如果有固定的列，则通知父组件渲染固定列
      //   if(val && val.length){
      //     this.$parent.fixedColumns = val;
      //     this.$parent.rows = this.rows;
      //   }
      // }
    },
    methods: {

    }
  };
</script>

<style scoped>

</style>