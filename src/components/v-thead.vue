<template>
  <thead class="table__head">
    <tr class="table__tr">
      <v-th
          classes="table__title-name_hashtag table__th table__th_main"
          title="#"
      ></v-th>
      <v-th
          classes="table__title-name_metric table__th table__th_main"
          title="Название метрики"
      ></v-th>
      <v-th
          classes="table__title-name_minimal table__th table__th_main"
          title="Мин"
      ></v-th>
      <v-th
          classes="table__title-name_normal table__th table__th_main"
          title="Норм"
      ></v-th>
      <v-th
          v-for="(mondayDate, index) in mondaysList"
          classes="table__th "
          :title="processingDate(mondayDate)"
          :key="index"
          :data="mondayDataByIdAndPlanedAt({id: categoryId, planed: mondayDate})"
          :planedAt="mondayDate"
          :categoryId="categoryId"
      ></v-th>
    </tr>
  </thead>
</template>

<script>
import vTh from './v-th'
import {mapGetters} from "vuex";

export default {
  name: "v-thead",
  components: {
    vTh
  },
  props: {
    categoryId: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    processingDate(mondayDate) {

      if (!this.getUserOptions.typeDisplayTitleMonth.value) {
        return mondayDate;
      }

      const [day, month, year] = mondayDate.split('-');
      const newDate = `${month}-${day}-${year}`
      const date = new Date(newDate)
      const ruMonth = date.toLocaleString('ru', {
        month: 'long'
      });

      return `${day}-${ruMonth}-${year}`;
    }
  },
  computed: {
    ...mapGetters([
        'mondaysList',
        'mondayDataByIdAndPlanedAt',
        'getUserOptions'
    ])
  }
}
</script>

<style lang="scss">
.table {
  &__head {
    position: sticky;
    top: 0;
    z-index: 30;
  }
  &__tr {
    border-bottom: 1px solid #367FA9;
  }
}
</style>