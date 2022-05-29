<template>
  <div class="lightTableBox">
    <keep-alive>
      <v-formula-input-block></v-formula-input-block>
    </keep-alive>
    <v-table
          v-for="(table, index) in tablesList"
          :key="index"
          :metrics="table"
      ></v-table>
      <v-control-panel></v-control-panel>
  </div>
  <v-modal></v-modal>

</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import vTable from "@/components/v-table"
import vControlPanel from '@/components/v-control-panel'
import vFormulaInputBlock from '@/components/v-formula-input-block'
import vModal from '@/components/v-modal'

export default {
  name: 'app-light-metric',
  components: {
    vTable,
    vControlPanel,
    vFormulaInputBlock,
    vModal,
  },
  mounted() {
    this.initStorage();

    this.INIT_TRUE_PATH();
    this.FETCH_DATA_METRIC();

  },
  computed: {
    ...mapGetters([
        'tablesList',
        'categoryNameById' // FIXME: не используется
    ])
  },
  methods:{
    ...mapActions([
      'INIT_TRUE_PATH',
      'FETCH_DATA_METRIC'
    ]),
    initStorage() {
      let storage = JSON.parse(localStorage.getItem('group'));
      if (!storage) {
        localStorage.setItem('group', JSON.stringify({ group: [] }));
        storage = JSON.parse(localStorage.getItem('group')); // FIXME: Зачем обновляем переменную если нигде ее не выводим?
      }
    },
  }
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
