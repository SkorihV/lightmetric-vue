import { createStore } from 'vuex'
import mutations from '@/store/mutations/mutations';
import getters from "@/store/getters/getters";
// import actions from "@/store/actions/actions";

import formula from "@/store/actions/formula"
import dragAndDrop from "@/store/actions/drag-and-drop"
import init from "@/store/actions/init"
import sidePanel from "@/store/actions/side-panel"
import fetch from "@/store/actions/fetch"
import modal from '@/store/actions/modal'

let actions = {...init, ...formula, ...dragAndDrop, ...sidePanel, ...fetch, ...modal};


export default createStore({
  state: {
    isLocal: null,
    urlsForFetch      : {
      dataList: '/lightmetric_vue/json_list',
      metricForm: '/lightmetric_vue/type/form',
      weekForm: '/lightmetric_vue/week/form',
      cellForm: '/lightmetric_vue/weekcell/form',
      updatePosition: '/lightmetric_vue/type/updatePositionMetrics',
      savingMetricFormula: '/lightmetric_vue/metricformulaAdd',
      updatingComputedValues: '/lightmetric_vue/cells/updateComputedValues'
    },

    mondays           : [],
    metricsGroups     : [],
    mondaysData       : [],
    categories        : [],
    dateEnd           : '',
    dateStart         : '',
    discussedWeek     : '',

    showHideMetric: false,        // режим показа скрытых метрик
    modeDragAndDrops: false,      // режим перетаскивания
    formulaMetric: false,         // режим отображения формул
    modeWorksToFormula: false,    // режим редактирования формул
    checkboxesForStat: false,     // отобразить галочки для статистик
    showAverageWindow: false,

    metricForFormulaInput: null,  // выбранная ID метрики для работы с формулой
    dataForStatGraph: {
      dataCells: [],
      planed: []
    },
    metricIdForLighting: null,

    planedAtForUpdateInFormulaCell: null,  // дата для обновления в ряде ячеек
    categoryIdForUpdateInFormulaMetric: null,  // ID категории для обновления во всех метриках
    isProcessingFormulaForCategory: false, //Обновить все ячейки в категории после изменения формулы
    isProcessingFormulaForCell: false, //Обновить все ячейки в ряду после изменения значения одной из ячеек
    resetCheckboxesStat: false,         // сбросить все галочки статистик

    showModal: false,

    currentIdMetricForDragAndDrop: null,
    currentIdMetricForOverDragAndDrop: null,

    htmlForModal: '',
    editModeForModal: false,
    dataForSubmitForm: null,
    isSubmiting: false,

    displayingCommentInModal: false,
    dataComment: {
      userName: null,
      dateTime: null,
      commentText: ''
    },

    dataForUpdateComputedValues: []

  },
  getters,
  mutations,
  actions,
  modules: {
  }
})
