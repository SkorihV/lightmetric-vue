<template>
  <td
      :style="style"
      class="table__cell cell"
      :class="classes"
  >
    <div class="cell__content">
      <div v-if="cellValue !== ''" class="cell__title">{{cellValue}}</div>
      <div v-if="unit && cellValue !== ''" class="cell__unit">&nbsp;{{unit}}</div>
    </div>
  </td>
</template>

<script>
export default {
  name: "v-td-cell-void",
  props: {
    classes: {
      type: String,
      default: '',
    },
    title: {
      type: [String, Number],
    },
    style: {
      type: Object,
    },
    unit: {
      type: [String, null],
      default: null
    },
    height: {
      type: String,
      default: ''
    }
  },
  methods: {
    isDateTime(value){
      if (!value) {return false}
      return  value.toString().match('[0-9]+:[0-5][0-9](:[0-5][0-9])?') !== null;
    },
  },
  computed: {
    cellValue() {
      if (this.isDateTime(this.title)) {
        return this.title;
      } else if (!isNaN(parseFloat(this.title)) && !isNaN(Number(this.title))) {
        return Number(this.title)
      } else {
        return this.title?.split('-').length === 2 ? this.title : '';
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.cell {
  padding: 3px;
  border-right: 1px solid #367FA9;
  min-height: 26px;
  background-color: #d9d9d9;
  position: relative;
  &:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-right: 1px solid #367FA9;
  }
  &__position {
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 5;
    width: 50px;
    min-width: 50px;
    display: flex;
  }
  &__minimal {
    position: -webkit-sticky;
    position: sticky;
    left: 353px;
    z-index: 15;
    min-width: 90px;
    width: 90px;
    text-align: center;
  }
  &__normal {
    position: sticky;
    left: 443px;
    z-index: 20;
    min-width: 90px;
    width: 90px;
    text-align: center;
  }
  &__content {
    display: flex;
    justify-content: center;
    flex: 1 0 100%;
  }
  &__true-value-prompt {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    background: white;
    padding: 4px;
    z-index: 150;
    border-radius: 4px;
    border: 1px dashed #367fa9;
    min-width: 150px;
    justify-content: center;
  }
  &:hover .cell__true-value-prompt {
    display: flex;
  }
}

.gray-color {
  background: #CCCCCC;
}

</style>