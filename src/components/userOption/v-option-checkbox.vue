<template>
  <div class="option__item">
    <div class="prompt__icon">
      <i class="fas fa-question-circle"></i>
    </div>
    <div class="prompt__text">{{data?.prompt}}</div>
    <label class="option__label">
      {{data?.title}}
      <div class="option__switch-box">
        <div class="option__input-wrapper">
          <input
              v-model="data.value"
              type="checkbox" class="option__input checkbox">
          <div class="checkbox__is-checked"></div>
          <div class="checkbox__is-unchecked"></div>
        </div>
      </div>
    </label>

  </div>
</template>

<script>

export default {
  name: "v-option-checkbox",
  props: {
    data: {
      type: Object,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>

.option {
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    padding-left: 10px;
  }

  .prompt {
    &__icon {
      cursor: pointer;
      position: relative;
      display: flex;
      align-self: center;
      &:hover + .prompt__text {
        display: flex;
      }
    }
    &__text {
      display: none;
      position: absolute;
      background-color: white;
      z-index: 200;
      border: 1px solid #367fa9;
      margin: 5px;
      padding: 5px;
      width: auto;
      border-radius: 4px;
      align-self: center;

      &:hover {
        display: flex;
      }
    }
  }


  &__input-wrapper{
    width: 80px;
    height: 30px;
    position: relative;
    cursor: pointer;
    border-radius: 25px;

    .checkbox {
      width: 80px;
      height: 30px;
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: #367fa9;
      border-radius: 25px;
      position: relative;
      outline: 0;
      -webkit-transition: all .2s;
      transition: all .2s;
      margin: 0 5px;

      &:after {
        position: absolute;
        content: "";
        top: 3px;
        left: 3px;
        width: 24px;
        height: 24px;
        background: #dfeaec;
        z-index: 2;
        border-radius: 50%;
        -webkit-transition: all .35s;
        transition: all .35s;
      }

      &__is-checked {
        width: 18px;
        left: 18%;
        -webkit-transform: translateX(190%) translateY(-30%) scale(0);
        transform: translateX(190%) translateY(-30%) scale(0);
      }

      &__is-unchecked {
        width: 15px;
        right: 10%;
        -webkit-transform: translateX(0) translateY(-30%) scale(1);
        transform: translateX(0) translateY(-30%) scale(1);
      }

      &:checked {
        background: #4da54d;
      }

      &:checked:after {
        left: calc(100% - 27px);
      }

      &:checked + .checkbox__is-checked{
        -webkit-transform: translateX(0) translateY(-30%) scale(1);
        transform: translateX(0) translateY(-30%) scale(1);
      }

      &:checked ~ .checkbox__is-unchecked{
        -webkit-transform: translateX(-190%) translateY(-30%) scale(0);
        transform: translateX(-190%) translateY(-30%) scale(0);
      }
    }
  }
}


</style>