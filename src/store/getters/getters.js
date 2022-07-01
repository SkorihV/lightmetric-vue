export default {

    /**
     * Получить тип светофора недельный / месячный - от этого зависят пути запросов.
     * @param state
     * @returns {null}
     */
    getTypeLightmetric: (state) => {
        return state.lightmetricType;
    },

    /**
     * Получить список всех категорий с метриками внутри
     * @param state
     * @returns {[]}
     */
    tablesList: (state) => {
        return state.metricsGroups;
    },

    /**
     * получить список доступных категорий с названиями и id
     * @param state
     * @returns {[]}
     */
    getCategoriesList: (state) => {
        return state.categories;
    },

    /**
     * Получить список id всех категорий
     * @param state
     * @param getters
     * @returns {string[]}
     */
    getCategoriesListIds: (state, getters) => Object.keys(getters.tablesList),

    /**
     * Получить начальную дату диапазона выборки
     * @param state
     * @returns {string}
     */
    getDateStart: (state) => {
        return state.dateStart;
    },
    /**
     * Получить конечную дату диапазона выборки
     * @param state
     * @returns {string}
     */
    getDateEnd: (state) => {
        return state.dateEnd;
    },
    getDiscussedWeek: (state) => {
      return state.discussedWeek;
    },

    /**
     * Получить индивидуальные настройки текущего пользователя
     * @param state
     * @returns {[]}
     */
    getUserOptions: (state) => {
      return state.userOptions;
    },

    /**
     * Объект со всеми адресами для запросов
     * @param state
     * @returns {{userOptionUrl: string, metricForm: string, updatePosition: string, dataList: string, AllAverageValuesForCategory: string, weekForm: string, updatingComputedValues: string, savingMetricFormula: string, cellForm: string}}
     */
    getUrls: (state) => {
        return state.urlsForFetch;
    },
    getAllMetricsInCategoryId: (state,getters) => (categoryId) => categoryId ? getters.tablesList[categoryId] : false,

    /**
     * Получить название категории по ее id
     * @param state
     * @returns {function(*): *|string}
     */
    categoryNameById: (state) => (id) => state.categories.find(category => category.id === id) ? state.categories.find(category => category.id === id).name : 'Category null',

    // mondaysDataByCategoryId: (state) => (id) => {
    //     return state.mondaysData[id] ?? null;
    // },

    /**
     * Список всех дат - понедельников
     * @param state
     * @returns {[]}
     */
    mondaysList: (state) => {
        return state.mondays;
    },

    /**
     * Получить данные по комментарию недели по id категории и даты.
     * @param state
     * @returns {function({id: *, planed: *}): null}
     */
    mondayDataByIdAndPlanedAt: (state) => ({id, planed}) => {
        let mondaysDataArr = state.mondaysData[id];
        let result = null;

        if (mondaysDataArr && Object.keys(mondaysDataArr).length) {
           for (let key in mondaysDataArr) {
                if (key === planed) {
                    result = mondaysDataArr[key];
                    break;
                }
            }
        }
        return result;
    },

    /* Группа гетеров для работы с боковой панелью*/
    showHideMetric: (state) => {
        return state.showHideMetric;
    },
    showCheckboxForStat: (state) => {
        return state.checkboxesForStat;
    },
    showFormulaMetric: (state) => {
        return state.formulaMetric;
    },
    showInputBlockForWorkingFormula: (state) => {
        return state.modeWorksToFormula;
    },
    getMetricForFormula: (state) => {
        return state.metricForFormulaInput;
    },
    modeDragAndDrops: (state) => {
        return state.modeDragAndDrops;
    },

    /*Геттеры для работы с формулами*/

    /**
     * Получить все ячейки по ID метрики
     * @param state
     * @returns {(function(*): (*|HTMLCollectionOf<HTMLTableCellElement>|null))|*}
     */
    allCellsInMetric: (state) => (metricId) => {
        let metricFound = null;

        for (let key in state.metricsGroups) {
            if (!metricFound ) {
                 metricFound = state.metricsGroups[key].find( metric => {
                    return Number(metric.id) === Number(metricId);
                })
            }
            if (metricFound) {
                break;
            }
        }
        if (metricFound) {
            return metricFound.cells;
        } else {
            return null;
        }
    },

    /**
     * Получить все метрики без категорий
     * @param state
     * @returns {*[]}
     */
    allMetrics: (state) => {
        let metcrics = [];
        for (let key in state.metricsGroups) {

            state.metricsGroups[key].forEach( item => {
                metcrics.push(item);
            })
        }
        return metcrics;
    },

    /**
     * Получить id метрики для подцветки категории когда в inputе с формулой нажимаем на id $1599$ категории.
     * @param state
     * @returns {null}
     */
    getMetricForLighting: (state) => {
        return state.metricIdForLighting;
    },

    /**
     * получить ячейку по ее id
     * @param state
     * @returns {(function(*): (null|null))|*}
     */
    cellForId: (state) => (cellId) => {
        if (!cellId) { return null; }
        let cell = null;

        for (let key in state.metricsGroups) {
            if (!cell) {
                state.metricsGroups[key].forEach(itemMetric => {

                    if (Object.keys(itemMetric.cells).length && !cell) {
                        Object.values(itemMetric.cells).forEach(itemCell => {
                            cell = Number(itemCell.id) === Number(cellId) ? itemCell : null;
                        })
                    }
                })
            }
            if (cell) {
                break
            }
        }
        return cell;
    },

    /**
     * Получить метрику по её id
     * @param state
     * @returns {function(*): null}
     */
    metricForId: (state) => (metricId) =>  {
        let metric = null;
        for (let key in state.metricsGroups) {
            if (metric === null) {
                state.metricsGroups[key].forEach(metricItem => {
                    if (metric === null) {
                        metric = (Number(metricItem.id) === Number(metricId)) ? metricItem : null;
                    }
                })
            }
            if (metric) {
                break
            }
        }
        return metric;
    },

    /**
     * Получить id категории в рамках которой будет происходить расчет формулы.
     * @param state
     * @returns {null}
     */
    getCategoryIdForProcessingFormulaInCells: (state) => {
        return state.categoryIdForUpdateInFormulaMetric;
    },

    /**
     * Триггер сброса всех чекбоксов
     * @param state
     * @returns {boolean}
     */
    dataResetCheckboxesStat: (state) => {
        return state.resetCheckboxesStat;
    },

    getDataForUpdatedComputedValue: (state) => {
      return state.dataForUpdateComputedValues;
    },

    /**
     * Значение в переменной необходимо для понимания - в каком количестве ячеек сработал расчет формулы
     * @param state
     * @returns {number}
     */
    countCellsInProcessing: state => state.countCellsInProcessing,

    /**
     * Триггер срабатывания работы расчета формулы в ячейке
     * @param state
     * @returns {boolean}
     */
    isProcessingFormulaForCell: (state) =>  state.isProcessingFormulaForCell,

    /**
     * Флаг сработал ли расчет формулы во всех ячейках нужной нам категории
     * @param _
     * @param getters
     * @returns {number|boolean}
     */
    amountCellsInCurrentCategory: (_, getters) =>  {
        return getters.getCategoryIdForProcessingFormulaInCells ?
        Object.keys(getters.tablesList[getters.getCategoryIdForProcessingFormulaInCells]).length * getters.mondaysList.length
            : false;
    },

    /**
     *
     * @param _
     * @param getters
     * @returns {boolean}
     */
    initUploadNewDataComputedValues: (_, getters) => {
        return (getters.getCategoryIdForProcessingFormulaInCells
            && getters.isProcessingFormulaForCell
            && getters.countCellsInProcessing >= getters.amountCellsInCurrentCategory);
    },

    /*modal*/
    showModal: (state) => {
        return state.showModal;
    },
    htmlForModal: (state) => {
      return state.htmlForModal;
    },
    editMode: (state) => {
        return state.editModeForModal;
    },
    displayingComment: (state) => {
      return state.displayingCommentInModal;
    },
    dataForComment: (state) => {
        return state.dataComment;
    },


    /**
     * Данные о том какой вид формы сейчас находится в модальном окне
     * @param state
     * @returns {null}
     */
    getDataForSubmitForm: (state) => {
       return state.dataForSubmitForm;
    },

    /**
     * Триггер отправки формы из модального окна
     * @param state
     * @returns {boolean}
     */
    getIsSubmiting: (state) => {
        return state.isSubmiting;
    },

    /*stat*/

    /**
     * все собранные данные для графиков
     * @param state
     * @returns {{dataCells: [], planed: []}}
     */
    statGraph: (state) => {
        return state.dataForStatGraph;
    },

    /*DRAG AND DROPS*/

    getCurrentIdMetricForDragAndDrop: (state) => state.currentIdMetricForDragAndDrop,
    getCurrentIdMetricForOverDragAndDrop: (state) => state.currentIdMetricForOverDragAndDrop,
    getIsAverageMode: state => state.isAverageMode,


    /*Preloader */
    showPreloader: state => state.showPreloader,
}