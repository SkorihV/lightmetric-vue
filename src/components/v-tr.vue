<template>
<!--
  TODO:
  Линтер ругается на @click=
  Consider to use '.exact' modifier.eslint-plugin-vue
 -->
    <tr
        v-if="!metric.isHideLikeGroup || isHide"
        class="table__tr"
        :class="{
          'is-group': isGroup,
          'is-hide': isHide,
          'is-show': isShow,
          'workInFormula': getMetricForFormula === metric.id
        }"
        @click.ctrl="addMetricAlias"
        @click="setIdForFormulaEdit"
        :draggable="modeDragAndDrops"
        :data-metric-id="metric.id"
        @dragstart="dragAndDropRowStart"
        @dragend="dragAndDropRowEnd"
        @dragover="dragAndDropRowOver"
        @dragleave="dragAndDropRowLeave"
        ref="row"
    >
      <v-td-cell-void
          classes="gray-color cell__position"
          :title="metric.type_category_id + '-' + metric.position"
      ></v-td-cell-void>

      <v-td-cell-main
          classes="gray-color"
          :data="metric"
          :isGroup="isGroup"
      ></v-td-cell-main>

      <v-td-cell-void
          :style="{backgroundColor: metric.color_row}"
          classes="gray-color  cell__minimal"
          :title="metric.minimal ? metric.minimal : ''"
          :unit="metric.unit"
          :categoriId="metric.type_category_id"

      ></v-td-cell-void>

      <v-td-cell-void
          :style="{backgroundColor: metric.color_row}"
          classes="gray-color  cell__normal"
          :title="metric.normal ? metric.normal : ''"
          :unit="metric.unit"
          :categoriId="metric.type_category_id"

      ></v-td-cell-void>

      <v-td-cell
          v-for="monday in mondaysList"
          :data="monday in metric.cells ? metric.cells[monday] : null"
          :key="monday in metric.cells ? metric.cells[monday].id : Math.random()"
          :normal="metric.normal"
          :minimal="metric.minimal"
          :formula="metric.formula"
          :isAround="metric.is_around"
          :unit="metric.unit"
          :metricId="metric.id"
          :isGroup="isGroup"
      >
      </v-td-cell>
    </tr>
  <tr v-if="showImaginaryRow" class="table__tr-imaginary-row"></tr>
</template>

<script>
import vTdCell from './v-td-cell'
import vTdCellMain from './v-td-cell-main'
import vTdCellVoid from './v-td-cell-void' // FIXME: переопределен ниже
import {mapActions, mapGetters} from "vuex";
import VTdCellVoid from "@/components/v-td-cell-void";

export default {
  name: "v-tr",
  components: {
    VTdCellVoid,
    vTdCell,
    vTdCellMain
  },
  props: {
    metric: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      showImaginaryRow: false,
    }
  },
  methods: {
    ...mapActions([
        'SET_ID_METRIC_FOR_FORMULA_INPUT',
        'SET_CURRENT_METRIC_FOR_DRAG_AND_DROP',
        'SET_CURRENT_METRIC_FOR_OVER_DRAG_AND_DROP',
        'MOVE_METRIC',
        'UPDATE_POSITION_FOR_METRIC_GROUP'
    ]),
    addMetricAlias() {
      if (!this.showInputBlockForWorkingFormula && !this.getMetricForFormula) {
        return false;
      }
      // FIXME: Следующие две строчки ничего не делают и нигде не используются
      let metric = this.metricForId(this.getMetricForFormula)
      metric.formula += ` $${this.metric.id}$`;
    },
    setIdForFormulaEdit(e) {
      if (!this.showInputBlockForWorkingFormula || e.ctrlKey) {
        return false;
      }
      this.SET_ID_METRIC_FOR_FORMULA_INPUT(this.metric.id);
    },
    dragAndDropRowStart(e) {
      if (!this.modeDragAndDrops) {
        return false;
      }
      this.SET_CURRENT_METRIC_FOR_DRAG_AND_DROP(this.metric.id)

      setTimeout(() => {
        this.$refs.row.style.opacity = '0.5';
      }, 0)
    },
    dragAndDropRowEnd() {
      // Подобные методы лучше комментировать
        this.$refs.row.style.opacity = '1';

        if (this.getCurrentIdMetricForOverDragAndDrop !== null && this.getCurrentIdMetricForDragAndDrop !== null) {
          let metricOverDragAndDrop = this.metricForId(this.getCurrentIdMetricForOverDragAndDrop);

          if (!metricOverDragAndDrop) {return false}
          if (metricOverDragAndDrop.type_category_id === this.metric.type_category_id) {
            this.MOVE_METRIC({
              movementMetricId:this.getCurrentIdMetricForDragAndDrop,
              overMetricId:  this.getCurrentIdMetricForOverDragAndDrop,
              currentCategoryId: metricOverDragAndDrop.type_category_id  })
          }
        }
    },
    dragAndDropRowOver() {
      if (this.getCurrentIdMetricForDragAndDrop !== this.metric.id && !this.showImaginaryRow ) {
        this.showImaginaryRow = true;
        this.SET_CURRENT_METRIC_FOR_OVER_DRAG_AND_DROP(this.metric.id)
      }
    },
    dragAndDropRowLeave() {
      this.showImaginaryRow = false;
    }
  },
  computed: {
    ...mapGetters([
        'mondaysList',
        'showHideMetric',
        'showInputBlockForWorkingFormula',
        'getMetricForFormula',
        'metricForId',
        'modeDragAndDrops',
        'getCurrentIdMetricForDragAndDrop',
        'getCurrentIdMetricForOverDragAndDrop'
    ]),
    isGroup() {
      return Number(this.metric.is_group) === 1;
    },
    isHide() {
      return Number(this.metric.is_hide) === 1;
    },
    isShow() {
      return this.isHide === true && this.showHideMetric === true;
    }
  }
}
</script>

<style lang="scss">

.table__tr {
  &:hover td{
    box-shadow: 0 0 50px 50px #ffffff7a inset;
  }

  &.is-group {
    td {
      font-weight: bold;
      background: #C9DAF8;
      border-right: 1px solid #C9DAF8;
    }
  }

  &.is-hide {
    display: none;
    &.is-show {
      display: table-row;
      opacity: 0.7;
      border: 1px dashed black
    }
  }
  &.workInFormula {
    border-bottom: 3px #367fa9 solid;
  }
}

.table__tr-imaginary-row {
  height: 5px;
}

</style>