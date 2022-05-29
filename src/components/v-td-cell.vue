<template>
<!-- Template string лучше выглядит https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Template_literals -->
  <td
      :style="style"
      class="table__cell cell"
      :class="`${classes} ${colorCellClass}`"
      @contextmenu.prevent="getCellForm"
  >
    <div class="cell__content">
      <div v-if="data" class="cell__value">{{ valueInOutput }}</div>
      <div v-if="unit && valueInOutput" class="cell__unit">&nbsp;{{unit}}</div>
    </div>
    <div
        v-if="showFormulaMetric && isValue"
        class="cell__true-value-prompt">{{data.value}}</div>
    <v-comment-trigger
        v-if="isComment"
        :dataComment="data.comment"
        @click="handlerClickComment"
    ></v-comment-trigger>
  </td>
</template>

<script>
import vCommentTrigger from './v-comment-trigger'
import mComputedParamsCell from "@/mixins/m-computed-params-cell";
import mComputedFormulaMethods from '@/mixins/m-computed-formula-methods'
import {mapActions, mapGetters} from "vuex";

export default {
  name: "v-td-cell",
  mixins: [mComputedParamsCell, mComputedFormulaMethods],
  components: {
    vCommentTrigger
  },
  mounted() {
    // Соблюдай структуру компонента:
    // name
    // mixins
    // components
    // props
    // data
    // created
    // mounted
    // etc...
    // Коммент про this.isValue, которая выше не определена, но есть ниже.
    // И чтобы мне прочитать mounted, нужно пробежаться по всему файлу, убедиться, что ты завел isValue
    if (this.data.value && this.data.computed_value) {
      this.isValue = this.data.value != this.data.computed_value
    }
    if (this.metricId && this.formula) {
      this.cellsCurrentMetric = this.allCellsInMetric(this.metricId);
      this.processingFormula();
    }
  },
  props: {
    data: {
      type: Object,
      require: false // required: false можно не писать. Это значение по умолчанию в пропсах
    },
    classes: {
      type: String,
      default: '',
      require: false
    },
    normal: {
      require: false,
      default: false
    },
    minimal: {
      require: false,
      default: false
    },
    style: {
      type: Object,
      require: false,
    },
    formula: {
      type: [String, null],
      require: false,
      default: null
    },
    isAround: {
      type: [String, Number],
      require: false,
      default: '0'
    },
    unit: {
      type: [String, null],
      default: null
    },
    metricId: {
      type: [String, Number, null],
      require: true,
      default: null
    },
    isGroup: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isValue: false,

      cellsCurrentMetric: [],
    }
  },
  methods: {
    ...mapActions([
      'FETCH_CELL_FORM',
      'RESET_MODAL',
      'EDIT_MODE_ON',
      'SET_DATA_FOR_COMMENT',
      'SET_DATA_FOR_SUBMIT_FORM']),
    getCellForm() {
      if (this.isGroup) { return false;}
      this.RESET_MODAL()
          .then(()=> {
            this.EDIT_MODE_ON();
            this.FETCH_CELL_FORM({metricId: this.metricId, planedAt: this.data.planed_at})
          })
          .then(() => {
            this.SET_DATA_FOR_SUBMIT_FORM({formType:'cell', metricId: this.metricId, planed_at:this.data.planed_at})
          })
     },
    handlerClickComment() {
      this.SET_DATA_FOR_COMMENT({userName: this.data.uname, commentText: this.data.comment, dateTime: this.data.planed_at});


    },
  },
  computed: {
    ...mapGetters([
      'showFormulaMetric',
      'allCellsInMetric',
      'showInputBlockForWorkingFormula',
      'dataForUpdateInFormulaCell',
      'dataForUpdateInFormulaMetric'
    ]),
    value() {
      return this.data.value;
    },
    isComment() {
      if (this.data && this.data.comment) {
        return true;
      }
      return false;
      // Можно и в одну строчку
      // return this.data && this.data.comment
    },
    defineValueInInputData() {
      // FIXME: старайся избегать вложенных условий
      // Проще сделать исключение if (!this.data) return ''
      // а потом уже вложенное условие.
      // Либо можно вообще по красоте через переменную res
      // Которую будешь менять если условие выполнилось

      if (this.data) {
        if (this.data.computed_value?.toString().length) {
          return this.data.computed_value.toString().replace(/ /g, "");
        } else if (this.data.value?.toString().replace(/ /g, "").length) {
          return this.data.value.toString().replace(/ /g, "");
        }
      }
      return '';
    },
    valueIsAround() {
      let value = this.defineValueInInputData;
      if (this.valueIsNumber && value.length) {
        value = this.around(this.defineValueInInputData);
      }
      return value;
    },
    valueSeparatorThousands() {
      let value = this.valueIsAround;
      if (this.valueIsNumber && value.length) {
        value = this.separatorThousands(value);
      }
      return value;
    },
    valueInOutput() {
      return this.valueSeparatorThousands;
    },
    colorCellClass() {
      // Снова вложенное условие
      // Найди свой способ избегать их
      if (this.data) {
        if (!this.normal || !this.minimal || !this.defineValueInInputData) {
          return '';
        }
        return this.updateColor();
      }
      return '';

    },
    valueIsNumber() {
      if (this.data) {
        return !this.isDateTime(this.defineValueInInputData);
      }
      return true;
    }
  },
  watch: {
    formula() {
      this.processingFormula();
    },
    dataForUpdateInFormulaCell() {

    },
    dataForUpdateInFormulaMetric() {
      this.processingFormula();
    },
    value() {
      this.processingFormula();
    }
  },
  // beforeUpdate() {
  //   if (this.data?.comment) {
  //     this.isComment = true;
  //   }
  //
  // }
}
</script>

<style lang="scss">

.cell {
  padding: 3px;
  border-right: 1px solid #367FA9;
  min-height: 26px;
  background-color: #d9d9d9;
  position: relative;
  &.normal-cell {
    background: #FFD966;
    color: black;
  }
  &.bad-cell {
    background: #EA9999;
    color: black;
  }
  &.good-cell {
    background: #93C47D;
    color: black;
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