/**
* Created by tangyue on 20/1/6
* 表格正文区域
*/
<template>
  <div class="T-transverseTreeTable-body" :style="bodyWrapperStyleObj">
    <TreeTableUl :data="data"
                 :cellWidth="cellWidth"
                 :dataKey="0">
    </TreeTableUl>
  </div>
</template>

<script>
  import TreeTableUl from './TreeTableUl.vue'

  export default {
    name: "treeTable",
    components: {
      TreeTableUl
    },
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      cellWidth: {
        type: Number,
        default () {
          return 100//单元格的宽度。默认100px
        }
      },
      bodyWrapperStyleObj: {
        type: Object,
        default () {
          return {}
        }
      }
    },
  }
</script>

<style scoped>

</style>