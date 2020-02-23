/**
* Created by tangyue on 20/1/3
*/
<template>
  <div class="T-transverseTreeTable"
       :class="{'border': border}">
    <!--主体表格和表头 start -->
    <!-- 表头 start -->
    <TreeTableHeader
            class="main-table-header"
            ref="mainTableHeader"
            :rows="rows"
            :allColumns="allColumns"
            :headerData="tableHeaderData"
            :headWrapperStyleObj="headWrapperStyleObj"
    >
    </TreeTableHeader>
    <!-- 表头 end -->

    <!-- 表体 start -->
    <TreeTable ref="mainTableBody"
               class="main-table-body"
               :data="tableBodyData"
               :cellWidth="cellWidth"
               :bodyWrapperStyleObj="bodyWrapperStyleObj"
    >
    </TreeTable>
    <!-- 表体 end -->
    <!--主体表格和表头 end -->

    <!--列锁定 start -->
    <template v-if="fixedColumns && fixedColumns.length">
      <!--TODO mousewheele事件-->
      <!--v-mousewheel="handleFixedMousewheel"-->

      <FixedColumns
              :leftFixedClass="leftFixedClass"
              :fixedColumnsStyleObj="fixedColumnsStyleObj"
      >
        <template v-slot:header>
          <TreeTableHeader
                  :rows="rows"
                  :allColumns="allColumns"
                  :headerData="tableHeaderData"
                  :headWrapperStyleObj="headWrapperStyleObj">
          </TreeTableHeader>
        </template>
        <template v-slot:body>
          <TreeTable ref="fixedTableBody"
                     :data="tableBodyData"
                     :cellWidth="cellWidth"
                     :bodyWrapperStyleObj="bodyWrapperStyleObj"
          >
          </TreeTable>
        </template>
      </FixedColumns>
    </template>
    <!--列锁定 end -->

    <!--loading 层 start-->
    <template v-if="loading">
      <div class="table-loading">
        <slot name="loadingLayer"></slot>
      </div>
    </template>
    <!--loading 层 end-->

    <!--空数据层 start-->
    <template v-if="showEmpty">
      <div class="table-body-empty"
           :style="emptyWrapperStyleObj">
        <img class="img" src="../assets/image/nodata.png" alt="">
      </div>
    </template>
    <!--空数据层 end-->
  </div>
</template>

<script>
  import {throttle} from 'throttle-debounce';
  import TreeTableHeader from './TreeTableHeader.vue'
  import TreeTable from './TreeTable.vue'
  import FixedColumns from './FixedColumns.vue'

  export default {
    name: 'transverseTreeTable',
    components: {
      TreeTableHeader,
      TreeTable,
      FixedColumns
    },
    props: {
      loading: {
        type: Boolean,
        default() {
          return false
        }
      },
      tableData: {
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
      columnWidth: {
        type: Number,
        default() {
          return 100 // 默认列宽100
        }
      },
      // 样式相关
      border: {
        type: Boolean,
        default() {
          return true// 默认有边框的表格
        }
      }
    },
    data() {
      return {
        tableBodyData: [],//表体数据
        tableHeaderData: [], //表头数据
        cellWidth: 100,//默认列宽
        fixedColumns: [],//固定列,
        rows: [],//表头行数据
        allColumns: [],
        tableHeaderWidth: 0,//表头的宽度
        headWrapperStyleObj: {},//表头样式
        bodyWrapperStyleObj: {},//表体样式
        leftFixedClass: '',
        fixedColumnsStyleObj: {},//锁定列的样式
        mainTableBodyEle: null,//主表体元素
        showEmpty: false,//显示无数据样式
        emptyWrapperStyleObj: {},//空数据层的样式
      }
    },
    created() {
      this.cellWidth = this.columnWidth;
    },
    mounted() {
      let mainTableBodyEle = this.mainTableBodyEle = this.$refs.mainTableBody ? this.$refs.mainTableBody.$el : this.$refs.mainTableBody;
      mainTableBodyEle.addEventListener('scroll', this.syncPosition);
    },
    watch: {
      tableData(newData, oldData) {
        this.tableBodyData = newData;
      },
      tableBodyData(n, o) {
        //如果是空数据，则显示空数据层
        if (n && n.length) {
          this.showEmpty = false;
          this.$nextTick(() => {
            //获取主表体的内高度，设置为固定列的高度
            var ele = this.$refs.mainTableBody;
            var mainTableHeader = this.$refs.mainTableHeader;
            let headerHeight = mainTableHeader.$el.offsetHeight || 64;//实时计算表头高度，因为表头高度会变化。默认高度64
            //表头高度变化后，更新表体的高度
            this.bodyWrapperStyleObj = Object.assign(
              {},
              this.bodyWrapperStyleObj,
              {
                height: `calc(100% - ${headerHeight}px)`
              }
            );
            // 表体高度变化后，计算固定列的高度
            this.$nextTick(() => {
              let clientHeight = ele.$el ? ele.$el.clientHeight : ele.clientHeight || 0;
              if (clientHeight) {
                this.fixedColumnsStyleObj = Object.assign(
                  {
                    height: `${clientHeight + headerHeight}px`
                  },
                  this.fixedColumnsStyleObj
                );
              }
              this.$nextTick(() => {
                //检查主表体的 scrollTop，如果主表体有scrollTop，则需要把固定列也滑动相应的距离。
                // 场景主要见于上下滚动后，再刷新数据，会引起固定列的上下位置不对
                let scrollTop = this.mainTableBodyEle.scrollTop;
                if (scrollTop) {
                  let fixedTableBody = this.$refs.fixedTableBody;
                  fixedTableBody.$el.scrollTop = scrollTop;
                }
              })
            });
          })
        } else {
          this.showEmpty = true;
        }
      },
      //mainTableBody
      headerData(newData, oldData) {
        this.tableHeaderData = newData;
      },

      tableHeaderData(val, oldData) {
        // 处理表头数据，整理出行和列数据，并使行列数据格式成为前端需要的格式
        this.rows = this.generateRows(val, 'detail', this.cellWidth);
        this.$nextTick(()=>{
          //计算表头的实际高度，由此算出empty层应该有的高度。
          // 无论empty层是否显示，都先计算应有高度
          let mainHeaderHeight = this.$refs.mainTableHeader.$el.offsetHeight;
          this.emptyWrapperStyleObj = Object.assign({},{
            height: `calc(100% - ${mainHeaderHeight}px)`
          });
        })
      },

      fixedColumns(newArr, o) {
        //计算锁定列的宽度
        let width = 0;
        newArr.forEach(i => {
          width += i.width;
        });
        this.fixedColumnsStyleObj = {
          width: `${width}px`
        };
      }
    },

    methods: {
      //表格滚动时，更新表格的样式
      syncPosition: throttle(5, function () {
        //滚动条左边距离
        console.log('throttle syncPosition')
        let scrollLEFT = this.mainTableBodyEle.scrollLeft;
        let scrollTop = this.mainTableBodyEle.scrollTop;
        let fixedTableBody = this.$refs.fixedTableBody;
        let mainTableHeader = this.$refs.mainTableHeader;
        //暂定为滚动距离超过10以后才更新页面样式
        if (scrollLEFT > 10) {
          this.leftFixedClass = 'show-right-shadow';
        } else {
          this.leftFixedClass = '';
        }
        //主表体上下滚动时，同时更新锁定列的表体的上下滚动距离
        if (fixedTableBody) fixedTableBody.$el.scrollTop = scrollTop;
        //主表体左右滚动时，同时更新主表头的内元素左右滚动距离
        if (mainTableHeader) {
          mainTableHeader.$el.getElementsByClassName('my-table')[0].style.marginLeft = `-${scrollLEFT}px`;
        }

      }),
      generateRows(originColumns, childrenKeyText, columnWidth) {
        let maxLevel = 1;
        let childrenKeyTxt = childrenKeyText || 'children';
        const traverse = (column, colWidth, parent) => {
          if (parent) {
            column.level = parent.level + 1;
            if (colWidth) {
              let _count = column.col || 1;
              column.width = colWidth * _count;
              this.tableHeaderWidth += column.width;
            }
            if (maxLevel < column.level) {
              maxLevel = column.level;
            }
          }
          if (column[childrenKeyTxt]) {
            let colSpan = 0;
            // 当一个节点有子节点时，所计算的表头宽度需要减去当前节点的宽度
            this.tableHeaderWidth -= column.width;
            column[childrenKeyTxt].forEach((subColumn) => {
              traverse(subColumn, colWidth, column);
              colSpan += subColumn.colSpan;
            });
            column.colSpan = colSpan;
          } else {
            column.colSpan = 1;
          }
        };

        originColumns.forEach((column) => {
          column.level = 1;
          if (columnWidth) {
            let _count = column.col || 1;
            column.width = columnWidth * _count;
            this.tableHeaderWidth += column.width;
          }
          traverse(column, columnWidth);
        });
        const rows = [];
        for (let i = 0; i < maxLevel; i++) {
          rows.push([]);
        }

        const allColumns = this.allColumns = this.getAllColumns(originColumns, childrenKeyTxt);
        this.headWrapperStyleObj = {
          width: `${this.tableHeaderWidth}px`
        };
        allColumns.forEach((column, index) => {
          if (!column[childrenKeyTxt]) {
            column.rowSpan = maxLevel - column.level + 1;
          } else {
            column.rowSpan = 1;
          }
          // 前两列锁定
          if (index < 2) {
            column.fixed = true;
          }
          rows[column.level - 1].push(column);
        });

        this.fixedColumns = allColumns.filter(c => c.fixed === true);
        return rows;
      },
      getAllColumns(columns, childrenKeyText) {
        const result = [];
        let childrenKeyTxt = childrenKeyText || 'children';
        columns.forEach((column) => {
          if (column[childrenKeyTxt]) {
            result.push(column);
            result.push.apply(result, this.getAllColumns(column[childrenKeyTxt], childrenKeyTxt));
          } else {
            result.push(column);
          }
        });
        return result;
      },

      // 锁定列的鼠标滚动
      handleFixedMousewheel() {

      }

    }
  }
</script>

<!--引入组件样式-->
<style lang="scss">
  @import "../assets/normalize.scss";
  @import "../assets/common.scss";
  @import "../assets/proj.scss";
</style>