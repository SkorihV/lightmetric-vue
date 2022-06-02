<template>
    <v-filter-wrapper />
  <div class="lightTableBox" ref="generalWrapper">
    <keep-alive>
      <v-formula-input-block></v-formula-input-block>
    </keep-alive>
    <v-table
          v-for="(table, index) in tablesList"
          :key="index"
          :metrics="table"
      ></v-table>
      <v-control-panel />
  </div>
  <v-modal />

</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import vTable from "@/components/v-table"
import vControlPanel from '@/components/v-control-panel'
import vFormulaInputBlock from '@/components/v-formula-input-block'
import vModal from '@/components/v-modal'
import vFilterWrapper from '@/components/v-filter-wrapper'

export default {
  name: 'app-light-metric',
  components: {
    vTable,
    vControlPanel,
    vFormulaInputBlock,
    vModal,
    vFilterWrapper
  },
  computed: {
    ...mapGetters([
        'tablesList',
        'getDataForUpdatedComputedValue'
    ])
  },
  methods:{
    ...mapActions([
        'INIT_TRUE_PATH',
        'FETCH_DATA_METRIC',
        'UPDATED_COMPUTED_VALUES'
    ]),
    initStorage() {
      const storage = JSON.parse(localStorage.getItem('group'));
      if (!storage) {
        localStorage.setItem('group', JSON.stringify({ group: [] }));
      }
    },
  },
  mounted() {
    this.initStorage();

    this.INIT_TRUE_PATH();
    this.FETCH_DATA_METRIC();

  },
  beforeUpdate() {


    setTimeout(() => {
      console.log('beforeUpdate ++++++++++')
      if (this.getDataForUpdatedComputedValue.length) {
        this.UPDATED_COMPUTED_VALUES(this.getDataForUpdatedComputedValue);
      }
    }, 1000)
  },
  beforeMount() {
    setTimeout(() => {
      console.log('beforeMount ++++++++++')
      document.querySelector('.lightTableBox').scrollLeft = this.$refs.generalWrapper.scrollWidth;

      if (this.getDataForUpdatedComputedValue.length) {
        this.UPDATED_COMPUTED_VALUES(this.getDataForUpdatedComputedValue);
      }
    }, 1000)
  },
}
</script>

<style lang="scss">
* {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
}
.lightTableBox {
  overflow: auto;
  max-height: 650px;
  height: auto;
  margin-top: 10px;
  background-color: #00a65a12;
  width: calc(100% - 40px);
}
</style>
