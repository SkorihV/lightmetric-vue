<template>
  <div
    v-show="showModal"
    ref="modal"
    id="popup-block"
    :class="{editMode: editMode}"
    @submit.prevent="submitData"
    @click="handlerDelete"
  >
    <div
      id="popup-block__close"
      @click="RESET_MODAL"
    >
      <i class="fas fa-times"></i>
    </div>
    <div id="popup-block__content" >
      <div v-if="isNormalizeData">
        <p>Максимальное значение на графике - {{maxNumberOfGraph}}</p>
        <p>Минимальное значение на графике - {{minNumberOfGraph}}</p>
      </div>
      <div
        v-show="statGraph.dataCells.length"
        data-highcharts-chart="0"
        style="overflow: hidden;"
        id="popup-block-for-graphs"
      >
      </div>
      <div v-html="htmlForModal"></div>
      <v-comment-element
        v-if="displayingComment"
      ></v-comment-element>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import vCommentElement from './v-comment-element'

export default {
  name: "v-modal",
  components: {
    vCommentElement
  },
  data() {
    return {
      chart: null
    }
  },

  methods: {
    ...mapActions([
      'SHOW_MODAL',
      'RESET_MODAL',
      'SUBMIT_FORM',
      'DELETE_DATA',
      'DELETE_COMMENT_FOR_CELL'
    ]),
    submitData(e) {
      const formData = new FormData(e.target)
      this.SUBMIT_FORM({formData:formData, dataForSubmit: this.getDataForSubmitForm})
    },
    handlerDelete(e) {
      const t = e.target;

      const deleteElement = t.closest('.delete a');

      if (deleteElement) {
        e.preventDefault();

        if(confirm('Вы действительно хотите это удалить?!')) {
          this.DELETE_DATA({dataUrl: deleteElement.href, dataType: this.getDataForSubmitForm});

        }
      }

      if(t.closest('.delete-comment-cell a')) {
        e.preventDefault();

        this.DELETE_COMMENT_FOR_CELL(this.$refs.modal)
          .then(() => {
            this.RESET_MODAL();
          });
      }
    },

    createStat(data){
      Highcharts.chart('popup-block-for-graphs', {
        chart: {
          height: 300,
          width: 1000,
          type: 'line'
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        xAxis: {
          categories: data.planed
        },
        tooltip: {
          shared: true,
          crosshairs: true
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        },
        plotOptions: {
          series: {
            allowPointSelect: true
          }
        },
        series: data.dataCells,
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        },
        accessibility: false
      });
    },
    normalizeNumber(number) {
      const minNormalizeNumber = 0;
      const maxNormalizeNumber = 100;

      if (typeof number !== 'number') {
        return number;
      }
      let returnNumber = minNormalizeNumber + ((number - this.minNumberOfGraph) / (this.maxNumberOfGraph - this.minNumberOfGraph) * (maxNormalizeNumber - minNormalizeNumber));
      return parseFloat(returnNumber.toFixed(3))
    }
  },
  computed: {
    ...mapGetters([
      'showModal',
      'statGraph',
      'htmlForModal',
      'editMode',
      'displayingComment',
      'dataForComment',
      'getDataForSubmitForm',
      'getIsSubmiting',
      'getUserOptions'
    ]),
    isNormalizeData() {
      return this.getUserOptions?.typeNormalizeDataForGraph ? this.getUserOptions?.typeNormalizeDataForGraph.value : false;
    },
    maxNumberOfGraph() {
      let arrayNumbers = [];
      this.statGraph?.dataCells.forEach(itemData => {
        itemData.data.forEach(value => {
          if ( typeof value === 'number'){
            arrayNumbers.push(value)
          }
        })
      })
      return Math.max(...arrayNumbers);
    },
    minNumberOfGraph() {
      let arrayNumbers = [];
      this.statGraph?.dataCells.forEach(itemData => {
        itemData.data.forEach(value => {
          if ( typeof value === 'number'){
            arrayNumbers.push(value)
          }
        })
      })
      return Math.min(...arrayNumbers);
    },
    mutationDataCellsForNormalizeData() {
      if (!this.isNormalizeData) {
        return this.statGraph
      }
      const newData = JSON.parse(JSON.stringify(this.statGraph));
      for (let key in newData.dataCells ) {
        newData.dataCells[key].data = newData.dataCells[key].data.map(item => {
          return this.normalizeNumber(item)
        })
      }
      return newData;
    }
  },
  watch: {
    showModal() {
      if(this.showModal && this.statGraph.dataCells.length) {
        this.createStat(this.mutationDataCellsForNormalizeData);
      }
    },
    isNormalizeData() {
      if(this.showModal && this.statGraph.dataCells.length) {
        this.createStat(this.mutationDataCellsForNormalizeData);
      }
    },
    statGraph: {
      handler() {
        if(this.showModal && this.statGraph.dataCells.length) {
          this.createStat(this.mutationDataCellsForNormalizeData);
        }
      },
      deep: true
    },
    getIsSubmiting() {
      const form = this.$refs.modal.querySelector('form');
      if (form) {
        const formData = new FormData(form)
        this.SUBMIT_FORM({formData:formData, dataForSubmit: this.getDataForSubmitForm})
      }
    }
  }
}
</script>

<style lang="scss">

#popup-block {
  position: fixed;
  display: flex;
  flex-direction: row;
  min-width: 300px;
  z-index:100;
  background: white;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, calc(-50% + 50px));
  -moz-transform: translate(-50%, calc(-50% + 50px));
  -ms-transform: translate(-50%, calc(-50% + 50px));
  -o-transform: translate(-50%, calc(-50% + 50px));
  transform: translate(-50%, calc(-50% + 50px));
  padding: 30px 20px 15px;
  border: 1px solid #367fa9;
  border-radius:4px;

  &__content {
    display: flex;
    overflow-y: auto;
    flex-direction: column;
  }

  &__close {
    position: absolute;
    font-size: 15px;
    right: -10px;
    top: -10px;
    background: #367fa9;
    color: white;
    line-height: 30px;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border:solid 1px white;
  }
  .typeForm {
    .form-group {
      &.editMode{
        display:none;
      }
    }
  }

  &.editMode {
    .typeForm {
      .form-group {
        &:not(.editMode) {
          display:none;
        }
        &.editMode {
          display:block;
        }
        &.visible {
          display:flex;
        }
      }
    }

    form[name='week_cell_form'] {
      .editValue {
        display: none;
      }
      ~.delete-comment-cell,
      ~.delete.delete-hide{
        display: none;
      }
    }

    form[name='week_cell_month_form'] {
      .editValue {
        display: none;
      }
      ~.delete-comment-cell,
      ~.delete.delete-hide{
        display: none;
      }
    }

  }
}

#popup-block .typeForm .form-group.editMode {
  display:none;
}

#popup-block.editMode .typeForm .form-group:not(.editMode) {
  display:none;
}

#popup-block.editMode .typeForm .form-group.editMode {
  display:block;
}

#popup-block.editMode .typeForm .form-group.visible {
  display:flex;
}

</style>
