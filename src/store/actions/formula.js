export default {
    SET_ID_METRIC_FOR_FORMULA_INPUT({commit, dispatch}, metricId) {
        commit('ID_METRIC_FOR_FORMULA_INPUT', metricId);
    },

    /**
     * Обновление обработанного значения в ячейке
     * @param commit
     * @param metricId
     * @param planedAt
     * @param value
     * @returns {Promise<void>}
     * @constructor
     */
    async SET_COMPUTED_VALUE({commit}, {metricId, planedAt, value}) {
        await commit('ADD_COMPUTED_VALUE', {metricId, planedAt, value});
    },


    SET_CATEGORY_ID_FOR_UPDATE_FORMULA({commit},categoryId) {
        commit('ADD_CATEGORY_ID_FOR_UPDATE_FORMULA', categoryId);
    },

    async SET_PLANED_AT_FOR_UPDATE_FORMULA_IN_CELL({commit}, planedAt) {
        await commit('ADD_PLANED_AT_FOR_UPDATE_FORMULA', planedAt);
    },

    /**
     * запустить обработку формул в ячейках
     * @param commit
     * @param flag
     * @returns {Promise<void>}
     * @constructor
     */
    async INIT_PROCESSING_FORMULA_FOR_CELL({commit}, flag) {
        await commit('TOGGLE_PROCESSING_FORMULA_FOR_CELL', flag);
    },

    SET_DATA_FOR_STAT_GRAPHS({commit}, data) {
        commit('ADD_STAT_GRAPH', data);
    },

    REMOVE_DATA_FOR_STAT_GRAPHS({commit}, data) {
        commit('REMOVE_STAT_GRAPH', data);
    },

    REMOVE_ALL_DATA_FOR_STAT_GRAPHS({commit}) {
        commit('REMOVE_ALL_STAT_GRAPH');
        commit('RESET_CHECKBOXES_STAT');
    },

    async SET_DATA_FOR_UPDATING_COMPUTED_VALUE({commit}, dataComputedValues) {
        await commit('ADD_COMPUTED_VALUE_FOR_UPDATED', dataComputedValues);
    },

    SET_METRIC_ID_FOR_LIGHTING({commit}, metricId) {
        commit('ADD_METRIC_FOR_LIGHTING', metricId);
    },

    async SET_COUNT_CELLS_IN_PROCESSING({commit}) {
        await commit('ADD_COUNT_CELLS_IN_PROCESSING');
    },

    async RESET_COUNT_CELLS_IN_PROCESSING({commit}) {
        await commit('RESET_COUNT_CELLS_IN_PROCESSING');
    },

    RESET_DATA_FOR_FORMULA_PROCESSING({dispatch}) {
        dispatch('INIT_PROCESSING_FORMULA_FOR_CELL', false);
    }
}