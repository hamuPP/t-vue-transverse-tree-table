/**
* 锁定的列，目前只支持从左往右的连续的列
* Created by tangyue on 20/1/6
*/
<template>
  <div class="left-fixed"
       :class="leftFixedClass"
       :style="fixedColumnsStyleObj"
       >
    <!--锁定的表头-->
    <slot name="header"></slot>

    <!--锁定列的表体-->
    <slot name="body"></slot>
  </div>
</template>

<script>
  export default {
    name: 'fixedColumns',
    props: {
      leftFixedClass: {
        type: String,
        default () {
          return ''
        }
      },
      fixedColumnsStyleObj: {
        type: Object,
        default () {
          return {}
        }
      }
    }
  }
</script>