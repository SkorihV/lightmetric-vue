export default {
    SET_ID_METRIC_FOR_FORMULA_INPUT({commit, dispatch}, metricId) {
        commit('ID_METRIC_FOR_FORMULA_INPUT', metricId);
    },

    SET_COMPUTED_VALUE({commit}, {metricId, planedAt, value}) {
        commit('ADD_COMPUTED_VALUE', {metricId, planedAt, value});
    },

    SET_CATEGORY_ID_FOR_UPDATE_FORMULA({commit},categoryId) {
        commit('ADD_CATEGORY_ID_FOR_UPDATE_FORMULA', categoryId);
    },
    INIT_PROCESSING_FORMULA_FOR_CATEGORY({commit}) {
        commit("TOGGLE_PROCESSING_FORMULA_FOR_CATEGORY")
    },

    SET_PLANED_AT_FOR_UPDATE_FORMULA_IN_CELL({commit}, planedAt) {
        commit('ADD_PLANED_AT_FOR_UPDATE_FORMULA', planedAt);
    },

    INIT_PROCESSING_FORMULA_FOR_CELL({commit}) {
        commit("TOGGLE_PROCESSING_FORMULA_FOR_CELL")
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

    SET_DATA_FOR_UPDATING_COMPUTED_VALUE({commit}, dataComputedValues) {
        commit('ADD_COMPUTED_VALUE_FOR_UPDATED', dataComputedValues)
    },

    SET_METRIC_ID_FOR_LIGHTING({commit}, metricId) {
        commit('ADD_METRIC_FOR_LIGHTING', metricId);
    }
}