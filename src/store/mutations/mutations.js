export default {
    SET_IS_LOCAL: (state) => {
        state.isLocal = window.document.location.host.includes('localhost');
    },

    SET_DATA_METRIC(state, data) {

        for (let key in data.metricsGroups) {
            let storage = JSON.parse(localStorage.getItem('group'));
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
                            planed_at: monday
                        }
                    }
                })
            })
        }

        state.mondays = data.mondays;
        state.metricsGroups = data.metricsGroups;
        state.mondaysData = data.mondaysData;
        state.categories = data.categories;
        state.dateEnd = data.dateEnd;
        state.dateStart = data.dateStart;
        state.discussedWeek = data.discussedWeek;
        state.dataForStatGraph.planed = data.mondays;
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
        // Три цикла это весело, особенно когда читаешь код))
        for (let groupKey in state.metricsGroups) {
            let group = state.metricsGroups[groupKey];
            group.forEach(metric => {metric.isHideLikeGroup  = false}) // почему не map?
            for (let i = 0; i < group.length; i++) {
                let metric = group[i];
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
        if (metricFound.cells[planedAt].computed_value != value) {
            metricFound.cells[planedAt].computed_value = value;
        }
    },


    /*formula work start*/

    ID_METRIC_FOR_FORMULA_INPUT(state, metricId) {
        state.metricForFormulaInput = metricId;
    },

    CHANGE_DATA_FOR_UPDATE_IN_FORMULA_METRIC(state) {
        state.dataForUpdateInFormulaMetric = !state.dataForUpdateInFormulaMetric;
    },
    CHANGE_DATA_FOR_UPDATE_IN_FORMULA_cell(state, planedAT) {
        state.dataForUpdateInFormulaMetric = planedAT;
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
        for (let key in this.state.metricsGroups) {
            if (key == currentCategoryId) {
                let currentMetricIndex = null;
                let overMetricIndex = null;
                for (let i = 0; i < this.state.metricsGroups[key].length; i++) {
                    if (this.state.metricsGroups[key][i].id === movementMetricId) {
                        currentMetricIndex = i;
                    }
                    if (this.state.metricsGroups[key][i].id === overMetricId) {
                        overMetricIndex = i;
                    }

                }
                this.state.metricsGroups[key].splice(overMetricIndex, 0, this.state.metricsGroups[key].splice(currentMetricIndex, 1)[0]);
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


    /* working for data table*/

    REPLACE_METRIC_DATA(state, data) {
        // Не оставляй большие функции одним потоком
        // 1. Нужны комментарии
        // 2. Нужно разбить на функции, прям внутрь можешь положить и последовательно их вызывать
        let metricFound     = null;
        let changeCategory  = false;
        let changePosition  = false;
        let newCategory     = null;
        let lastCategory    = null;

        for (let key in state.metricsGroups) {
            if (!metricFound ) {
                metricFound = state.metricsGroups[key].find( metric => {
                    return Number(metric.id) === Number(data.id);
                })
            }
            if (metricFound) {
                break;
            }
        }
        if (metricFound) {
            lastCategory    = parseInt(metricFound.type_category_id);
            newCategory     = parseInt(data.typeCategory.id);

            changeCategory  = lastCategory !== newCategory;
            changePosition  = parseInt(metricFound.position) !== parseInt(data.position);

            metricFound.unit                = data.unit;
            metricFound.name                = data.name;
            metricFound.normal              = data.normal;
            metricFound.comment             = data.comment;
            metricFound.formula             = data.comment;
            metricFound.is_hide             = data.isHide;
            metricFound.minimal             = data.minimal;
            metricFound.position            = data.position;
            metricFound.is_group            = data.isGroup;
            metricFound.is_around           = data.isAround;
            metricFound.color_row           = data.colorRow;
            metricFound.type_category_id    = data.typeCategory.id;
        }

        if(changeCategory) {
            state.metricsGroups[lastCategory] = state.metricsGroups[lastCategory].filter(metric => {
                return metric.id !== metricFound.id;
            });
        }

        if ( state.metricsGroups[newCategory] !== undefined  && (changePosition || changeCategory)) {
            state.metricsGroups[newCategory] = state.metricsGroups[newCategory].filter(metric => {
                return parseInt(metric.id) !== parseInt(metricFound.id);
            })

            if (state.metricsGroups[newCategory].length > metricFound.position) {
                for (let i = 0; i < state.metricsGroups[newCategory].length; i++) {
                    let metric = state.metricsGroups[newCategory][i];

                    if(metric.position >=  metricFound.position ) {
                        let currentIndex = i;
                        if (i === state.metricsGroups[newCategory].length) {
                            currentIndex = state.metricsGroups[newCategory].length;
                            metricFound.position = state.metricsGroups[newCategory].length;
                        }
                        state.metricsGroups[newCategory].splice(currentIndex, 0, metricFound);
                        break;
                    }
                }
            } else {
                metricFound.position = state.metricsGroups[newCategory].length;
                state.metricsGroups[newCategory].splice(metricFound.position, 0, metricFound);
            }
            state.metricsGroups[newCategory].map((metric, index) => {
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
            week.comment.userName = data.userName;
            week.comment.comment = data.comment;
            week.comment.planed = data.planed;
            week.uname = data.userName;
        } else {
            week.comment = {};
            week.comment.userName = data.userName;
            week.comment.comment = data.comment;
            week.comment.planed = data.planed;
            week.uname = data.userName;

            week.category_id = data.categoryId;
            week.user_id = data.userId;
            week.planed_at = data.planed;
            week.id = data.id;
            state.mondaysData[data.categoryId][data.planed_at] = week;
        }
    },
    REPLACE_CELL_DATA(state, data) {
        let metricFound = null;
        let cell = null;

        for (let key in state.metricsGroups) {
            if (!metricFound ) {
                metricFound = state.metricsGroups[key].find( metric => {
                    return parseInt(metric.id) === parseInt(data.metricId);
                })
            }
            if (metricFound) {
                break;
            }
        }
        if (metricFound) {
         cell = metricFound.cells[data.planedAt];
        }
        if (cell) {
            metricFound.cells[data.planedAt].computed_value = data.data.computedValue;
            metricFound.cells[data.planedAt].id = data.data.id;
            metricFound.cells[data.planedAt].value = data.data.value;
            metricFound.cells[data.planedAt].comment = data.data.comment;
            metricFound.cells[data.planedAt].uname = data.userName;
        }
    },
    CREATE_NEW_METRIC(state, data) {
        let newMetric = {};
        let categoryId = data.typeCategory.id;

        newMetric.color_row        = data.colorRow;
        newMetric.name             = data.name;
        newMetric.comment          = data.comment;
        newMetric.formula          = data.comment;
        newMetric.is_around        = data.isAround;
        newMetric.is_group         = data.isGroup;
        newMetric.is_hide          = data.isHide;
        newMetric.minimal          = data.minimal;
        newMetric.normal           = data.normal;
        newMetric.position         = data.position;
        newMetric.unit             = data.unit;
        newMetric.type_category_id = data.typeCategory.id;
        newMetric.cells = {};


        if (state.metricsGroups[categoryId] === undefined) {
            console.log("Группа добавленной метрики отсутствует в текущей выборки!")
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

        for (let i = 0; i < state.metricsGroups[categoryId].length; i++) {
            let metric = state.metricsGroups[categoryId][i];

            if(parseInt(metric.position) >=  parseInt(newMetric.position)) {
                let currentIndex = i;
                if (i === state.metricsGroups[categoryId].length) {
                    currentIndex = state.metricsGroups[categoryId].length;
                    newMetric.position = state.metricsGroups[categoryId].length;
                }
                state.metricsGroups[categoryId].splice(currentIndex, 0, newMetric);

                break;
            }
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
    }

}