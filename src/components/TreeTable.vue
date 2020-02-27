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
      },
      renderEndHandle: {
        type: Function,
        default () {
          return ()=>{}
        }
      }
    },
    data(){
      return {
        renderEnd: {}// 粗略的记一下大概的页面渲染完成的时间，即以updated的时间为标识。目前有2个父组件：fixedColumns transverseTreeTable
      }
    },
    created(){
      this.parentVue = this.$parent;
    },
    mounted(){
      console.log('treeTable.vue mounted', this.parentVue.$options.name);
    },
    updated(){
      let parentVueName = this.parentVue.$options.name;
      console.log('treeTable.vue updated', parentVueName);
      this.renderEnd[parentVueName] = true;
      // 当被transverseTreeTable引用时，即通知关闭loading
      if(parentVueName === 'transverseTreeTable'){
        this.$emit('renderEnd')
      }
    }
  }
</script>