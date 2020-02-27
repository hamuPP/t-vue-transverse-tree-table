/**
* Created by tangyue on 20/2/24
*/
<template>
  <div class="flat-nodes-group"
       :style="groupStyleObj()">
    <div v-for="it in dataList"
         class="text-node flat-text-node"
         :style="textNodeStyle(it)">
      <div class="inner-text">
        {{it.name}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "flat-text-node",
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        dataList: [],
      }
    },
    watch: {
      data(newData) {
        this.dataList = this.changeData(newData);
      },
    },
    created() {
      //把data转换为平级结构
      this.dataList = this.changeData(this.data);
    },
    methods: {
      //次方法只适用于具体的场景，例如本场景的数组都是只有一个成员
      changeData(dataArr) {
        let resultArr = [];
        let _recusData = (dataList) => {
          let newChild = Object.assign({}, dataList[0]);
          let childChilren = dataList[0].children;// 子节点的子们
          delete newChild.children;
          resultArr.push(newChild);
          if (childChilren && childChilren.length) {
            _recusData(childChilren);
          }
        };
        _recusData(dataArr);
        // 数据已经转换为平级
        return resultArr;
      },
      //设置text-node元素的样式 todo这个方法是从TreeTableUl.vue复制来的，后期抽取
      textNodeStyle(cellData) {
        let num = 1;
        let basciCellWidth = this.cellWidth || 100;
        let result = {};
        if (cellData && cellData.col) {
          num = cellData.col;
        }
        result = {
          width: `${basciCellWidth * num}px`
        };
        if (cellData && cellData.textAlign) {
          result.textAlign = cellData.textAlign;
        }
        return result;
      },
      groupStyleObj() {
        let sumWidth = 0;
        let data = this.dataList;
        let basciCellWidth = this.cellWidth || 100;
        let result = {};
        for (let i = 0, len = data.length; i < len; i++) {
          let cellData = data[i];
          let num = 1;
          if (cellData && cellData.col) {
            num = cellData.col;
          }
          sumWidth += num * basciCellWidth;
        }
        if (sumWidth > 0) {
          result =  {
            width: `${sumWidth}px`
          };
        }
        return result;
      }
    }
  }
</script>

<style lang="scss">
  .flat-nodes-group {
    overflow: hidden;
    .flat-text-node {
      float: left;
    }
  }
</style>