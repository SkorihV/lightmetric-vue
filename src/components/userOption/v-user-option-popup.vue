<template>
  <div
      v-if="isShow"
      class="option-popup option">
      <h5 class="option__title">Индивидуальные настройки:</h5>
      <div class="option__options-wrapper">
        <div
            v-for="option in getUserOptions"
            class="option__item-wrapper">
          <component
              :is="'vOption' + option.type"
              :data="option"
          ></component>
        </div>
      </div>
      <form class="option__form" action="#" @submit.prevent="submitUserOption">
        <textarea name="userOption" class="option__textarea">{{getUserOptions}}</textarea>
        <button  type="submit" class="option__submit btn btn-primary">Сохранить настройки</button>
      </form>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import vOptionCheckbox from '@/components/userOption/v-option-checkbox'

export default {
  name: "v-user-option-popup",
  components: {
    vOptionCheckbox
  },
  emits: [
    'closePopupUserOptions'
  ],
  props: {
    isShow : {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async submitUserOption(e) {
      const userOptionUrl = this.getUrls[this.getTypeLightmetric].userOptionUrl;
      const formData = new FormData(e.target)
      let fetchResponse = await fetch(userOptionUrl, {
        method: 'POST',
        body: formData
      })

      if (!fetchResponse.ok) {
        throw new Error(`Ошибка по адресу ${userOptionUrl}, статус ошибки ${fetchResponse.status}`);
      }
      this.$emit('closePopupUserOptions');
    }
  },
  computed: {
    ...mapGetters([
        'getUserOptions',
        'getUrls',
        'getTypeLightmetric'
    ])
  }
}
</script>

<style lang="scss" scoped>
.option {

  &-popup {
    position: absolute;
    right: 100%;
    bottom: 0;
    min-width: 500px;
    min-height: 300px;
    background: white;
    z-index: 250;
    border-radius: 4px;
    border: 1px solid #2d6a9f;
    padding: 10px;
    margin-right: 4px;
    max-height: 230px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    max-width: 650px;
    transform: translateY(50%);
  }

  &__title {
    white-space: nowrap;
    font-weight: bold;
    border-bottom: 1px dashed #367fa9;
    padding-bottom: 10px;
  }

  &__form {
    margin-top: auto;

  }

  &__textarea {
    display: none;
  }
  &__submit {
    width: auto;
  }
}


</style>