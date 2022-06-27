<template>
  <v-filter-wrapper />
  <div class="light-table-box" ref="generalWrapper">
    <keep-alive>
      <v-formula-input-block></v-formula-input-block>
    </keep-alive>
    <v-table
          v-for="(table, index) in tablesList"
          :key="index"
          :metrics="table"
      ></v-table>
      <v-control-panel />
  </div>
  <div class="bottom-control-panel">
    <div class="bottom-control-panel__add-metric">
      <a
          class="bottom-control-panel__add-link"
          href="/lightmetric_vue/type/form"
          @click.prevent="newMetric"
      >Добавить метрику</a>
    </div>
    <div class="bottom-control-panel__list-categories">
      <a href="/lightmetric/categories/list" class="btn btn-sm btn-danger">К списку категорий </a>
    </div>
    <div class="bottom-control-panel__list-metric-blocked">
      <a href="/lightmetric/type/listBlocked" class="btn btn-sm btn-danger">Удаленные метрики </a>
    </div>
  </div>
  <v-modal />
  <div class="spoiler">
    <input type="checkbox" id="spoiler1">
    <label
        for="spoiler1"
        id="spoiler-init"
         @click="getInformation"
    >Инструкция по работе</label>
    <div
        class="spoiler-content"
        id="spoiler-content-init"
        ref="contentForSpoiler"
    >
    </div>
  </div>
<!--  <vPreloader />-->
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import vTable from "@/components/v-table"
import vControlPanel from '@/components/v-control-panel'
import vFormulaInputBlock from '@/components/v-formula-input-block'
import vModal from '@/components/v-modal'
import vFilterWrapper from '@/components/v-filter-wrapper'
import vPreloader from '@/components/v-preloader'

export default {
  name: 'app-light-metric',
  components: {
    vTable,
    vControlPanel,
    vFormulaInputBlock,
    vModal,
    vFilterWrapper,
    vPreloader
  },
  data() {
    return {
      isInformation: false
    }
  },
  computed: {
    ...mapGetters([
        'tablesList',
        'getDataForUpdatedComputedValue',
        'initUploadNewDataComputedValues',
        'isProcessingFormulaForCell',
    ])
  },
  methods:{
    ...mapActions([
        'INIT_TRUE_PATH',
        'FETCH_DATA_METRIC',
        'UPDATED_COMPUTED_VALUES',
        'RESET_COUNT_CELLS_IN_PROCESSING',
        'RESET_DATA_FOR_FORMULA_PROCESSING',
        'INIT_PROCESSING_FORMULA_FOR_CELL',
        'FETCH_METRIC_FORM',
        'SET_DATA_FOR_SUBMIT_FORM',
        'TOGGLE_PRELOADER',
        'UPDATE_POSITION_FOR_METRIC_GROUP',
        'RESET_MODAL'
    ]),
    initStorage() {
      const storage = JSON.parse(localStorage.getItem('group'));
      if (!storage) {
        localStorage.setItem('group', JSON.stringify({ group: [] }));
      }
    },
    newMetric() {
      this.RESET_MODAL();
      this.FETCH_METRIC_FORM()
          .then(() => {
            this.SET_DATA_FOR_SUBMIT_FORM({formType: 'metric', metricId: null})
          })
    },
    getInformation() {
      if (this.isInformation) return true;

          fetch('/lightmetric/faq')
              .then(response => response.text())
              .then(html => {
                this.$refs.contentForSpoiler.innerHTML = html;
                this.isInformation = true;
              })
              .catch((err) => console.error(err));
        }
  },
  mounted() {
    this.initStorage();
    this.INIT_TRUE_PATH();
    this.FETCH_DATA_METRIC();
  },
  watch: {
    initUploadNewDataComputedValues() {
      if (this.initUploadNewDataComputedValues && this.getDataForUpdatedComputedValue.length) {
        this.UPDATED_COMPUTED_VALUES(this.getDataForUpdatedComputedValue)
            // .then(() => {
            //   this.UPDATE_POSITION_FOR_METRIC_GROUP(this.getCategoryIdForProcessingFormulaInCells);
            // })
            .then(() => {
              this.RESET_DATA_FOR_FORMULA_PROCESSING();
            })

      }

    }
  },

  beforeUpdate() {
    setTimeout(()=> {
      document.querySelector('.light-table-box').scrollLeft = this.$refs.generalWrapper.scrollWidth;
    }, 1000)
  },

}
</script>

<style lang="scss">
* {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
}
.light-table-box {
  overflow: auto;
  max-height: 650px;
  height: auto;
  margin-top: 10px;
  background-color: #00a65a12;
  width: calc(100% - 45px);
}

.bottom-control-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin-right: 45px;

  &__add-metric {
    display: inline-flex;
    margin: 10px 0;
  }
  &__add-link {
    background: #00A65A;
    padding: 10px;
    border: 1px solid #367fa9;
    text-decoration: none;
    color: white;
    font-weight: 800;
    border-radius: 4px;
    &:hover {
      text-decoration: none;
      color: white;
    }
    &:focus {
      text-decoration: none;
      color: white;
    }
  }

  &__list-categories {
    margin: 0 10px 0 auto;
  }
}

/*Стили связанные с инструкцией --- начало*/


.spoiler label {
  cursor: pointer;
  border: 1px solid #367fa9;
  padding: 5px 10px;
  border-radius: 3px;
  background: #93c47d;
}

.spoiler input, .spoiler .spoiler-content  {
  display: none;

}

.spoiler :checked ~ .spoiler-content {
  display:flex;

}

.spoiler .spoiler-content {
  flex-direction:column;
  width: 100%;
  padding: 10px;
  border: 2px dashed #367fa9;
  border-radius: 5px;
}

.spoiler .sp-img {
  object-fit: contain;
}

.spoiler .list {
  margin: 20px 0;
  background:#367fa9;
  padding: 10px 20px;
  color:white;
  font-size: 15px;
}

.spoiler a {
  color:white;
  border-bottom: 1px dashed;
}

.spoiler .list li:hover a {
  border-bottom: 1px dashed #dd4b39;
}

.spoiler .list li:hover::marker {
  color:#dd4b39;
}

a.link-module:hover {
  border-bottom: 1px dashed #dd4b39;

}
a.link-module:hover::marker  {
  color:#dd4b39;

}


.spoiler {
  .prompt-module {
    margin: 20px 0;
    background:#367fa9;
    padding: 10px 20px;
    color:white;
  }
  .prompt-module p{
    font-size: 15px;
  }
  .btn.btn-light {
    color:black;
  }
  #add-metric-btn {
    border-radius: 50%;
  }
  .draganddrop {
    transform: rotate(90deg);

  }
}
/*Стили связанные с инструкцией --- конец*/

::-webkit-scrollbar {
  width: 15px; /* ширина нового скроллбара */

}

::-webkit-scrollbar-track {
  background: #ffd966; /* цвет фона у дорожки */
  box-shadow: 0 0 2px rgba(0, 0, 0, .2) inset; /* тень у дорожки */
}

::-webkit-scrollbar-thumb {
  background: #367fa9; /* цвет фона у дорожки */
  border-radius: 8px; /* скругление углов */
  border: 3px solid #f5cdcd; /* толщина, стиль и цвет рамки */
}

::-webkit-scrollbar-thumb:hover {
  background: #b91414; /* ползунок меняет цвет при наведении */
}

::-webkit-scrollbar-corner {
  background: #367fa9;
  height: 10px;
}


</style>
