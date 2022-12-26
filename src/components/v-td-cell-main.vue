<template>

    <td
        class="td-main"
        :class="classes, {'green-shadow': showFormulaMetricOrange}"
        :style="{backgroundColor: data.color_row}"
        @click="changeCheckbox"
        @contextmenu.prevent="getMetricFormEditMode"
        @dblclick="getMetricForm"

    >
      <div class="td-main__content-wrapper">
        <div class="td-main__checkbox-wrapper" v-if="showCheckboxForStat && !isGroup">
          <input
              v-model="checkboxValue"
              class="td-main__checkbox"
              type="checkbox">
        </div>
        <div v-if="!showFormulaMetric || !data.formula?.length" class="td-main__content">
          {{data.name}}
        </div>
        <div
            v-if="showFormulaMetric && data.formula?.length"
            class="td-main__system-data"
            :title="data.name"
        >
          <div class="td-main__formula">{{data.formula}}</div>
        </div>
        <v-comment-trigger
            v-if="isComment"
            :dataComment="data.comment"
            @click="handlerClickComment"
        ></v-comment-trigger>
        <div
            v-if="!isGroup && isExistValuesInCells"
            class="td-main__show-stat-toggle"
             @click="handlerClickGraph">
          <i class="fas fa-signal"></i>
        </div>

        <div
            class="toggle-slide-for-group"
            v-if="isGroup"
            @click="toggleGroupHide"
        >
          <i class="fas fa-sign-out-alt show-group" @click="removeLocalRowOnId" v-if="data.isHideLikeGroupMainMetric"></i>
          <i class="fas fa-sign-in-alt hide-group" @click="addLocalRowOnId"  v-if="!data.isHideLikeGroupMainMetric" ></i>
        </div>
      </div>
    </td>
</template>

<script>
import vCommentTrigger from './v-comment-trigger'
import vCommentStorage from './v-comment-element'
import {mapActions, mapGetters} from "vuex";

export default {
  name: "v-td-cell-main",
  components: {
    vCommentTrigger,
    vCommentStorage
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    classes: {
      type: String,
      default: ''
    },
    isGroup: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      checkboxValue: false,
    }
  },
  methods: {
    ...mapActions([
        'TOGGLE_SHOW_HIDE_GROUP_METRICS',
        'SET_DATA_FOR_STAT_GRAPHS',
        'REMOVE_DATA_FOR_STAT_GRAPHS',
        'SHOW_MODAL',
        'FETCH_METRIC_FORM',
        'EDIT_MODE_ON',
        'EDIT_MODE_OFF',
        'SET_DATA_FOR_COMMENT',
        'RESET_MODAL',
        'SET_DATA_FOR_SUBMIT_FORM'
    ]),
    getMetricFormEditMode() {
      this.RESET_MODAL()
          .then(()=> {
            this.EDIT_MODE_ON();
            this.FETCH_METRIC_FORM(this.data.id)

          })
          .then(() => {
            this.SET_DATA_FOR_SUBMIT_FORM({formType: 'metric', metricId: this.data.id})
          })
    },
    getMetricForm() {
      this.RESET_MODAL()
          .then(()=> {
            this.EDIT_MODE_OFF();
            this.FETCH_METRIC_FORM(this.data.id);
          })
          .then(() => {
            this.SET_DATA_FOR_SUBMIT_FORM({formType: 'metric', metricId: this.data.id})
          })
    },
    toggleGroupHide() {
      this.TOGGLE_SHOW_HIDE_GROUP_METRICS(this.data.id);
    },

    removeLocalRowOnId() {
      const storage = JSON.parse(localStorage.getItem('group'));

      if (storage) {
        let index = storage.group.indexOf(this.data.id);
        if (index > -1) {
          storage.group.splice(index, 1);
        }

        localStorage.setItem('group', JSON.stringify(storage));
      }
    },

    addLocalRowOnId() {
      let storage = JSON.parse(localStorage.getItem('group'));

      if (storage.group.includes(this.data.id)) {
        return false;
      }
      storage.group.push(this.data.id);

      localStorage.setItem('group', JSON.stringify(storage));
    },
    getDataForStatCurrentMetric() {
      const dataForStat = {
          id        : this.data.id,
          data      : [],
          name      : this.data.name,
          dataLabels: { enabled: true }
      };


      let cells = Object.entries(this.allCellsInMetric(this.data.id));

      cells = cells.map(item => {
        return item[1];
      }).sort((a, b) => {
        const [a_day, a_month, a_years]  = a.planed_at.split('-');
        const a_date      = new Date(a_years, a_month, a_day);

        const [b_day, b_month, b_years]  = b.planed_at.split('-');
        const b_date = new Date(b_years, b_month, b_day);

        return a_date - b_date;
      })

      cells.forEach(data => {
        // dataForStat.data.push(data.value);


        if (this.isDateTime(data.computed_value || data.value)) {
          dataForStat.data.push(this.valueForGraph(data));
        } else if (data.computed_value || data.value) {
          dataForStat.data.push(parseFloat(data.computed_value || data.value));
        } else {
          dataForStat.data.push(null);
        }

      })
      this.SET_DATA_FOR_STAT_GRAPHS(dataForStat);
    },

    valueForGraph(data){
      let value = data?.computed_value || data?.value || null
      if (!value) return value;
      value = value.replace(/:/g, '.');

      if (this.getUserOptions.typeRoundingInChart.value) {
        const [hours, minutes] = value.split('.');
        return parseFloat((((parseInt(hours) * 60) + parseInt(minutes)) / 60).toFixed(2));
      }
      return parseFloat(value);

    },
    changeCheckbox() {
        if(this.showCheckboxForStat && !this.isGroup) {
          this.checkboxValue = !this.checkboxValue;
        }
    },
    isDateTime(value){
       return value?.toString().match('[0-9]+:[0-5][0-9](:[0-5][0-9])?') !== null || false;
    },
    handlerClickComment() {
      this.SET_DATA_FOR_COMMENT({userName: this.data.uname, commentText: this.data.comment, dateTime: this.data.updated_at});
    },
    handlerClickGraph() {
      this.RESET_MODAL()
          .then(()=> {
            this.getDataForStatCurrentMetric();
            this.SHOW_MODAL();
          });

    }
  },
  computed: {
    ...mapGetters([
        'showCheckboxForStat',
        'showFormulaMetric',
        'allCellsInMetric',
        'dataResetCheckboxesStat',
        'displayingComment',
        'getUserOptions'
    ]),
    isComment() {
      if (this.data?.comment) {
        return true;
      }
      return false;
    },
    isExistValuesInCells() {
      return  Boolean(Object.values(this.data.cells).filter(cell => {
        return (cell.value !== null || cell.value !== '') && (cell.computed_value !== null || cell.computed_value !== '');
      }).length);
    },
    showFormulaMetricOrange() {
      return this.showFormulaMetric && this.data.formula?.length;
    }
  },
  watch: {
    checkboxValue() {
      this.checkboxValue ? this.getDataForStatCurrentMetric() : this.REMOVE_DATA_FOR_STAT_GRAPHS(this.data.id);
    },
    dataResetCheckboxesStat() {
      this.checkboxValue = false;
    },
  },
}
</script>

<style lang="scss">
.td-main {
    position: -webkit-sticky;
    position: sticky;
    left: 50px;
    z-index: 10;
    width: 303px;
    padding-left: 3px;
  &.green-shadow {
    font-weight: bold;
    box-shadow: 0 0 5px 2px #51aa51 inset;
  }
  &__content-wrapper {
    display: flex;
  }
  &__content {
    display: flex;
    justify-content: center;
    margin-right: 30px;
    margin-left: 16px;
  }
  &__checkbox-wrapper {
    display: flex;
    margin-right: 3px;
    +.td-main__content {
      margin-left: 0;
    }
  }
  &__checkbox {
    margin: 4px 0 0;
    line-height: normal;
  }
  &__system-data {
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    max-width: 303px;
    overflow-x: hidden;
  }
  &__formula {
    margin-left: auto;
    max-width: 303px;
  }
  &__show-stat-toggle {
    color: white;
    width: 12px;
    height: 12px;
    display: flex;
    flex: 1 0 auto;
    justify-content: flex-end;
    bottom: 2px;
    right: 1px;
    position: absolute;
    font-size: 10px;
    cursor: pointer;
  }
  .toggle-slide-for-group {
    display: none;
    position: absolute;
    right: 10px;
    color: #367FA9;
    transform: translateY(-50%);
    cursor: pointer;
    top: 50%;
  }
  &:hover {
    .toggle-slide-for-group {
      display: flex;
    }
  }
  .toggle-slide-for-group {
    .hide-group {
      transform:rotate(-90deg);
    }
    .show-group {
      transform:rotate(90deg);
    }
  }
}
</style>