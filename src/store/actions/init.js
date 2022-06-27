export default {
    async INIT_TRUE_PATH({commit}) {
        await commit('SET_IS_LOCAL');
    },
}