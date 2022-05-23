<template>
    <td
        class="td-main"
        :class="classes"
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
        <div v-if="!showFormulaMetric" class="td-main__content">
          {{data.name}}
        </div>
        <div
            v-if="showFormulaMetric"
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
            v-if="!isGroup"
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
  mounted() {
    if (this.data?.comment) {
      this.isComment = true;
    }
  },
  props: {
    data: {
      type: Object,
      require: true
    },
    classes: {
      type: String,
      require: false,
      default: ''
    },
    isGroup: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isComment: false,
      checkboxValue: false,
    }
  },
  methods: {
    ...mapActions([
        'TOGGLE_SHOW_HIDE_GROUP_METRICS',
        'SET_DATA_FOR_STAT_GRAPHS',
        'REMOVE_ALL_DATA_FOR_STAT_GRAPHS',
        'REMOVE_DATA_FOR_STAT_GRAPHS',
        'TOGGLE_SHOW_HIDE_MODAL',
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
      let storage = JSON.parse(localStorage.getItem('group'));

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

      if (storage.group.includes(this.data.id)) { return false;}
      storage.group.push(this.data.id);

      localStorage.setItem('group', JSON.stringify(storage));
    },
    getDataForStatCurrentMetric() {
      let dataForStat         = {};
      dataForStat.id          = this.data.id;
      dataForStat.data        = [];
      dataForStat.name        = this.data.name;
      dataForStat.dataLabels  = { enabled: true };


      let cells = Object.entries(this.allCellsInMetric(this.data.id));
      cells = cells.map(item => {
        return item[1];
      }).sort(function(a,b)  {
        let a_date_arr = a.planed_at.split('-');
        let a_date = new Date(a_date_arr[2], a_date_arr[1], a_date_arr[0])

        let b_date_arr = b.planed_at.split('-');
        let b_date = new Date(b_date_arr[2], b_date_arr[1], b_date_arr[0])
        return a_date - b_date;
      })

      cells.forEach(data => {
        if (data.computed_value) {
          if (this.isDateTime(data.computed_value)) {
            dataForStat.data.push(parseFloat(data.computed_value.replace(/:/g, '.')));
          } else {
            dataForStat.data.push(parseFloat(data.computed_value));
          }
        } else if (data.value) {
            if (this.isDateTime(data.value)) {
              dataForStat.data.push(parseFloat(data.value.replace(/:/g, '.')));
            } else {
              dataForStat.data.push(parseFloat(data.value));
            }
        } else {
            dataForStat.data.push(null);
        }
      })

      this.SET_DATA_FOR_STAT_GRAPHS(dataForStat);
    },
    changeCheckbox() {
        if(this.showCheckboxForStat) {
          this.checkboxValue = !this.checkboxValue;
        }
    },
    isDateTime(value){
      if (value === false || value === '') {
        return false
      }
      if (value.toString().match('[0-9]+:[0-5][0-9](:[0-5][0-9])?') !== null) {
        return true;
      }
      return false;
    },
    handlerClickComment() {
      this.SET_DATA_FOR_COMMENT({userName: this.data.uname, commentText: this.data.comment, dateTime: this.data.updated_at});
    },
    handlerClickGraph() {
      this.RESET_MODAL()
          .then(()=> {
            this.getDataForStatCurrentMetric();
            this.TOGGLE_SHOW_HIDE_MODAL(true);
          });

    }
  },
  computed: {
    ...mapGetters([
        'showCheckboxForStat',
        'showFormulaMetric',
        'allCellsInMetric',
        'dataResetCheckboxesStat',
        'displayingComment'
    ]),
  },
  watch: {
    checkboxValue() {
      this.checkboxValue ? this.getDataForStatCurrentMetric() : this.REMOVE_DATA_FOR_STAT_GRAPHS(this.data.id);
    },
    dataResetCheckboxesStat() {
      this.checkboxValue = false;
    },
    displayingComment() {
      this.usingComment = false;
    }
  },
  beforeUpdate() {
    if (this.data?.comment) {
      this.isComment = true;
    }
  }
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
  &__content-wrapper {
    display: flex;
  }
  &__content {
    display: flex;
    justify-content: center;
    margin-right: 30px;
  }
  &__checkbox-wrapper {
    display: flex;
    margin: 0 3px;
  }
  &__checkbox {
    margin: 4px 0 0;
    line-height: normal;
  }
  &__system-data {
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
  }
  &__formula {
    margin-left: auto;
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