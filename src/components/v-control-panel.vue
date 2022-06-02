<template>
  <div class="control-panel">
    <button
        title="Показать\скрыть скрытые метрики"
        type="button"
        class="btn btn-light control-panel__button"
        :class="{'btn-light':!showHideMetric, 'btn-success':showHideMetric}"
        @click="TOGGLE_SHOW_HIDE_METRIC"
    ><i class="far fa-eye"></i></button>

    <button
        title="Режим перетаскивания"
        type="button"
        class="btn btn-primary control-panel__button control-panel__button_drag-and-drop"
        :class="{'btn-primary':!modeDragAndDrops, 'btn-success':modeDragAndDrops}"
        @click="TOGGLE_MODE_DRAG_AND_DROP"
    ><i class="fas fa-exchange-alt"></i></button>

    <button
        title="Отображать\скрывать формулы" type="button"
        class="btn control-panel__button"
        :class="{'btn-primary':!showFormulaMetric, 'btn-success':showFormulaMetric}"
        @click="TOGGLE_SHOW_HIDE_FORMULA"
    ><i class="fas fa-cogs"></i></button>

    <button
        title="Режим работы с формулами"
        type="button"
        class="btn control-panel__button"
        :class="{'btn-primary':!showInputBlockForWorkingFormula, 'btn-success':showInputBlockForWorkingFormula}"
        @click="TOGGLE_SHOW_HIDE_INPUT_BLOCK_FORMULA"

    >ƒ</button>

    <button
        title="Отображать\скрывать галочки для выбора статистик"
        type="button"
        class="btn control-panel__button"
        :class="{'btn-primary':!showCheckboxForStat, 'btn-success':showCheckboxForStat}"
        @click="TOGGLE_SHOW_HIDE_CHECKBOXES_FOR_STAT"
    ><i class="far fa-check-square"></i></button>
    <button
        v-if="showCheckboxForStat"
        title="Показать статистику"
        type="button"
        class="btn btn-success control-panel__button"
        @click="showStat"
    ><i class="fas fa-signal"></i></button>
    <button
        v-if="showCheckboxForStat"
        title="Сбросить галочки"
        type="button"
        class="btn btn-danger control-panel__button"
        @click="dropCheckboxes"
    ><i class="fas fa-times"></i></button>
    <button
        title="Окно со средним значением"
        type="button"
        class="btn btn-primary control-panel__button"><i class="far fa-window-restore"></i></button>
    <a
        title="Добавить новую метрику"
        href="/lightmetric/type/form"
        class="add-metric-btn"
        @click.prevent="newMetric"
    >
      <button
          type="button"
          class="btn btn-success control-panel__button"><i class="fas fa-plus"></i></button></a>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "v-control-panel",
  methods: {
    ...mapActions([
        'TOGGLE_SHOW_HIDE_CHECKBOXES_FOR_STAT',
        'TOGGLE_HIDE_CHECKBOXES_FOR_STAT',
        'TOGGLE_SHOW_HIDE_FORMULA',
        'TOGGLE_SHOW_HIDE_INPUT_BLOCK_FORMULA',
        'TOGGLE_SHOW_HIDE_METRIC',
        'SHOW_MODAL',
        'TOGGLE_MODE_DRAG_AND_DROP',
        'FETCH_METRIC_FORM',
        'SET_DATA_FOR_SUBMIT_FORM',
        'RESET_MODAL'
    ]),
    showStat() {
      if(this.statGraph.dataCells.length) {
        this.SHOW_MODAL();
      }
    },
    newMetric() {
      this.FETCH_METRIC_FORM()
          .then(() => {
            this.SET_DATA_FOR_SUBMIT_FORM({formType: 'metric', metricId: null})
          })

    },
    dropCheckboxes() {
      this.TOGGLE_HIDE_CHECKBOXES_FOR_STAT();
      this.RESET_MODAL();
    }
  },
  computed: {
    ...mapGetters([
        'showCheckboxForStat',
        'showFormulaMetric',
        'showInputBlockForWorkingFormula',
        'showHideMetric',
        'statGraph',
        'modeDragAndDrops'
    ])
  }
}
</script>

<style lang="scss">
.control-panel {
  display: flex;
  right: 0;
  position: fixed;
  flex-direction: column;
  top: 50px;
  z-index: 50;
  box-sizing: border-box;
  button {
    border: 1px solid black;
    width: 100%;
  }
  &__button {
    margin: 2px 0;
    &_drag-and-drop i{
      transform: rotate(90deg);
    }
  }
}
</style>