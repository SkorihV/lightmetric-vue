// import {isTime, evalValue} from './utils';
// // import {useStoreGetters,useStoreActions} from '@/composable/use/useStore'
//
//
// export function  processingFormula (props, store)  {
//     const {useStoreGetters, useStoreActions} = store;
//     const {categoryNameById} = useStoreGetters();
//     const {SET_COMPUTED_VALUE, SET_DATA_FOR_UPDATING_COMPUTED_VALUE} = useStoreActions();
//
//
//     const params = getArrayParams(props.data.type_id, store);
//     let resultValueString = '';
//     if (params.length) {
//         resultValueString = generateResultOnFormulaInCell(props.data, params, store);
//         if (!resultValueString) {
//             return false;
//         }
//         try {
//             // let resultData = recognizeData(resultValueString);
//             const resultData = (resultValueString) ? resultValueString : '';
//
//             if (props.data.computed_value !== resultData) {
//                 SET_COMPUTED_VALUE({
//                     metricId: props.data.type_id,
//                     planedAt: props.data.planed_at,
//                     value: resultData
//                 });
//
//
//                 if (Number(props.data.value) !== Number(resultData)) {
//                     SET_DATA_FOR_UPDATING_COMPUTED_VALUE({
//                         computedValue: resultData,
//                         planed: props.data.planed_at,
//                         typeId: props.data.type_id
//                     })
//                 }
//             }
//
//         } catch (e) {
//             console.log(`Ошибка при расчете формулы ${props.formula} в ячейке ${props.data.planed_at} строки ${categoryNameById(props.categoryId).value} с ID = ${props.data.type_id}`);
//         }
//     }
//     else {
//         // let resultData = '';
//         // if (props.data.value) {
//         //     // resultData = recognizeData(props.data.value);
//         //     resultData = resultValueString;
//         //
//         // }
//
//         const resultData = (props.data.value) ? props.data.value : '';
//         if (props.data.computed_value !== resultData) {
//             SET_COMPUTED_VALUE( {
//                 metricId: props.data.type_id,
//                 planedAt: props.data.planed_at,
//                 value: resultData
//             })
//
//         }
//
//     }
// }
//
//
// function getArrayParams(metricId, store) {
//     const {useStoreGetters} = store;
//     const {metricForId} = useStoreGetters();
//
//     let metric = metricForId(metricId);
//     let params = [];
//
//     if (!metric?.value || metric.value.formula === '' || metric.value.formula === undefined) { return false; }
//
//     let paramsObj = null;
//     if (metric.value.formula) {
//         paramsObj = metric.value.formula.match(/((\+|\*|\-|\/|\(|\)){1})|\$[0-9]+\$|[0-9]+(\.{1}[0-9]+)?/g) || false;
//     }
//
//     if (!paramsObj) {
//         return false;
//     }
//
//
//     for (let key in paramsObj) {
//         params.push(paramsObj[key]);
//     }
//     return params;
// }
//
//
// function generateResultOnFormulaInCell(cell, params, store) {
//     let resultValueString = '';
//     if (isTime(cell.value)) { return false; }
//
//     if (!params) { return cell.value;}
//     params.forEach ((param) => {
//         resultValueString += getFormulaCell(param, cell, store);
//     })
//     return evalValue(resultValueString);
// }
//
//
// function getFormulaCell(param, cell, store) {
//     const {useStoreGetters} = store;
//     const {allMetrics} = useStoreGetters();
//     const allMetricsArr = allMetrics.value;
//     try {
//         let result = '';
//         let isAlias = (param.search(/\$[0-9]+\$/) >= 0);
//
//         if (!isAlias) {
//             return  ` ${param} `;
//         }
//
//         let needleMetric = null;
//         const aliasId = param.match(/[0-9]+/)[0];
//
//         for ( let i = 0; i < allMetricsArr.length; i++) {
//             if (allMetricsArr[i].id === aliasId) {
//                 needleMetric = allMetricsArr[i];
//                 break;
//             }
//         }
//         if (! needleMetric ) { return false; }
//
//
//         if (Number(cell.type_id) === Number(needleMetric.id)) {
//             if (cell.value !== null && cell.value.toString().trim() !== '') {
//                 return ` ${evalValue(cell.value)} `;
//             }
//             return false;
//         }
//
//         const params = getArrayParams(needleMetric.id, store);
//         let currentNeedleCell = needleMetric.cells[cell.planed_at];
//
//         if (!params) {
//             if (currentNeedleCell.value !== null
//                 && currentNeedleCell.value !== ''
//                 && !isTime(currentNeedleCell.value)
//             ) {
//                 return ' ' +  evalValue(currentNeedleCell.value) + ' '
//             }
//             return false;
//         }
//
//         for (let i = 0; i < params.length; i++) {
//             result += getFormulaCell(params[i], currentNeedleCell, store);
//         }
//
//         if (result) {
//             return evalValue(result);
//         }
//         return ''
//     } catch (e) {
//         throw new Error(e.message);
//     }
// }
//
//
//
//
//
//
//
