<template>
  <td
      :style="style"
      class="table__cell cell"
      :class="[classes, colorCellClass, {isEditValue: isEditValue, discussedWeek: getDiscussedWeek === this.data.planed_at}]"
      @contextmenu.prevent="getCellForm"
      @dblclick.stop="handlerDbClickCell"

  >
    <div class="cell__content">
      <div v-if="data && !isEditValue" class="cell__value">{{ valueInOutput }}</div>
      <div v-if="unit && !isEditValue && valueInOutput" class="cell__unit">&nbsp;{{unit}}</div>
<!--      <div v-if="isEditValue" v-html="htmlForModal"></div>-->
      <input
          class="cell__input"
          v-if="isEditValue"
          :value="data?.value"
          @change="updateDataCell"
          @blur="hideInput"
          @vnode-mounted="({ el }) => el.focus()"
      >
    </div>
    <div
        v-if="showFormulaMetric && isValue"
        class="cell__true-value-prompt">{{data.value}}</div>
    <v-comment-trigger
        v-if="isComment"
        :dataComment="data.comment"
        @click.stop="handlerClickComment"
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
  props: {
    data: {
      type: Object,
    },
    classes: {
      type: String,
      default: '',
    },
    normal: {
      default: false
    },
    minimal: {
      default: false
    },
    style: {
      type: Object,
    },
    formula: {
      type: [String, null],
      default: null
    },
    isAround: {
      type: [String, Number],
      default: '0'
    },
    unit: {
      type: [String, null],
      default: null
    },
    metricId: {
      type: [String, Number, null],
      required: true,
      default: null
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    categoryId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      isValue: false,
      isEditValue: false,
      valueChanged: false,
      htmlForm: '',
      cellsCurrentMetric: [],
    }
  },
  mounted() {
    if (this.data.value && this.data.computed_value) {
      this.isValue = this.data.value != this.data.computed_value
    }
    if (this.metricId && this.formula) {
      this.cellsCurrentMetric = this.allCellsInMetric(this.metricId);
      this.$nextTick(() => {
        this.processingFormula();
      })
    }
  },
  methods: {
    ...mapActions([
      'FETCH_CELL_FORM_CONTEXT',
      'RESET_MODAL',
      'EDIT_MODE_ON',
      'SET_DATA_FOR_COMMENT',
      'SET_DATA_FOR_SUBMIT_FORM',
      'FETCH_CELL_FORM_VALUE',
      'ADD_HTML_IN_MODAL',
      'SET_DATA_FOR_UPDATING_COMPUTED_VALUE',
      'SET_PLANED_AT_FOR_UPDATE_FORMULA_IN_CELL'

        ]),
    getCellForm() {
      if (this.isGroup) { return false;}
      this.RESET_MODAL()
          .then(() => {
            this.EDIT_MODE_ON();
            this.FETCH_CELL_FORM_CONTEXT({metricId: this.metricId, planedAt: this.data.planed_at})
          })
          .then(() => {
            this.SET_DATA_FOR_SUBMIT_FORM({formType:'cell', metricId: this.metricId, planed_at:this.data.planed_at})
          })
     },
    handlerClickComment() {
      this.SET_DATA_FOR_COMMENT({userName: this.data.uname, commentText: this.data.comment, dateTime: this.data.updated_at});
    },
    handlerDbClickCell() {
      this.isEditValue = true;
      this.RESET_MODAL()
    },
    updateDataCell(e) {
      this.SET_PLANED_AT_FOR_UPDATE_FORMULA_IN_CELL(this.data.planed_at)
      this.data.value = e.target.value.trim();
        this.FETCH_CELL_FORM_VALUE({metricId: this.metricId, planedAt: this.data.planed_at, newValue: this.data.value})
        //    .then(() => {
        //          this.$nextTick(() => {
        //             this.processingFormula();
        //            })
        // })
    },
    hideInput() {
      this.isEditValue = false;
    }
  },
  computed: {
    ...mapGetters([
      'showFormulaMetric',
      'allCellsInMetric',
      'showInputBlockForWorkingFormula',
      'getPlanedAtForUpdateInFormulaCell',
      'getDataForUpdateInFormulaMetric',
      'htmlForModal',
      'getDataForSubmitForm',
      'getDiscussedWeek',
      'isProcessingFormulaForCategory',
      'isProcessingFormulaForCell'
    ]),
    value() {
      return this.data.value;
    },
    isComment() {
      return this.data && this.data.comment;

    },
    defineValueInInputData() {

      if (!this.data) { return '';}

      if (this.data.computed_value?.toString().length) {
        return this.data.computed_value.toString().replace(/ /g, "");
      } else if (this.data.value?.toString().replace(/ /g, "").length) {
        return this.data.value.toString().replace(/ /g, "");
      }
      return '';
    },
    valueIsAround() {
      let value = this.defineValueInInputData;

      if (this.valueIsNumber && value.length && this.isAround == '1') {
        value = parseFloat(value).toFixed(2);
      } else if (this.valueIsNumber && value.length && this.isAround == '0') {
        value = parseInt(value).toFixed(0);
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
      if (!this.data || !this.normal || !this.minimal || !this.defineValueInInputData) {
        return '';
      }
      return this.updateColor();
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
      // console.log('fprmula', this.data.value, ' - value', this.data.computed_value, ' - computed_value',  11112)


      this.$nextTick(() => {

        // console.log('fprmula', this.data.value, ' - value', this.data.computed_value, ' - computed_value',  2222233)
        this.processingFormula();
      })

    },
    valueInOutput() {
      // console.log('valueInOutput', this.data.value, ' - value', this.data.computed_value, ' - computed_value', 1111)

      this.$nextTick(() => {
        // console.log('valueInOutput', this.data.value, ' - value', this.data.computed_value, ' - computed_value', 2222)
        this.processingFormula();

      });
    },
    isProcessingFormulaForCell() {
      // console.log('isProcessingFormulaForCell' , this.data.value, ' - value', this.data.computed_value, ' - computed_value')
      if (this.getPlanedAtForUpdateInFormulaCell === this.data.planed_at) {
        // console.log('isProcessingFormulaForCell' , this.data.value, ' - value', this.data.computed_value, ' - computed_value', this.getPlanedAtForUpdateInFormulaCell, this.data.planed_at )
        this.processingFormula();
      }
    },

    /*Запускать обновление в случае изменения формулы в таблице*/
    isProcessingFormulaForCategory () {
      if (this.getDataForUpdateInFormulaMetric === this.categoryId) {
        // console.log('isProcessingFormulaForCategory' , this.data.value, ' - value', this.data.computed_value, ' - computed_value', this.getDataForUpdateInFormulaMetric,   this.categoryId)
        this.processingFormula();
      }
    },
    isEditValue(){
      if (this.isEditValue) {
        this.SET_DATA_FOR_SUBMIT_FORM({formType:'cell', metricId: this.metricId, planed_at: this.data.planed_at})
      }
    },
  },
  // beforeUpdate() {
  //   console.log('beforeUpdate' , this.data.value, ' - value', this.data.computed_value, ' - computed_value')
  //   this.processingFormula();
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
  min-width: 100px;
  &.isEditValue{
    padding: 0;
  }
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
    min-height: 15px;
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
  #content  {
    .form-group {
      display: none;
      margin-bottom: 0;
    }
    .form-group.editValue {
      display: flex;
      label {
        display: none;
      }

      #week_cell_form_value {
        width: 0;
        min-width: 100%;
        text-align: center;
      }
    }
    .delete,
    .delete-comment-cell{
      display: none;
    }
  }

  &__input {
    border-radius: 0;
    box-sizing: border-box;
    width: 0;
    height: auto;
    min-width: 100%;
    border: none;
    padding: 4px 12px;
    margin: 0;
    display: flex;
    text-align: center;

    &:focus {
      border: none;
      border-radius: 0;
      outline: none;
      padding: 4px 12px;
    }
  }

}
.gray-color {
  background: #CCCCCC;
}

.discussedWeek {
  box-shadow: 0 0 4px 0 #367fa9 inset, 0 0 50px 50px #fdfdfd54 inset;
  /* filter: brightness(1.1); */
}

</style>