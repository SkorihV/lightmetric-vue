<template>
  <td
      :style="style"
      class="table__cell cell"
      :class="[classes, colorCellClass, {isEditValue: isEditValue, discussedWeek: getDiscussedWeek === data.planed_at}]"
      @contextmenu.prevent="getCellForm"
      @dblclick.stop="handlerDbClickCell"
      @mouseover="handlerOver"
      @mouseleave="handlerLeave"
  >
    <div class="cell__content">
      <template v-if="!isEditValue && valueInOutput?.length">
        <div class="cell__value">{{ valueInOutput }}</div>
        <div v-if="unit" class="cell__unit">&nbsp;{{unit}}</div>
      </template>
      <input
          class="cell__input"
          v-if="isEditValue"
          v-model.lazy.trim="inputValue"
          @blur="hideInput"
          @keydown.enter="submitInput"
          @vnode-mounted="({ el }) => el.focus()"
      >
    </div>
    <div
        v-if="showFormulaMetric && showPromptTrueValue "
        class="cell__true-value-prompt">{{data?.value}}</div>
    <v-comment-trigger
        v-if="isComment"
        :dataComment="data?.comment"
        @click.stop="handlerClickComment"
    ></v-comment-trigger>
      <v-average-popup
        :metricName = "metricName"
        :averageValues="averageValues"
        :showAverageBlock="showAverageBlock"
        :years="years"
      ></v-average-popup>
  </td>
</template>

<script>
import vCommentTrigger from './v-comment-trigger'
import mComputedParamsCell from "@/mixins/m-computed-params-cell";
import mComputedFormulaMethods from '@/mixins/m-computed-formula-methods';
import vAveragePopup from "./v-average-popup"


import {
  watch,
  computed,
  reactive,
  ref,
  toRef,
  nextTick,
  } from 'vue';
import {useStore} from 'vuex';
import {updateColor} from '@/composable/utils/u-computed-params-sell';
import {isTime, separatorThousands, evalValue, getArrayParams} from '@/composable/utils/utils';

import {useStoreGetters, useStoreActions} from '@/composable/use/useStore'


export default {
  name: "v-td-cell",
  mixins: [mComputedParamsCell, mComputedFormulaMethods],
  components: {
    vCommentTrigger,
    vAveragePopup
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
    },
    years: {
      type:Object
    },
    metricName: {
      type:String
    },
    averageValues: {
      type:Object
    }
  },

  setup(props){
    const store = useStore();
    const {dispatch, commit} = store;
    const {
      getDiscussedWeek,
      showFormulaMetric,
      isProcessingFormulaForCell,
      metricForId,
      allMetrics,
      isAverageMode,
      getCategoryIdForProcessingFormulaInCells,
      } =  useStoreGetters();

    const {
      SET_COMPUTED_VALUE,
      SET_DATA_FOR_UPDATING_COMPUTED_VALUE,
    } = useStoreActions();

    let showPromptTrueValue = ref(false);
    let isEditValue         = ref(false);
    let value               = null;
    let showAverageBlock    = ref(false);

    const p           = reactive(props);
    const data        = reactive(p.data);
    const metricId    = toRef(p, 'metricId');
    const formula     = toRef(p, 'formula');
    const isGroup     = toRef(p, 'isGroup');
    const isAround    = toRef(p, 'isAround');
    const normal      = toRef(p, 'normal');
    const minimal     = toRef(p, 'minimal');
    const categoryId  = toRef(p, 'categoryId');
    const years       = toRef(p, 'years');
    const metricName  = toRef(p, 'metricName');

    const averageValues = reactive(p.averageValues);

    let inputValue    = ref(data?.value || '');
    if (data?.value) {
      value = toRef(data, 'value')
    }

    const colorCellClass = computed(() => (data && normal.value !== '' && minimal.value !== '' && defineValueInInputData.value !== '')
        ? updateColor(defineValueInInputData.value.toString(), normal.value, minimal.value)
        : '');

    if (data?.value && data?.computed_value) {
      showPromptTrueValue = data?.value.toString() !== data?.computed_value.toString();
    }

    const isComment = computed(() => data && data?.comment)

    const getCellForm = () => {
      if (isGroup.value) { return false;}

      dispatch('RESET_MODAL')
          .then(() => {
            dispatch('EDIT_MODE_ON');
            dispatch('FETCH_CELL_FORM_CONTEXT', {metricId: metricId.value, planedAt: data.planed_at})
          })
          .then(() => {
            dispatch('SET_DATA_FOR_SUBMIT_FORM', {formType:'cell', metricId: metricId.value, planed_at: data.planed_at})
          })
    }
    const handlerClickComment = () =>  {
      dispatch('SET_DATA_FOR_COMMENT',{userName: data.uname, commentText: data.comment, dateTime: data.updated_at});
    }
    const handlerDbClickCell = () =>  {
      if (isGroup.value) { return false;}
      isEditValue.value = true;
      dispatch('RESET_MODAL');
    }

    const hideInput = () => {
      isEditValue.value = false;
    }
    const submitInput = () => {
      hideInput();
    }

    watch(inputValue, (newValue) => {
      dispatch('SET_PLANED_AT_FOR_UPDATE_FORMULA_IN_CELL',(data.planed_at))
          .then(()=> {
            dispatch('SET_DATA_FOR_SUBMIT_FORM', {formType:'cell', metricId: metricId.value, planed_at: data.planed_at})
          })
          .then(() => {
            dispatch('FETCH_CELL_FORM_VALUE',{metricId: metricId.value, planedAt: data.planed_at, newValue: newValue})
          })
    })

    /*Блок по работе со значением в ячейке*/

    const defineValueInInputData = computed(() => {
      if (!data) { return '';}

      if (data.computed_value !== null) {
        return data.computed_value.toString().replace(/ /g, "");
      }
      if(data?.value){
        return data.value.toString().replace(/ /g, "");
      }

      return '';
    })

    const valueIsNumber = computed(() => (data) ? !isTime(defineValueInInputData.value) : true );

    /**
     * Обработать значение на дробную часть
     * @type {ComputedRef<unknown>}
     */
    const processingValueIsAround = computed(() => {
      let value = defineValueInInputData.value;
      const valueLength = value.length;
      if (!valueIsNumber.value) {return value;}
      if (!valueLength || isNaN(parseInt(value))) {return '';}


      if (isAround.value == 1 || isAround.value === true ) {
        return Number(parseFloat(value).toFixed(2));
      } else if (isAround.value == 0 ||  isAround.value === false) {
        return Number(parseInt(value).toFixed(0));
      }
    })

    /**
     * Обработать значение на тысячные и добавить пробелы-разделители
     * @type {ComputedRef<T>}
     */
    const valueSeparatorThousands = computed(() => {
      let value = processingValueIsAround.value;
      const valueLength = value?.toString().length;
      if (valueIsNumber.value && valueLength) {
        value = separatorThousands(value);
      }
      return value;
    })

    const valueInOutput = computed(() => {
      return valueSeparatorThousands.value;
    })

    //Блок по работе с формулами//

    /**
     * Запускаем расчет формулы при изменении в ячейки
     */
    watch(isProcessingFormulaForCell,() => {
     if(isProcessingFormulaForCell && parseInt(getCategoryIdForProcessingFormulaInCells.value) === categoryId.value) {
       nextTick(() => {
         processingFormula(p)
             .then(() => {
               commit('ADD_COUNT_CELLS_IN_PROCESSING');
             });
       })
     }


    })

    /**
     * Расчет значения в ячейке исходя из формулы в строке
     * @param props
     */
    async function processingFormula (props)  {
      const params = getArrayParams(metricForId(props.data.type_id));
      let resultValueString = '';
      let resultData = '';

      if (!isTime(props.data.value)) {
        if (params) {
          resultValueString = generateResultOnFormulaInCell(props.data, params);
          resultData = evalValue(resultValueString) ? evalValue(resultValueString) : '';
        } else if (isTime(props.data.value)) {
          resultData = (props.data.value);
        } else {
          resultData = evalValue(props.data.value) ? evalValue(props.data.value) : '';
        }

        if (!isNaN(parseFloat(resultData))) {
          resultData = Math.round(resultData * 100) / 100;
        }
      } else {
        resultData = props.data.value ?? '';
      }

      if (props.data.computed_value != resultData) {

        await SET_COMPUTED_VALUE({
          metricId: props.data.type_id,
          planedAt: props.data.planed_at,
          value: resultData
        })
        await SET_DATA_FOR_UPDATING_COMPUTED_VALUE({
          computedValue: resultData,
          planed: props.data.planed_at,
          typeId: props.data.type_id,
          metricName: metricName.value
        })
      }

    }

    function generateResultOnFormulaInCell(cell, params) {
      let resultValueString = '';
      if (isTime(cell.value)) { return false; }

      params.forEach ((param) => {
        resultValueString += getFormulaCell(param, cell);
      })
      return evalValue(resultValueString);
    }

    function getFormulaCell(param, cell) {
      const allMetricsArr = allMetrics.value;

      let result = '';
      const isAlias = (param.search(/\$[0-9]+\$/) >= 0);

      if (!isAlias) {
        return  ` ${param} `;
      }

      let needleMetric = null;
      const aliasId = param.match(/[0-9]+/)[0];

      for ( let i = 0; i < allMetricsArr.length; i++) {
        if (allMetricsArr[i].id === aliasId) {
          needleMetric = allMetricsArr[i];
          break;
        }
      }
      if (! needleMetric ) { return false; }


      if (Number(cell.type_id) === Number(needleMetric.id)) {
        if (cell.value !== null && cell.value.toString().trim() !== '') {
          return ` ${evalValue(cell.value)} `;
        }
        return false;
      }

      const params = getArrayParams(metricForId(needleMetric.id));
      let currentNeedleCell = needleMetric.cells[cell.planed_at];

      if (!params) {
        if (currentNeedleCell.value !== null
            && currentNeedleCell.value !== ''
            && !isTime(currentNeedleCell.value)
        ) {
          return ' ' +  evalValue(currentNeedleCell.value) + ' '
        }
        return false;
      }

      for (let i = 0; i < params.length; i++) {
        result += getFormulaCell(params[i], currentNeedleCell);
      }

      if (result) {
        return evalValue(result);
      }
      return false;
    }


    /*Блок по работе со средним значением*/

    const handlerOver = () => {
      if (isAverageMode.value && !showAverageBlock.value) {
        showAverageBlock.value = true;
      }
    }
    const handlerLeave = () => {
        showAverageBlock.value = false;
    }

    return {
      colorCellClass,
      getDiscussedWeek,
      showFormulaMetric,
      data,
      showPromptTrueValue,
      isComment,
      isEditValue,
      metricId,
      formula,
      isGroup,
      valueInOutput,
      valueIsAround: processingValueIsAround,
      inputValue,
      isAverageMode,
      showAverageBlock,
      years,
      metricName,
      averageValues,

      getCellForm,
      handlerClickComment,
      handlerDbClickCell,
      hideInput,
      handlerOver,
      handlerLeave,
      submitInput,
      }
  },

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