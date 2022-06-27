
export default {
  async INIT_UPDATED_POSITION_IN_CATEGORY({commit}, categoryId) {
    await commit('UPDATED_POSITION_IN_CATEGORY', categoryId);
  }
}