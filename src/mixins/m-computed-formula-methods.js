import {mapActions, mapGetters} from "vuex";

export default {
    methods: {
        ...mapActions([
            'SET_COMPUTED_VALUE'
        ]),
        processingFormula() {
            let params = this.getArrayParams(this.data.type_id);
            let resultValueString = '';
            if (params.length) {
                    resultValueString =  this.generateResultOnFormulaInCell(this.data, params);
                    if (!resultValueString) {
                        return false;
                    }
                    try {

                        let resultData = this.recognizeData(resultValueString);

                        if (this.data.computed_value !== resultData) {
                            this.SET_COMPUTED_VALUE({
                                metricId: this.data.type_id,
                                planedAt: this.data.planed_at,
                                value: resultData
                            });
                        }


                        // if (resultData.replace(/ /g, "") !== '' && resultData.replace(/ /g, "") !== cell.computedValue) {
                        //     this.parentTable.model.controller.fetch.updateComputedValue(cell.computedValueForDB);
                        // }
                    } catch (e) {
                        console.log(`Ошибка при расчете формулы ${this.formula} в ячейке ${this.data.planed_at} строки ${this.categoryNameById(this.data.type_id)} с ID = ${this.data.type_id}`);
                    }
            }
            else {
                let resultData = '';
                if (this.data.value) {
                    resultData = this.recognizeData(this.data.value);
                }
                if (this.data.computed_value !== resultData) {
                    this.SET_COMPUTED_VALUE({
                        metricId: this.data.type_id,
                        planedAt: this.data.planed_at,
                        value: resultData
                    });
                }

                    // if (resultData.replace(/ /g, "") !== '' && resultData.replace(/ /g, "") !== cell.computedValue) {
                    //     this.parentTable.model.controller.fetch.updateComputedValue(cell.computedValueForDB);
                    // }


            }
            // this.updateUnitAndColorInCells();
        },

        getArrayParams(metricId) {
            let metric = this.metricForId(metricId);
            let params = [];
            if (!metric) { return false }
            if (metric.formula === '' || metric.formula == 'null' || metric.formula === undefined) {
                return false;
            }
            let paramsObj = null;
            if (metric.formula) {
                paramsObj = metric.formula.match(/((\+|\*|\-|\/|\(|\)){1})|\$[0-9]+\$|[0-9]+(\.{1}[0-9]+)?/g) || false;
            }

            if (!paramsObj) {
                return false;
            }


            for (let key in paramsObj) {
                params.push(paramsObj[key]);
            }
            return params;
        },

        generateResultOnFormulaInCell(cell, params) {
            if ((cell.value == null && !params)) {
                return false;
            } else if (cell.value !== null && cell.value.toString().match('^[0-9]+:[0-5][0-9](:[0-5][0-9])?')) {
                return false;
            }

            if (!params) {
                return cell.value;
            }
            let resultValueString = '';
            params.forEach ((param) => {
                resultValueString += this.getFormulaCell(param, cell);
            })
            return resultValueString;
        },

        getFormulaCell(param, cell) {

            try {
                let result = '';
                let isAlias = (param.search(/\$[0-9]+\$/) >= 0);

                if (!isAlias) {
                    return  ` ${param} `;
                }

                let needleMetric = null;
                let idInAlias = param.match(/[0-9]+/);

                for ( let i = 0; i < this.allMetrics.length; i++) {
                    if (this.allMetrics[i].id === idInAlias[0]) {
                        needleMetric = this.allMetrics[i];
                        break;
                    }
                }

                if (needleMetric === null || needleMetric === undefined) {
                    return false;
                }

                if (Number(cell.type_id) === Number(needleMetric.id)) {
                    if (cell.value !== null && cell.value.toString().trim() !== '') {
                        return ` ${this.evalValue(cell.value)} `;
                    }
                    return false;
                }

                let params = [];
                try {
                    params = this.getArrayParams(needleMetric.id);
                } catch (e) {
                    throw new Error(e.message);
                }

                let currentNeedleCell = needleMetric.cells[cell.planed_at];
                  if (!params.length) {
                    if (currentNeedleCell.value !== null
                        && currentNeedleCell.value.toString().replace(/ /g, '') !== ''
                        && currentNeedleCell.value.toString().match('^[0-9]+:[0-5][0-9](:[0-5][0-9])?') == null) {

                        return ' ' +  this.evalValue(currentNeedleCell.value) + ' '
                    }

                    return false;
                }

                for (let i = 0; i < params.length; i++) {
                    result += this.getFormulaCell(params[i], currentNeedleCell);
                }

                if (result) {
                    return this.evalValue(result);
                }
                return false;
            } catch (e) {
                throw new Error(e.message);
            }

        },
        evalValue(value) {
            value = value.toString().replace(/ /g, "")
            try {
                if (eval(value) !== undefined && !value.includes('false')  ) {
                    return  eval(value).toString();
                }
            } catch (e) {
                // console.error(e.message, 'Название категории - ' +  this.row.name.innerHTML.trim(),'Дата - ' + this.planed );
                // console.error('Название категории - ' +  this.row.name.innerHTML.trim());
                // console.error('Дата в ячейке - ' + this.planed );
                // console.log('*****************************')
            }
            return '';
        },
        recognizeData(data){
            data = data.toString().replace(/ /g, "");
            if (this.isDateTime(data)) {
                return data;
            }
            if (this.evalValue(data)) {
                let value = this.evalValue(data);
                if (value.match('^[0-9]+(\.?[0-9])*$')) {
                    return this.around(value);
                }
            }
            return '';
        }

    },
    computed: {
        ...mapGetters([
            'allMetrics',
            'metricForId',
            'categoryNameById'
        ]),
    }
}