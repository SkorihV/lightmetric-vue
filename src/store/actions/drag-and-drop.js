export default {

    SET_CURRENT_METRIC_FOR_DRAG_AND_DROP({commit}, metricId) {
        commit('ADD_CURRENT_METRIC_FOR_DRAG_AND_DROP', metricId);
    },
    SET_CURRENT_METRIC_FOR_OVER_DRAG_AND_DROP({commit}, metricId) {
        commit('ADD_CURRENT_METRIC_FOR_OVER_DRAG_AND_DROP', metricId);
    },
    MOVE_METRIC({commit, dispatch}, metricsData) {
        commit('MOVEMENT_METRICS', metricsData);
        let {currentCategoryId} =  metricsData;
        dispatch('UPDATE_POSITION_FOR_METRIC_GROUP', currentCategoryId)
    }
}