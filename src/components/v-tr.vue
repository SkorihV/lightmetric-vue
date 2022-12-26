<template>
    <tr
        v-show="!metric.isHideLikeGroup || isHide"
        class="table__tr"
        :class="{
          'is-group': isGroup,
          'is-hide': isHide,
          'is-show': isShow,
          'workInFormula':getMetricForFormula === metric.id,
          'lighting': getMetricForLighting === metric.id
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
          :title="`${metric.type_category_id}-${metric.position}`"
          :style="{height: heightRow + 'px'}"
      ></v-td-cell-void>

      <v-td-cell-main
          classes="gray-color"
          :data="metric"
          :isGroup="isGroup"
      ></v-td-cell-main>

      <v-td-cell-void
          :style="{backgroundColor: metric.color_row}"
          classes="gray-color  cell__minimal"
          :title="metric.minimal"
          :unit="metric.unit"
          :categoriId="metric.type_category_id"
      ></v-td-cell-void>

      <v-td-cell-void
          :style="{backgroundColor: metric.color_row}"
          classes="gray-color  cell__normal"
          :title="metric.normal"
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
          :categoryId="Number(metric.type_category_id)"
          :years="metric?.years"
          :metricName="metric.name"
          :averageValues="averageValuesCells[monday]"
      >
      </v-td-cell>

    </tr>
  <tr v-if="showImaginaryRow" class="table__tr-imaginary-row"></tr>
</template>

<script>
import vTdCell from './v-td-cell'
import vTdCellMain from './v-td-cell-main'
import vTdCellVoid from './v-td-cell-void'
import {mapActions, mapGetters} from "vuex";

export default {
  name: "v-tr",
  components: {
    vTdCellVoid,
    vTdCell,
    vTdCellMain
  },
  props: {
    metric: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      showImaginaryRow: false,
      heightRow: 0,
    }
  },
  methods: {
    ...mapActions([
        'SET_ID_METRIC_FOR_FORMULA_INPUT',
        'SET_CURRENT_METRIC_FOR_DRAG_AND_DROP',
        'SET_CURRENT_METRIC_FOR_OVER_DRAG_AND_DROP',
        'MOVE_METRIC',
        'SET_CATEGORY_ID_FOR_UPDATE_FORMULA',
    ]),
    addMetricAlias() {
      if (!this.showInputBlockForWorkingFormula && !this.getMetricForFormula) {
        return false;
      }
      let metric = this.metricForId(this.getMetricForFormula)
      metric.formula += ` $${this.metric.id}$`;

    },
    setIdForFormulaEdit(e) {
      if (this.getCategoryIdForProcessingFormulaInCells !== this.metric.type_category_id) {
        this.SET_CATEGORY_ID_FOR_UPDATE_FORMULA(this.metric.type_category_id);
      }
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
        this.$refs.row.style.opacity = '1';

        if (this.getCurrentIdMetricForOverDragAndDrop !== null && this.getCurrentIdMetricForDragAndDrop !== null) {
          let metricOverDragAndDrop = this.metricForId(this.getCurrentIdMetricForOverDragAndDrop);

          if (!metricOverDragAndDrop) {return false}
          if (metricOverDragAndDrop.type_category_id === this.metric.type_category_id) {
            this.MOVE_METRIC({
              movementMetricId: this.getCurrentIdMetricForDragAndDrop,
              overMetricId:  this.getCurrentIdMetricForOverDragAndDrop,
              currentCategoryId: metricOverDragAndDrop.type_category_id  })
          }
        }
    },
    dragAndDropRowOver() {
        if (this.getCurrentIdMetricForDragAndDrop !== this.metric.id && !this.showImaginaryRow ) {
          this.showImaginaryRow = true;
          this.SET_CURRENT_METRIC_FOR_OVER_DRAG_AND_DROP(this.metric.id)
          setTimeout(() => {
            this.showImaginaryRow = false;
          },2000)
        }
    },
    dragAndDropRowLeave() {
      this.showImaginaryRow = false;
    },
    isTime(value){
      if (!value) { return false; }
      return  value.toString().match('^[0-9]+:[0-5][0-9](:[0-5][0-9])?') !== null;
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
        'getCurrentIdMetricForOverDragAndDrop',
        'getMetricForLighting',
        'getCategoryIdForProcessingFormulaInCells'
    ]),
    isGroup() {
      return Number(this.metric.is_group) === 1;
    },
    isHide() {
      return Number(this.metric.is_hide) === 1;
    },
    isShow() {
      return this.isHide === true && this.showHideMetric === true;
    },
    averageValuesCells() {
      let cells = [];
      let averageValuesInCurrentIntervalTime = 0;
      let currentExistingValues = 0;
      for (let i = 0; i < this.mondaysList.length; i++) {
        let result = {}

        result.witchPrev = null;
        result.witchNext = null;
        result.averageValuesInCurrentIntervalTime = null;

        const currentMonday = this.mondaysList[i];
        const prevMonday    = this.mondaysList[i - 1] ?? null;
        const nextMonday    = this.mondaysList[i + 1] ?? null;
        const value         = this.metric.cells[currentMonday]?.computed_value || this.metric.cells[currentMonday]?.value || null;
        const prevValue     = this.metric.cells[prevMonday]?.computed_value || this.metric.cells[prevMonday]?.value || null;
        const nextValue     = this.metric.cells[nextMonday]?.computed_value || this.metric.cells[nextMonday]?.value || null;

        if (this.isTime(value) || this.isTime(prevValue) || this.isTime(nextValue)) {
          cells[currentMonday] = result;
          continue;
        }

        if (!this.isTime(value) && value !== null) {
          averageValuesInCurrentIntervalTime += parseFloat(value);
          currentExistingValues++;
        }
        result.witchPrev      = value && prevValue ? (value - prevValue).toFixed(2) : null;
        result.witchNext      = value && nextValue ? (value - nextValue).toFixed(2) : null;
        cells[currentMonday]  = result;
      }

      for(let key in cells) {
        cells[key]["averageValuesInCurrentIntervalTime"] = averageValuesInCurrentIntervalTime ? (averageValuesInCurrentIntervalTime / currentExistingValues).toFixed(2) : null;
      }

      return cells;
    }
  },
  mounted() {
    this.heightRow = this.$refs.row.clientHeight;
  },
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
      .td-main__content {
        margin-left: 3px;
      }
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

  &.lighting {
    border: 2px dashed #a97171;
  }
}

.table__tr-imaginary-row {
  height: 5px;
}

</style>
