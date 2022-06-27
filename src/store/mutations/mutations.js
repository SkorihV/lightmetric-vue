
export default {
    SET_IS_LOCAL: (state) => {
        state.isLocal = window.document.location.host.includes('localhost');
    },

    SET_DATA_METRIC(state, data) {

        for (let key in data.metricsGroups) {
            const storage = JSON.parse(localStorage.getItem('group'));

            data.metricsGroups[key].forEach(metric => {
                metric.isHideLikeGroupMainMetric = storage.group.indexOf(metric.id) >= 0;
                metric.isHideLikeGroup = false;

                if (Array.isArray(metric.cells) ) {
                    metric.cells = {};
                }
                data.mondays.forEach(monday => {
                    if (!metric.cells[monday]) {
                        metric.cells[monday] = {
                            value: '',
                            computed_value: '',
                            type_id: metric.id,
                            id: Math.random(),
                            planed_at: monday,
                        }
                    }
                })
            })
        }

        state.mondays                   = data.mondays;
        state.mondays.years             = null;
        state.dateEnd                   = data.dateEnd;
        state.dateStart                 = data.dateStart;
        state.categories                = data.categories;
        state.mondaysData               = data.mondaysData;
        state.metricsGroups             = data.metricsGroups;
        state.discussedWeek             = data.discussedWeek;
        state.dataForStatGraph.planed   = data.mondays;
        state.userOptions               = data.userOptions;
    },

    SHOW_HIDE_METRICS(state, categoryId) {
        let fundedGroup = false;
        let fundedMetric = false;
        for (let groupKey in state.metricsGroups) {
            let metricGroup = state.metricsGroups[groupKey];

            for (let i = 0; i < metricGroup.length; i++) {
                let metric = metricGroup[i];
                if (Number(metric.id) === Number(categoryId)) {
                    fundedGroup = metricGroup;
                    fundedMetric = metric;
                    break
                }
            }
        }
        if (!fundedGroup) { return false; }
        fundedMetric.isHideLikeGroupMainMetric = !fundedMetric.isHideLikeGroupMainMetric;
    },

    PROCESSING_HIDE_SHOW_METRIC_FOR_LOCAL(state) {
        for (let groupKey in state.metricsGroups) {
            let group = state.metricsGroups[groupKey];

            group.map(metric => {
                metric.isHideLikeGroup = false;
            });

            for (let i = 0; i < group.length; i++) {
                const metric = group[i];
                let foundNewGroup = false;

                if (metric.isHideLikeGroupMainMetric) {
                    for (let j = i + 1; j < group.length; j++) {
                        if (group[j].is_group === '1') {
                            foundNewGroup = true;
                        }
                        if (!foundNewGroup) {
                            i++;
                            group[j].isHideLikeGroup = true;
                        }
                    }
                }

            }
        }
    },


    /*control panel mutations stat*/
    SHOW_HIDE_METRIC(state) {
        state.showHideMetric = !state.showHideMetric;
    },

    CHANGE_MODE_DRAG_END_DROP(state) {
      state.modeDragAndDrops = !state.modeDragAndDrops;
    },

    SHOW_HIDE_CHECKBOXES_FOR_STAT(state) {
        state.checkboxesForStat = !state.checkboxesForStat;
    },

    HIDE_CHECKBOXES_FOR_STAT(state) {
        state.checkboxesForStat = false;
    },

    SHOW_HIDE_FORMULA(state) {
        state.formulaMetric = !state.formulaMetric;
    },

    SHOW_HIDE_INPUT_BLOCK(state) {
        state.modeWorksToFormula = !state.modeWorksToFormula
        if (!state.modeWorksToFormula) {
            state.metricForFormulaInput = null;
        }
    },

    /*control panel mutations end*/


    ADD_COMPUTED_VALUE(state, {metricId, planedAt, value}) {
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

        if (!metricFound) { return false;}
        metricFound.cells[planedAt].computed_value = value;

    },


    /*formula work start*/

    ID_METRIC_FOR_FORMULA_INPUT(state, metricId) {
        state.metricForFormulaInput = metricId;
    },

    ADD_CATEGORY_ID_FOR_UPDATE_FORMULA(state, categoryId) {
        state.categoryIdForUpdateInFormulaMetric = categoryId;
    },

    ADD_PLANED_AT_FOR_UPDATE_FORMULA(state, planedAt) {
        state.planedAtForUpdateInFormulaCell = planedAt;
    },

    TOGGLE_PROCESSING_FORMULA_FOR_CELL(state, flag) {
        state.dataForUpdateComputedValues = [];
        state.countCellsInProcessing = 0;
        state.isProcessingFormulaForCell = flag;
    },

    ADD_COMPUTED_VALUE_FOR_UPDATED(state, {computedValue, planed, typeId, metricName}) {
        state.dataForUpdateComputedValues.push({computedValue, planed, typeId, metricName});
    },
    ADD_METRIC_FOR_LIGHTING(state, metricId) {
        state.metricIdForLighting = metricId
    },

    ADD_COUNT_CELLS_IN_PROCESSING(state) {
        state.countCellsInProcessing++;
    },

    RESET_COUNT_CELLS_IN_PROCESSING(state) {
        state.countCellsInProcessing = 0;
    },

    /*graph*/

    ADD_STAT_GRAPH(state, data) {
        if (!state.dataForStatGraph.dataCells.find(item => item.id === data.id)) {
            state.dataForStatGraph.dataCells.push(data);
        }
    },
    REMOVE_STAT_GRAPH(state, metricId) {
       state.dataForStatGraph.dataCells = state.dataForStatGraph.dataCells.filter(item => item.id !== metricId)
    },
    REMOVE_ALL_STAT_GRAPH(state) {
        state.dataForStatGraph.dataCells = [];
    },
    RESET_CHECKBOXES_STAT(state) {
        state.resetCheckboxesStat = !state.resetCheckboxesStat;
    },

    /*DRAG AND DROPS*/

    ADD_CURRENT_METRIC_FOR_DRAG_AND_DROP(state, metricId) {
        state.currentIdMetricForDragAndDrop = metricId;
    },
    ADD_CURRENT_METRIC_FOR_OVER_DRAG_AND_DROP(state, metricId) {
        state.currentIdMetricForOverDragAndDrop = metricId;
    },
    MOVEMENT_METRICS(state, {movementMetricId, overMetricId, currentCategoryId}){
        for (let key in state.metricsGroups) {
            if (parseInt(key) === parseInt(currentCategoryId)) {
                let currentMetricIndex  = null;
                let overMetricIndex     = null;

                for (let i = 0; i < state.metricsGroups[key].length; i++) {
                    if (this.state.metricsGroups[key][i].id === movementMetricId) {
                        currentMetricIndex = i;
                    }
                    if (this.state.metricsGroups[key][i].id === overMetricId) {
                        overMetricIndex = i;
                    }

                }
                this.state.metricsGroups[key].splice(overMetricIndex, 0, state.metricsGroups[key].splice(currentMetricIndex, 1)[0]);
                this.state.metricsGroups[key].map((metric, index) => {
                    metric.position = index.toString();
                })
                return true;
            }
        }
        return false;
    },


    /*MODAL*/

    VISIBILITY_MODAL(state, flag) {
        state.showModal = flag;
    },
    PUT_HTML_FOR_MODAL(state, html) {
        if (html) {
            state.htmlForModal = html;
        }
    },
    REMOVE_HTML_FOR_MODAL(state) {
        state.htmlForModal = '';
    },
    EDIT_MODE_TOGGLE(state, flag) {
        state.editModeForModal = flag;
    },
    CHANGE_DISPLAYING_COMMENT_IN_MODAL(state, flag) {
        state.displayingCommentInModal = flag;
    },
    DATA_FOR_COMMENT(state, {userName, dateTime, commentText}) {
        state.dataComment.userName = userName;
        state.dataComment.dateTime = dateTime;
        state.dataComment.commentText = commentText;
    },
    ADD_DATA_FOR_SUBMIT_FORM(state, data) {
        state.dataForSubmitForm = data;
    },

    CHANGE_IS_SUBMITING(state) {
        state.isSubmiting = !state.isSubmiting;
    },


    /* working for data table*/

    REPLACE_METRIC_DATA(state, preData) {
        const data                  = preData.data;
        let metricFound             = getMetricFound(state, data.id);
        let isChangeableCategory    = false;
        let isChangeablePosition    = false;
        let newCategory             = null;
        let lastCategory            = null;

        if (metricFound) {
           lastCategory = setLastCategory(metricFound);
           newCategory = setNewCategory(data);
           isChangeableCategory = computedChangeableCategory(lastCategory, newCategory);
           isChangeablePosition = computedChangeablePosition(metricFound, data);
           updateDataMetricFound(metricFound, data);
        }

        if (isChangeableCategory) {
            excludeMetricFromGroup(metricFound.id, lastCategory);
        }

        if ( state.metricsGroups[newCategory] !== undefined  && (isChangeablePosition || isChangeableCategory)) {

            excludeMetricFromGroup(metricFound.id, newCategory);
            processCategory(state.metricsGroups[newCategory])
        }

        function getMetricFound(state, metricId) {
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
            return metricFound;
        }

        function setLastCategory(metricFound) {
            return parseInt(metricFound.type_category_id);
        }

        function setNewCategory(data) {
            return  parseInt(data.typeCategory.id);
        }

        function computedChangeableCategory(lastCategory, newCategory) {
            return lastCategory !== newCategory;
        }
        function computedChangeablePosition(metricFound, data) {
            return parseInt(metricFound.position) !== parseInt(data.position);
        }

        function updateDataMetricFound(metricFound, data) {
            const isUpdatedFormula = metricFound.formula === data.formula;


            metricFound.unit                = data.unit;
            metricFound.name                = data.name;
            metricFound.uname               = preData.userName;
            metricFound.normal              = data.normal;
            metricFound.comment             = data.comment;
            metricFound.formula             = data.formula;
            metricFound.is_hide             = data.isHide;
            metricFound.minimal             = data.minimal;
            metricFound.position            = data.position;
            metricFound.is_group            = data.isGroup;
            metricFound.is_around           = data.isAround;
            metricFound.color_row           = data.colorRow;
            metricFound.updated_at          = data.updatedAt;
            metricFound.type_category_id    = data.typeCategory.id;
        }


        function excludeMetricFromGroup (metricIdFromExclude, categoryIdWhereExclude) {
            state.metricsGroups[categoryIdWhereExclude] = state.metricsGroups[categoryIdWhereExclude].filter(metric => {
                return parseInt(metric.id) !== parseInt(metricIdFromExclude);
            });
        }

        function processCategory(processedCategory) {
            if (processedCategory.length > metricFound.position) {
                    for (let i = 0; i < processedCategory.length; i++) {
                        const metric = processedCategory[i];

                        if (metric.position >=  metricFound.position ) {
                            let currentIndex = i;
                            if (i === processedCategory.length) {
                                currentIndex = processedCategory.length;
                                metricFound.position = processedCategory.length;
                            }
                            processedCategory.splice(currentIndex, 0, metricFound);
                            break;
                        }
                    }
                } else {
                    metricFound.position = processedCategory.length;
                    processedCategory.splice(metricFound.position, 0, metricFound);
                }
                processedCategory.map((metric, index) => {
                    metric.position = index.toString();
                })
        }

    },
    REPLACE_WEEK_DATA(state, data) {
        let week = {};
        if (state.mondaysData[data.categoryId][data.planed_at] !== undefined) {
            week = state.mondaysData[data.categoryId][data.planed_at];
        }

        if(Object.keys(week).length) {
            week = createGeneralData(week, data);
        } else {
            week.comment = {};
            week = createGeneralData(week, data);

            week.category_id    = data.categoryId;
            week.user_id        = data.user_id;
            week.planed_at      = data.planed_at;
            week.id             = data.id;

            state.mondaysData[data.categoryId][data.planed_at] = week;
        }

        function createGeneralData (week, data) {
            week.comment.userName   = data.comment.userName;
            week.comment.comment    = data.comment.comment;
            week.comment.planed     = data.planed_at;
            week.comment.updated_at = data.updatedAt;
            week.updated_at         = data.updatedAt;
            week.uname              = data.comment.userName;

            return week;
        }
    },
    REPLACE_CELL_DATA(state, data) {
        let metricFound = null;
        let cell = null;
        let needleKey = null
        for (let key in state.metricsGroups) {
            if (!metricFound ) {
                metricFound = state.metricsGroups[key].find( metric => {
                    return parseInt(metric.id) === parseInt(data.metricId);
                })
            }
            if (metricFound) {
                needleKey = key;
                break;
            }
        }
        if (metricFound) {
         cell = metricFound.cells[data.planedAt];
        }
        if (cell) {
            cell.id             = data.data.id;
            cell.value          = data.data.value;
            cell.uname          = data.userName;
            cell.comment        = data.data.comment;
            cell.updated_at     = data.data.updatedAt;
            cell.computed_value = data.data.computedValue;
        }
        metricFound.cells[data.planedAt] = cell;

        if (metricFound ) {
           state.metricsGroups[needleKey].map(metric => {
               if(parseInt(metric.id) === parseInt(data.metricId)) {
                   return metricFound;
               }
           })
        }


    },
    CREATE_NEW_METRIC(state, preData) {
        const data = preData.data;
        const categoryId = data.typeCategory.id;
        const newMetric = {};

        newMetric.name             = data.name;
        newMetric.uname            = data.userName;
        newMetric.unit             = data.unit;
        newMetric.cells            = {};
        newMetric.id               = data.id;
        newMetric.normal           = data.normal;
        newMetric.comment          = data.comment;
        newMetric.formula          = data.formula;
        newMetric.is_hide          = data.isHide;
        newMetric.minimal          = data.minimal;
        newMetric.is_group         = data.isGroup;
        newMetric.position         = data.position;
        newMetric.color_row        = data.colorRow;
        newMetric.is_around        = data.isAround;
        newMetric.updated_at       = data.updatedAt;
        newMetric.type_category_id = categoryId;


        if (state.metricsGroups[categoryId] === undefined) {
            console.error("Группа добавленной метрики отсутствует в текущей выборки!")
            return false;
        }

        state.mondays.forEach(monday => {
                newMetric.cells[monday] = {
                    value: '',
                    computed_value: '',
                    type_id: newMetric.id,
                    id: Math.random(),
                    planed_at: monday
                }
        })
        if (state.metricsGroups[categoryId].length >=  parseInt(newMetric.position)) {
            for (let i = 0; i < state.metricsGroups[categoryId].length; i++) {
                const metric = state.metricsGroups[categoryId][i];

                if (parseInt(metric.position) >=  parseInt(newMetric.position)) {
                    let currentIndex = i;
                    if (i === state.metricsGroups[categoryId].length) {
                        currentIndex = state.metricsGroups[categoryId].length;
                        newMetric.position = state.metricsGroups[categoryId].length;
                    }
                    state.metricsGroups[categoryId].splice(currentIndex, 0, newMetric);

                    break;
                }
            }
        } else {
            newMetric.position = state.metricsGroups[categoryId].length - 1;
            state.metricsGroups[categoryId].push(newMetric);
        }
        return true;
    },

    DELETE_METRIC(state, metricId) {
        for (let key in state.metricsGroups ) {
            for (let i = 0; i < state.metricsGroups[key].length; i++) {
                if (parseInt(state.metricsGroups[key][i].id) === parseInt(metricId)) {
                    state.metricsGroups[key] = state.metricsGroups[key].filter(metric => {
                        return parseInt(metric.id) !== parseInt(metricId);
                    })
                    break;
                }
            }
        }
    },
    DELETE_WEEK(state, weekId) {
        for (let key in state.mondaysData ) {
            if (Object.keys(state.mondaysData[key]).length) {
                for (let innerKey in state.mondaysData[key] ) {
                    if (parseInt(state.mondaysData[key][innerKey].id) === parseInt(weekId)) {
                        delete state.mondaysData[key][innerKey];
                        state.mondaysData[key] = state.mondaysData[key];
                        break;
                    }
                }
            }
        }
    },

    CHANGE_AVERAGE(state) {
        state.isAverageMode = !state.isAverageMode;
    },
    ADD_AVERAGE_DATA(state, {averageDataForYears}) {
        for(let key in averageDataForYears)  {
            let averageData = averageDataForYears[key]
           if (state.metricsGroups[key]) {
               Object.values(state.metricsGroups[key]).forEach(metric => {
                   metric.years = averageData.filter(data => metric.id === data.id)?.[0]?.years || null;
               })
           }
      }

    },

    SET_FLAG_PRELOADER(state, flag) {
        state.showPreloader = flag;
    },

    UPDATED_POSITION_IN_CATEGORY(state, categoryId) {
        state.metricsGroups[categoryId] = Array.from(state.metricsGroups[categoryId]).map((item, index) => {
            item.position = index;
            return item;
        })
    }
}