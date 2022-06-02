export default {
    TOGGLE_SHOW_HIDE_METRIC({commit}) {
        commit('SHOW_HIDE_METRIC');
    },
    TOGGLE_MODE_DRAG_AND_DROP({commit}) {
        commit('CHANGE_MODE_DRAG_END_DROP')
    },
    TOGGLE_SHOW_HIDE_GROUP_METRICS({commit}, categoryId) {
        commit('SHOW_HIDE_METRICS', categoryId);
        commit('PROCESSING_HIDE_SHOW_METRIC_FOR_LOCAL');
    },
    TOGGLE_SHOW_HIDE_CHECKBOXES_FOR_STAT({commit}) {
        commit('SHOW_HIDE_CHECKBOXES_FOR_STAT')
    },
    TOGGLE_HIDE_CHECKBOXES_FOR_STAT({commit}) {
        commit('HIDE_CHECKBOXES_FOR_STAT')
    },
    TOGGLE_SHOW_HIDE_FORMULA({commit}) {
        commit('SHOW_HIDE_FORMULA')
    },
    TOGGLE_SHOW_HIDE_INPUT_BLOCK_FORMULA({commit}) {
        commit('SHOW_HIDE_INPUT_BLOCK')
    },
    SHOW_MODAL({commit}) {
       commit('VISIBILITY_MODAL', true);
    },
}