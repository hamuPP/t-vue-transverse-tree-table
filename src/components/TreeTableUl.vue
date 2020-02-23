/**
* Created by tangyue on 20/1/6
*/
<template>
  <ul v-if="tableData && tableData.length"
      class="ul"
      :data-keyCount="keyCount"
      :class="classObj"
      :style="styleObject"
  >
    <li class="li"
        v-for="it in tableData"
        v-if="it"
        :key="it.name"
        :class="liClassObj">
      <div ref="textNode"
           class="text-node"
           :style="textNodeStyle(it)">
        <div class="inner-text">
          {{it.name}}
        </div>
      </div>
      <TreeTableUl v-if="it.children && it.children.length && it.children !==[null]"
                   :data="it.children"
                   :cellWidth="cellWidth"
                   :dataKey="keyCount">
      </TreeTableUl>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'TreeTableUl',
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      dataKey: {
        type: Number,
        default() {
          return 0
        }
      },
      cellWidth: {
        type: Number,
        default() {
          return 100;//单元格的宽度。默认100px
        }
      }
    },
    computed: {
      classObj() {
        return `ul_${this.keyCount}`;
      },
      liClassObj() {
        return `li_${this.keyCount}`;
      }
    },
    data() {
      return {
        keyCount: 1,//该组件、也是Ul的计数
        tableData: [],
        styleObject: {},
      }
    },

    watch: {
      data(newData, oldData) {
        this.tableData = newData;
      },

      tableData(val) {

      }
    },
    created() {
      this.tableData = this.data;
      //keyCount 增加
      this.keyCount += this.dataKey;
      // vueTreeTable.calcMaxCellSum(this.keyCount);
    },

    mounted() {

    },
    methods: {
      /**
       * 找到父vue，如果有parentName则找到该名的父，若没有、则找其直接的父或者根
       * @param scope
       * @param parentName
       * @returns {*|Vue}
       */
      getParentVueCompent(scope, parentName) {
        let that = scope;
        if(parentName){
          let parent = that.$parent;
          let name = parent.$options.name;
          while (parent && name !== parentName) {
            parent = parent.$parent;
            if (parent){
              name = parent.$options.name;
            }
          }
          return parent;
        }else{
          return that.$parent || that.$root;
        }
      },
      //设置text-node元素的样式
      textNodeStyle(cellData) {
        let num = 1;
        let basciCellWidth = this.cellWidth || 100;
        let textAlign = '';
        let result = {};
        if(cellData && cellData.col){
          num = cellData.col;
        }
        result = {
          width: `${basciCellWidth * num}px`
        };
        if(cellData && cellData.textAlign){
          result.textAlign = cellData.textAlign;
        }
       return result;
      },
    }
  }
</script>