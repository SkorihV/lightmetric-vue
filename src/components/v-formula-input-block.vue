<template>
  <div
      class="formula-block"
      v-if="showInputBlockForWorkingFormula && modelValue != null"
  >
    <form
        ref="form"
        action="#"
        @submit.prevent
    >
      <input
          class="formula-block__input"
          name="formula_input"
          autocomplete="off"
          v-model.lazy="modelValue.formula"
      >
      <button
          type="submit"
          class="btn btn-success edit-mod-toggle formula-block__btn"
          @click.stop="saveFormula"
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
  props: {
  },
  data() {
    return {
      modelValue: null
    }
  },
  methods: {
    ...mapActions([
        'SAVING_FORMULA_FOR_METRIC',
        'TOGGLE_SHOW_HIDE_INPUT_BLOCK_FORMULA'
    ]),
    saveFormula() {
      let formData = new FormData(this.$refs.form);

      this.SAVING_FORMULA_FOR_METRIC({formData, metricId: this.modelValue.id});
      this.TOGGLE_SHOW_HIDE_INPUT_BLOCK_FORMULA();
    }
  },
  computed: {
    ...mapGetters([
        'showInputBlockForWorkingFormula',
        'getMetricForFormula',
        'metricForId'
    ]),
    ...mapState([]),
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
}

</style>