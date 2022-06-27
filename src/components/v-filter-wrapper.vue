<template>
  <div class="filter">
    <button
        @click="isOpen = !isOpen"
        class="filter__btn-trigger">Фильтр</button>

    <div
        v-show="isOpen"
        class="filter__content">
      <form action="#" method="GET" class="filter__form">
        <div class="form-group">
          <label for="typeCategory">Категоря метрик</label>
          <select name="typeCategory[]" id="typeCategory" multiple data-badge="" class="form-control js-select2">
            <template v-if="selectedCategory.length">
              <option
                  v-for="category in getCategoriesList"
                  :key="category.id"
                  :value="category.id" :selected="selectedCategory.includes(category.id.toString())">{{category.name}}
              </option>
            </template>
            <template v-if="!selectedCategory.length">
              <option
                  v-for="category in getCategoriesList"
                  :key="category.id"
                  :value="category.id" :selected="category.id === 1">{{category.name}}
              </option>
            </template>

          </select>
        </div>

        <div class="form-group all-category">
          <a href="#" @click.prevent="selectedAllCategory">Все категории</a>
        </div>
        <div class="form-group">
          <label for="dateStart">Дата от</label>
          <div class="filter__datePickerWrapper datePickerInputWrapper">
            <Datepicker
                v-model="dateStart"
                name="dateStart"
                format="dd-MM-yyyy"
                weekNumbers
                autoApply
                showNowButton
                previewFormat="dd-MM-yyyy"
                calendarCellClassName="dp-custom-cell"
                locale="ru-RU"
                selectText="Выбрать"
                cancelText="Отмена"
                nowButtonLabel="Сегодня"
                weekNumName="Нед."
            ></Datepicker>
          </div>
        </div>

        <div class="form-group">
          <label for="dateEnd">Дата до</label>
          <div class="filter__datePickerWrapper datePickerInputWrapper">
            <Datepicker
                v-model="dateEnd"
                name="dateEnd"
                format="dd-MM-yyyy"
                weekNumbers
                autoApply
                showNowButton
                previewFormat="dd-MM-yyyy"
                calendarCellClassName="dp__custom-cell"
                locale="ru-RU"
                selectText="Выбрать"
                cancelText="Отмена"
                nowButtonLabel="Сегодня"
                weekNumName="Нед."
            ></Datepicker>
          </div>
        </div>

        <div class="filter__nav-panel">
          <button type="submit" class="filter__submit btn btn-primary">Показать</button>
          <a class="filter__reset" href="/lightmetric_vue/list"><i class="fas fa-redo-alt"></i></a>
        </div>

      </form>

    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  name: "v-filter-wrapper",
  components: {
    Datepicker
  },
  data() {
    return {
      isOpen: false,
      selectedCategory: [],
      dateStart: '',
      dateEnd: ''
    }
  },
  watch: {
    isOpen() {
      const [day_s, month_s, year_s] = this.getDateStart.split('-');
      const [day_e, month_e, year_e] = this.getDateEnd.split('-');
      const start = new Date(parseInt(year_s), parseInt(month_s) - 1, parseInt(day_s));
      const end = new Date(parseInt(year_e), parseInt(month_e) - 1, parseInt(day_e));
      this.dateStart = start;
      this.dateEnd = end;
    }
  },
  mounted() {
    if ( window.location.search.length) {
      this.selectedCategory = window.location
          .search
          .replace(/%5B/g, '[')
          .replace(/%5D/g, ']')
          .replace('?', '')
          .split('&')
          .filter(item => {
            return item.match(/typeCategory/) !== null;
          }).map(item => {
            return item.replace(/typeCategory\[[0-9]*\]=/, '')
          });
    }
    this.initSelectList();
  },
  methods: {
    selectedAllCategory() {
      this.selectedCategory = [];

      this.$nextTick(() => {
        this.selectedCategory = Object.values(this.getCategoriesList).map(category => category.id.toString());
        this.initSelectList();
      })

    },
    initSelectList() {
      $(document).ready(function() {
        $(".js-select2").select2({
          closeOnSelect: false,
          placeholder: "Категория",
          // allowHtml: true,
          allowClear: true,
          tags: true // создает новые опции на лету
        });
      });
    },
  },
  computed: {
    ...mapGetters(['getCategoriesList', 'getDateEnd', 'getDateStart'])
  },
}
</script>

<style lang="scss">



.filter {
  position: absolute;
  right: -50px;
  top: 60px;
  z-index: 60;
  background: white;
  transform: translateX(-50%);
  width: 250px;

  &__content {
    border: 1px solid #367fa9;
  }
  &__btn-trigger {
    cursor: pointer;
    padding: 0 80px;
    border-radius: 4px;
    background: #367fa9;
    color: white;
    height: 30px;
    display: flex;
    align-items: center;
    width: 100%;
  }
  &__form {
    max-width: 450px;
    display: flex;
    justify-content: space-between;
    z-index: 100;
    background: white;
    flex-direction: column;
    padding: 27px;
    box-sizing: border-box;
    align-items: start;
  }

  .form-group {
    margin-bottom: 10px;
  }

  &__datePickerWrapper {
    display: flex;
    width: auto;
    align-items: baseline;
    input {
      width: 80%;
    }
  }

  &__nav-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__submit {
    background-color: #3c8dbc;
    border-color: #367fa9;
  }

  &__reset {
    display: flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    background: #ff9a17;
    border-radius: 4px;
    color: white;
  }

}


.select2-search__field {
  width: 100%!important;
}
.select2-container {
  box-sizing: border-box;
}

.select2-results__option {
  padding-right: 20px;
  vertical-align: middle;
  display: flex;
  justify-content: space-between;
}

.select2-results__option:after {
  content: "";
  display: inline-block;
  position: relative;
  height: 20px;
  width: 20px;
  border: 2px solid #e9e9e9;
  border-radius: 4px;
  background-color: #fff;
  vertical-align: middle;
}

.select2-results__option[aria-selected=true]:after {
  font-family: fontAwesome;
  content: "\f00c";
  color: #fff;
  background-color: #367fa9;
  border: 0;
  display: inline-block;
  padding-left: 3px;
}

.select2-container--open .select2-dropdown--below {
  width: 250px!important;
  left: -27px!important;
  border-radius: 6px;
  box-shadow: 0 0 10px rgb(0 0 0 / 50%);
  top: 5px;
}

.select2-container--default {
  width: auto!important;

  .select2-results__option[aria-selected=true] {
    background-color: #fff;
  }
  .select2-selection--multiple {
    max-height: 250px;
    overflow-y: auto;

    .select2-selection__choice {
      display: flex;
      flex-direction: row-reverse;
      float: none;
      margin-right: 0;
      padding: 0 5px;
      justify-content: space-between;
      width: 100%!important;
      white-space:pre-wrap;
      align-items: center;
    }
    .select2-selection__choice__remove {
      background: #367fa9;
      color: white!important;
      cursor: pointer;
      display: flex;
      font-weight: bold;
      margin: 2px;
      width: 20px;
      height: 100%;
      text-align: center;
      border-radius: 4px;
      flex: 0 0 auto;
      justify-content: center;
      align-items: center;
    }
    .select2-selection__clear {
      margin-right: 50%!important;
      border: 1px solid black;
      width: 40px;
      height: 20px;
      text-align: center;
      border-radius: 4px;
      vertical-align: middle;
      line-height: 19px;
      background: #cb3d39;
      color: white;
      transform: translateX(50%);
    }
  }
}




.dp {
  &__selection_preview {
    font-size: 1.5rem;
  }
  &__button {
    display: none;
  }
  &__input {
    font-size: 1.5rem;
  }
  &__input_icons {
    width: 1.5rem;
    height: 1.5rem;
  }
  &__now_button {
    font-size: 1.4rem;
    color: #ff9a17;
  }

  &__calendar_header_item:first-child {
    border-right: 1px solid #dddddd;
    width: 45px;
  }
  &__week_num {
    border-right: 1px solid #dddddd;
    width: 45px;

  }
  &__custom-cell {

  }
  &__active_date {
    background-color: #ff9a17;
  }
  &__overlay_cell_active {
    background-color: #ff9a17;
  }
}

</style>