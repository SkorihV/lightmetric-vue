export default {
    SET_ID_METRIC_FOR_FORMULA_INPUT({commit, dispatch}, metricId) {
        commit('ID_METRIC_FOR_FORMULA_INPUT', metricId);
        dispatch('SET_DATA_FOR_UPDATE_IN_FORMULA_METRIC');
    },

    SET_COMPUTED_VALUE({commit}, {metricId, planedAt, value}) {
        commit('ADD_COMPUTED_VALUE', {metricId, planedAt, value});
    },

    SET_DATA_FOR_UPDATE_IN_FORMULA_METRIC({commit}) {
        commit('CHANGE_DATA_FOR_UPDATE_IN_FORMULA_METRIC');
    },

    SET_DATA_FOR_UPDATE_IN_FORMULA_CELL({commit}, planedAt) {
        commit('CHANGE_DATA_FOR_UPDATE_IN_FORMULA_cell',planedAt);
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

}