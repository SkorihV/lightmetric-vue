import { createStore } from 'vuex'
import mutations from '@/store/mutations/mutations';
import getters from "@/store/getters/getters";


import formula from "@/store/actions/formula"
import dragAndDrop from "@/store/actions/drag-and-drop"
import init from "@/store/actions/init"
import sidePanel from "@/store/actions/side-panel"
import fetch from "@/store/actions/fetch"
import modal from '@/store/actions/modal'
import average from '@/store/actions/average'
import utils from '@/store/actions/utils'

let actions = {...init, ...formula, ...dragAndDrop, ...sidePanel, ...fetch, ...modal, ...average, ...utils};


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
      updatingComputedValues: '/lightmetric_vue/cells/updateComputedValues',
      AllAverageValuesForCategory: '/lightmetric_vue/getAllAverageValuesForCategory',
      userOptionUrl : "/lightmetric_vue/updateUserOption",
    },

    mondays           : [],  // список всех понедельников в выбранном диапазоне
    metricsGroups     : [],   // список категорий с группами метрик
    mondaysData       : [],   // список комментариев разделенных по группам
    categories        : [],   // список всех категорий
    dateEnd           : '',   // конец выбранного диапазона дат
    dateStart         : '',   // начало выбранного диапазона дат
    discussedWeek     : '',   // обсуждаемая неделя
    userOptions       : [],   // пользовательские настройки

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
    },                          // данные необходимые для построения графика
    metricIdForLighting: null,  // id метрики которая подсвечивается при работе с inpit формулой


    categoryIdForUpdateInFormulaMetric: null, // id категории в рамках которой будет происходить расчет формулы.
    isProcessingFormulaForCell: false,        // переключатель - включить перерасчет формулы
    initUploadNewDataComputedValues: false,   // включить отправку собранных данных после расчета формулы
    dataForUpdateComputedValues: [],          // данные которые будут отправлены с новыми расчитанными значениями
    countCellsInProcessing: 0,                // количество ячеек в которых произошел расчет - влияет на то, сработает ли отправка или нет


    resetCheckboxesStat: false,         // сбросить все галочки статистик
    showModal: false,

    currentIdMetricForDragAndDrop: null,
    currentIdMetricForOverDragAndDrop: null,

    htmlForModal: '',
    editModeForModal: false,
    dataForSubmitForm: null,            // данные о том какая форма находится в модальном окне {formType:'cell/metric/week', metricId, planed_at}
    isSubmiting: false,                // произвести отправку формы находящейся в модальном окне

    displayingCommentInModal: false,  // отобразить комментарий в модальном окне
    dataComment: {
      userName: null,
      dateTime: null,
      commentText: ''
    },                  // данные комментария

    isAverageMode: false,

    showPreloader: true,

  },
  getters,
  mutations,
  actions,
  modules: {
  }
})
