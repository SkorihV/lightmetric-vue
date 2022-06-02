<template>
      <div class="v-table__category-name">{{categoryName}}</div>
      <table class="v-table">
        <v-thead
            :categoryId="categoryId"
        ></v-thead>
          <v-tr
              v-for="(metric, index) in metrics"
              :metric="metric"
              :key="index"
          >
          </v-tr>
      </table>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import vTr from './v-tr'
import vThead from './v-thead'


export default {
  name: "v-table",
  components: {
    vThead,
    vTr,
  },
  props: {
    'metrics' : {
      type: Array,
      default: []
    }
  },
  methods: {
    ...mapActions(['UPDATED_COMPUTED_VALUES'])
  },
  computed: {
    ...mapGetters([
        'categoryNameById',
        'mondaysDataByCategoryId',
        'getDataForUpdatedComputedValue'
    ]),
    categoryId() {
      if (this.metrics.length) {
        return parseInt(this.metrics[0].type_category_id);
      }
      return 0;
    },
    categoryName() {
      return this.categoryNameById(this.categoryId);
    },
    mondaysData() {
      return this.mondaysDataByCategoryId(this.categoryId)
    },
  },

}
</script>

<style lang="scss">

.v-table {
  margin: 1px 0;
  width: auto;
  position: relative;
  &__category-name {
    font-size: 25px;
    font-weight: 500;
    background: #367fa9;
    color: white;
    padding: 0 20px;
    position: sticky;
    left: 0;
   }
  &__tr {
    border-bottom: 1px solid #367FA9;
    box-sizing: border-box;
  }
  * {
    font-size: 12px;
  }
}


</style>