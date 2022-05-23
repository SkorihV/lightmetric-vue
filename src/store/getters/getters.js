export default {
    tablesList: (state) => {
        return state.metricsGroups;
    },
    categoryNameById: (state) => (id) => {
        return state.categories.find(category => category.id === id).name;
    },
    mondaysDataByCategoryId: (state) => (id) => {
        return state.mondaysData[id] ?? null;
    },
    mondaysList: (state) => {
        return state.mondays;
    },
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
    allMetrics: (state) => {
        let metcrics = [];
        for (let key in state.metricsGroups) {

            state.metricsGroups[key].forEach( item => {
                metcrics.push(item);
            })
        }
        return metcrics;
    },
    cellForId: (state) => (cellId) => {
        if (!cellId) {return null; }
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
    dataForUpdateInFormulaCell: (state) => {
        return state.dataForUpdateInFormulaCell;
    },
    dataForUpdateInFormulaMetric: (state) => {
        return state.dataForUpdateInFormulaMetric;
    },
    dataResetCheckboxesStat: (state) => {
        return state.resetCheckboxesStat;
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
    getDataForSubmitForm: (state) => {
       return state.dataForSubmitForm;
    },

    /*stat*/

    statGraph: (state) => {
        return state.dataForStatGraph;
    },

    /*DRAG AND DROPS*/

    getCurrentIdMetricForDragAndDrop: (state) => {
        return state.currentIdMetricForDragAndDrop
    },
    getCurrentIdMetricForOverDragAndDrop: (state) => {
        return state.currentIdMetricForOverDragAndDrop
    }

}