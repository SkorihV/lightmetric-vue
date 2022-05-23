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
    markedMetricsForStat: [],
    dataForStatGraph: {
      dataCells: [],
      planed: []
    },

    dataForUpdateInFormulaCell: null,  // обновить данные в ряду ячеек исходя из даты
    dataForUpdateInFormulaMetric: false,  // обновить данные во всех метриках
    resetCheckboxesStat: false,         // сбросить все галочки статистик

    showModal: false,

    currentIdMetricForDragAndDrop: null,
    currentIdMetricForOverDragAndDrop: null,

    htmlForModal: '',
    editModeForModal: false,
    dataForSubmitForm: null,

    displayingCommentInModal: false,
    dataComment: {
      userName: null,
      dateTime: null,
      commentText: ''
    }


  },
  getters,
  mutations,
  actions,
  modules: {
  }
})
