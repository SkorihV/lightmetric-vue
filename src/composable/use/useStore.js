import {useStore} from "vuex";
import {computed} from "vue"

export const useStoreGetters = () => {
  const store = useStore();
  const {getters} = store;

  return {
    allMetrics        : computed(()   => getters.allMetrics),
    getDiscussedWeek  : computed(()   => getters.getDiscussedWeek),
    showFormulaMetric : computed(()   => getters.showFormulaMetric),

    metricForId       : metricId      => computed(() => getters.metricForId(metricId)),
    categoryNameById  : categoryId    => computed(() => getters.categoryNameById(categoryId)),
    allCellsInMetric  : metricId      => computed(() => getters.allCellsInMetric(metricId)),

    getCategoryIdForProcessingFormulaInCells  : computed(() => getters.getCategoryIdForProcessingFormulaInCells),
    isProcessingFormulaForCell                : computed(() => getters.isProcessingFormulaForCell),

    getDataForUpdateInFormulaMetric           : computed(() => getters.getDataForUpdateInFormulaMetric),

    isAverageMode: computed(()=> getters.getIsAverageMode),
    getDataForUpdatedComputedValue: computed(() => getters.getDataForUpdatedComputedValue),

  }
}

export const useStoreActions = () => {
  const store = useStore();
  const {dispatch} = store;

  return {
    SET_COMPUTED_VALUE                    : data  => dispatch('SET_COMPUTED_VALUE', data),
    SET_DATA_FOR_UPDATING_COMPUTED_VALUE  : data  => dispatch('SET_DATA_FOR_UPDATING_COMPUTED_VALUE', data),
    SET_COUNT_CELLS_IN_PROCESSING         : ()    => dispatch('SET_COUNT_CELLS_IN_PROCESSING'),
    RESET_COUNT_CELLS_IN_PROCESSING       : ()    => dispatch('RESET_COUNT_CELLS_IN_PROCESSING'),
    INIT_PROCESSING_FORMULA_FOR_CELL      : flag  => dispatch('INIT_PROCESSING_FORMULA_FOR_CELL', flag,)
  }
}
