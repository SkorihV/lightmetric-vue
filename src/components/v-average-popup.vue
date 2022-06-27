<template>
  <div
      ref="averagePopup"
      v-if="getIsAverageMode && showAverageBlock"
      class="cell__average-wrapper "
      :class="{'cell__average-wrapper_bottom-display': isBottomAveragePopup, 'cell__average-wrapper_left-display':isLeftAveragePopup}"
  >
    <div class="cell__metric-name">{{metricName}}</div>
    <div v-if="averageValues.witchPrev !== null">Разница с предыдущей неделей: {{averageValues.witchPrev}}</div>
    <div v-if="averageValues.averageValuesInCurrentIntervalTime !== null">Среднее значение в текущей выборки: {{averageValues.averageValuesInCurrentIntervalTime}}</div>
    <div v-if="averageValues.witchNext !== null">Разница со следующей неделей: {{averageValues.witchNext}}</div>
    <div
        v-if="years != null ? Object.keys(years).length : false"
        class="cell__years-wrapper">
      <div class="cell__average-years-title">Среднее значение метрики по годам:</div>

      <div v-for="(year, key) in years" class="cell__years">
        {{key}} - {{year.averageValue}}
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from "vuex";


export default {
  name: "v-average-popup",
  props: {
    averageValues: {
      type: Object
    },
    metricName: {
      type: String
    },
    years: {
      type: Object
    },
    showAverageBlock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isBottomAveragePopup: false,
      isLeftAveragePopup: false
    }
  },
  computed: {
    ...mapGetters(['getIsAverageMode'])
  },
  watch: {
    showAverageBlock () {
      this.$nextTick(() => {
        const popup = this.$refs.averagePopup;
        const table = this.$refs.averagePopup?.closest('.v-table');
        if (popup && table) {
          this.isBottomAveragePopup = popup.getBoundingClientRect().top < table.getBoundingClientRect().top;
          this.isLeftAveragePopup = popup.getBoundingClientRect().right > table.getBoundingClientRect().right;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cell {
    &__average-wrapper {
       display: flex;
       flex-direction: column;
       justify-content: space-between;
       position: absolute;
       min-width: 300px;
       min-height: auto;
       background: white;
       z-index: 200;
       bottom: 100%;
       left: 50%;
       transform: translate(-50%, 8px);
       border-radius: 4px;
       border: 1px solid #367fa9;
       padding: 20px;
    &_bottom-display {
       transform: translate(-50%, -8px);
       bottom: inherit;
       top: 100%;
     }
    &_left-display {
       left: -40px;
     }
    }

    &__years-wrapper {
       display: flex;
       flex-direction: column;
       justify-content: center;
     }

    &__average-years-title,
    &__metric-name {
       font-size: 15px;
       font-weight: 600;
     }
}
</style>