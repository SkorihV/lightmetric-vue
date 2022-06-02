export default {
    EDIT_MODE_ON({commit}){
        commit('EDIT_MODE_TOGGLE', true);
    },
    EDIT_MODE_OFF({commit}){
        commit('EDIT_MODE_TOGGLE', false);
    },
    TOGGLE_IS_SUBMITING({commit}) {
        commit('CHANGE_IS_SUBMITING')
    },
    ADD_HTML_IN_MODAL({commit}, html) {
        commit('PUT_HTML_FOR_MODAL', html);
    },
    SET_DATA_FOR_COMMENT({commit, dispatch}, data) {
        dispatch('RESET_MODAL')
            .then(() => {
                commit('DATA_FOR_COMMENT', data);
                commit('CHANGE_DISPLAYING_COMMENT_IN_MODAL', true);
                commit('VISIBILITY_MODAL', true)
            })
    },
    SET_DATA_FOR_SUBMIT_FORM({commit}, data) {
        commit('ADD_DATA_FOR_SUBMIT_FORM', data);
    },
    RESET_MODAL({commit}) {
        commit('REMOVE_ALL_STAT_GRAPH');
        commit('VISIBILITY_MODAL', false);
        commit('CHANGE_DISPLAYING_COMMENT_IN_MODAL', false);
        commit('DATA_FOR_COMMENT', {commentText: '', dateTime: null, userName: null});
        commit('EDIT_MODE_TOGGLE', false);
        commit('REMOVE_HTML_FOR_MODAL');
        commit('RESET_CHECKBOXES_STAT');
        commit('ADD_DATA_FOR_SUBMIT_FORM', null);

    }
}