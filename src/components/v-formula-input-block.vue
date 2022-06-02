<template>
  <div
      class="formula-block"
      v-if="showInputBlockForWorkingFormula && modelValue != null"
  >
    <div v-if="metricNameForPrompt.length" id="prompt-alias-name">
     {{metricNameForPrompt}}
    </div>
    <form
        ref="form"
        action="#"
        @submit.prevent="saveFormula"
    >
      <input
          class="formula-block__input"
          name="formula_input"
          autocomplete="off"
          v-model.lazy="modelValue.formula"
          @click="getCurrentPosition"
          @keydown.esc="closeInput"
      >
      <button
          type="submit"
          class="btn btn-success edit-mod-toggle formula-block__btn"
      >
        <i class="far fa-check-square"></i>
      </button>
    </form>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";

export default {
  name: "v-formula-input-block",
  data() {
    return {
      modelValue: null,
      metricNameForPrompt: '',
    }
  },
  methods: {
    ...mapActions([
        'SAVING_FORMULA_FOR_METRIC',
        'TOGGLE_SHOW_HIDE_INPUT_BLOCK_FORMULA',
        'SET_METRIC_ID_FOR_LIGHTING',
    ]),
    saveFormula() {
      const formData = new FormData(this.$refs.form);

      this.SAVING_FORMULA_FOR_METRIC({formData, metricId: this.modelValue.id});
      this.SET_METRIC_ID_FOR_LIGHTING(null);
      this.metricNameForPrompt = '';
      this.TOGGLE_SHOW_HIDE_INPUT_BLOCK_FORMULA();
    },

    getCurrentPosition (e) {
      this.getAliasForInput(e.target.value, e.target.selectionStart)
    },
    getAliasForInput(str, pos) {
      str = String(str);
      pos = Number(pos) >>> 0;

      const left = str.slice(0, pos).lastIndexOf('$');
      const right = str.slice(pos).search(/\${1}/);

      let alias = str.slice(left, right + pos + 1);

      const isAlias = (alias.search(/\$[0-9]+\$/) >= 0);
      if (!isAlias){
        this.metricNameForPrompt = '';
        this.SET_METRIC_ID_FOR_LIGHTING(null);
        return;
      }
      alias = alias.match(/[0-9]+/)[0]
      this.SET_METRIC_ID_FOR_LIGHTING(alias.toString());
      this.metricNameForPrompt = this.metricForId(alias).name;
    },
    closeInput() {
      this.SET_METRIC_ID_FOR_LIGHTING(null);
      this.TOGGLE_SHOW_HIDE_INPUT_BLOCK_FORMULA();
    }
  },
  computed: {
    ...mapGetters([
        'showInputBlockForWorkingFormula',
        'getMetricForFormula',
        'metricForId',
    ]),

  },
  watch: {
    getMetricForFormula() {
      this.modelValue = this.metricForId(this.getMetricForFormula)
      if (this?.modelValue  && this.modelValue.formula == null) {
        this.modelValue.formula ='';
      }
    },
  }
}
</script>

<style lang="scss">
.formula-block {
  position: absolute;
  max-width: 600px;
  width: 100%;
  transform: translateX(-50%);
  left: 50%;
  display: flex;
  z-index: 100;
  form {
    display: flex;
    width: 100%;
    z-index: 1;
  }
  &__input {
    width: 100%;
    border-radius: 3px;
    height: 26px;
  }
  &__btn {
    height: 26px;
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #prompt-alias-name {
    position: absolute;
    bottom: calc(100% - 1px);
    padding: 5px;
    border-radius: 3px;
    background: #dbebea;
    border-left: 1px dashed #a97171;
    border-right: 1px dashed #a97171;
    border-top: 1px dashed #a97171;
  }
}

</style>