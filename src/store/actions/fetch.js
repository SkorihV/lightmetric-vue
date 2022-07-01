import axios from "axios";

export default {

  /**
   *
   * @param commit
   * @param state
   * @param searchUrl
   * @returns {Promise<T>}
   * @constructor
   */
    async FETCH_DATA_METRIC({commit, state}, searchUrl = '') {
      let search = '';
      if (searchUrl) {
        search = searchUrl;
      } else {
        search = window.location.search;
      }
        if(state.isLocal) {
            return await axios.get(`http://localhost:3000/data${search}`)
                .then((data) => {
                    commit('SET_DATA_METRIC', data.data);
                }).then(() => {
                    commit('PROCESSING_HIDE_SHOW_METRIC_FOR_LOCAL');
                })
        } else {
            return await axios.get(`${state.urlsForFetch[state.lightmetricType].dataList}${search}`)
                .then((data) => {
                    commit('SET_DATA_METRIC', data.data);
                }).then(() => {
                    commit('PROCESSING_HIDE_SHOW_METRIC_FOR_LOCAL');
                })
        }
    },

  /**
   *
   * @param commit
   * @param state
   * @param metricGroupId
   * @returns {boolean|Promise<T | void>}
   * @constructor
   */
    UPDATE_POSITION_FOR_METRIC_GROUP({commit, state}, metricGroupId) {
        if (state.isLocal) {return false;}

        let listIds = '';

        for (let key in state.metricsGroups) {
           if (key === metricGroupId.toString()) {
               const group = state.metricsGroups[key];
               group.forEach((metric,index, arr) => {
                   if(index === arr.length - 1) {
                       listIds += `${metric.id}`
                   } else {
                       listIds += `${metric.id},`

                   }
               })
           }
        }

        if (listIds.length === 0 ) {
            return false;
        }

        return axios.put(`${state.urlsForFetch[state.lightmetricType].updatePosition}?metric_id_str=${listIds}`)
            .then(response => {
                if (response) {
                    console.log('Ok');
                }
            })
            .catch((err) => console.error(err));
    },

  /**
   *
   * @param commit
   * @param state
   * @param metricID
   * @constructor
   */
    FETCH_METRIC_FORM({commit, state}, metricID = '') {
        let search = '';

        if(metricID) {
            search = `?metric_id=${metricID}`;
        }
        if (state.isLocal) {

            axios.get(`http://localhost:3000/data${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL',response.data.form_type);
                    commit('VISIBILITY_MODAL', true);
                })
        } else {
            axios.get(`${state.urlsForFetch[state.lightmetricType].metricForm}${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data);
                    commit('VISIBILITY_MODAL', true);
                })
        }
    },

  /**
   *
   * @param commit
   * @param state
   * @param planedAt
   * @param categoryId
   * @returns {boolean}
   * @constructor
   */
    FETCH_WEEK_FORM({commit, state}, {planedAt, categoryId}) {
        if (!planedAt || !categoryId) {
            return false;
        }
        const search = `?planed_at=${planedAt}&category_id=${categoryId}`;

        if (state.isLocal) {
            axios.get(`http://localhost:3000/data${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data.form_week);
                    commit('VISIBILITY_MODAL', true);
                })

        } else {
            axios.get(`${state.urlsForFetch[state.lightmetricType].weekForm}${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data);
                    commit('VISIBILITY_MODAL', true);
                })
        }
    },

  /**
   *
   * @param commit
   * @param state
   * @param metricId
   * @param planedAt
   * @returns {boolean}
   * @constructor
   */
    FETCH_CELL_FORM_CONTEXT({commit, state}, {metricId, planedAt}) {
        if (!metricId || !planedAt) {
            return false;
        }

        const search = `?planed_at=${planedAt}&metric_id=${metricId}`;

        if (state.isLocal) {
            axios.get(`http://localhost:3000/data${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data.form_cell);
                    commit('VISIBILITY_MODAL', true);
                })

        } else {
            axios.get(`${state.urlsForFetch[state.lightmetricType].cellForm}${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data);
                    commit('VISIBILITY_MODAL', true);
                })
        }
    },

  /**
   * Отправить данные на сервер из input'а ячейки
   * @param commit
   * @param state
   * @param dispatch
   * @param metricId
   * @param planedAt
   * @param newValue
   * @returns {boolean}
   * @constructor
   */
  FETCH_CELL_FORM_VALUE({commit, state, dispatch}, {metricId, planedAt, newValue}) {
    if (!metricId || !planedAt) {
      return false;
    }

    const search = `?planed_at=${planedAt}&metric_id=${metricId}`;

    if (state.isLocal) {
      axios.get(`http://localhost:3000/data${search}`)
          .then(response => {
            commit('PUT_HTML_FOR_MODAL', response.data.form_cell);
          })

    } else {
      axios.get(`${state.urlsForFetch[state.lightmetricType].cellForm}${search}`)
          .then(response => {
            commit('PUT_HTML_FOR_MODAL', response.data);
          })
          .then(() => {
            let valueInput = null;
            if (this.state.lightmetricType === 'week') {
              valueInput = document.querySelector('#week_cell_form_value');
            } else if (this.state.lightmetricType === 'month') {
              valueInput = document.querySelector( '#week_cell_month_form_value');
            }
            if (valueInput) {
              valueInput.value = newValue;
              return true;
            }
          })
          .then(() => {
            dispatch('TOGGLE_IS_SUBMITING');
          })
    }
  },

  /**
   * Отправить данные на сервер с новой формулой метрики
   * @param commit
   * @param state
   * @param dispatch
   * @param formData
   * @param metricId
   * @returns {Promise<void>}
   * @constructor
   */
   async SAVING_FORMULA_FOR_METRIC({commit, state, dispatch}, {formData, metricId}){
        dispatch('INIT_PROCESSING_FORMULA_FOR_CELL', false);
        const request = `${state.urlsForFetch[state.lightmetricType].savingMetricFormula}?id=${metricId}`

       const requestData = await fetch(request, {
           method: 'POST',
           body: formData
        })
    setTimeout(() => {
      dispatch('INIT_PROCESSING_FORMULA_FOR_CELL', true);
      }, 500)
    },

  /**
   *
   * @param dispatch
   * @param data
   * @constructor
   */
    async SUBMIT_FORM({dispatch}, data) {
        if (data.dataForSubmit?.formType === 'metric') {
            await dispatch('SUBMIT_FORM_METRIC', data)
        } else if (data.dataForSubmit?.formType === 'cell') {
           await dispatch('SUBMIT_FORM_CELL', data)
        } else if (data.dataForSubmit?.formType === 'week') {
            await dispatch('SUBMIT_FORM_WEEK', data)
        }
    },

  /**
   *
   * @param commit
   * @param dispatch
   * @param state
   * @param formData
   * @param dataForSubmit
   * @returns {Promise<T|void>}
   * @constructor
   */
    async SUBMIT_FORM_METRIC({commit, dispatch, state}, {formData, dataForSubmit}) {
    dispatch('INIT_PROCESSING_FORMULA_FOR_CELL', false);
    const metricId = dataForSubmit.metricId;
        let responseUrl = `${state.urlsForFetch[state.lightmetricType].metricForm}`

        if (metricId) {
            responseUrl += `?metric_id=${metricId}`;
        }
        return await fetch(responseUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            dispatch('RESET_MODAL');
            return data;
        })
        .then(data => {
            if(metricId) {
                commit('REPLACE_METRIC_DATA', data)
            } else {
                commit('CREATE_NEW_METRIC', data);
            }
        return data.data;
        })
        .then(() => {
            setTimeout(() => {
                // dispatch('INIT_PROCESSING_FORMULA_FOR_CELL', true);
                commit('PROCESSING_HIDE_SHOW_METRIC_FOR_LOCAL');
            }, 500)
        })
        .catch((err) => console.error(err));
  },

  /**
   *
   * @param commit
   * @param dispatch
   * @param state
   * @param formData
   * @param dataForSubmit
   * @returns {Promise<void>}
   * @constructor
   */
    async SUBMIT_FORM_WEEK({commit, dispatch, state}, {formData, dataForSubmit}) {
        const categoryId    = dataForSubmit.categoryId;
        const planet_at     = dataForSubmit.planed_at;
        const responseUrl   = `${state.urlsForFetch[state.lightmetricType].weekForm}?planed_at=${planet_at}&category_id=${categoryId}`;

        const response = await fetch(responseUrl, {
            method: 'POST',
            body: formData
        })

        const data = await response.json()
        await dispatch('RESET_MODAL');
        await commit('REPLACE_WEEK_DATA', data.data);
    },

  /**
   *
   * @param commit
   * @param dispatch
   * @param state
   * @param formData
   * @param dataForSubmit
   * @returns {Promise<void>}
   * @constructor
   */
    async SUBMIT_FORM_CELL({commit, dispatch, state}, {formData, dataForSubmit}) {
        dispatch('INIT_PROCESSING_FORMULA_FOR_CELL', false);
        const metricId = dataForSubmit.metricId;
        const planet_at = dataForSubmit.planed_at;
        const responseUrl = `${state.urlsForFetch[state.lightmetricType].cellForm}?planed_at=${planet_at}&metric_id=${metricId}`;
        const response = await fetch(responseUrl, {
            method: 'POST',
            body: formData,
        })
    const json = await response.json();
    await dispatch('RESET_MODAL');
    await commit('REPLACE_CELL_DATA', json)
    setTimeout(() => {
      dispatch('INIT_PROCESSING_FORMULA_FOR_CELL', true);
    }, 500)
    },

  /**
   *
   * @param dispatch
   * @param dataUrl
   * @param dataType
   * @constructor
   */
    DELETE_DATA({dispatch}, {dataUrl, dataType}) {
      if (dataType.formType === 'metric') {
          dispatch('DELETE_FORM_METRIC', dataUrl)
      } else if (dataType.formType === 'cell') {
          dispatch('DELETE_FORM_CELL', dataUrl)
      } else if (dataType.formType === 'week') {
          dispatch('DELETE_FORM_WEEK', dataUrl)
      }
    },

  /**
   *
   * @param commit
   * @param dispatch
   * @param dataUrl
   * @returns {Promise<void>}
   * @constructor
   */
    async DELETE_FORM_METRIC({commit, dispatch}, dataUrl) {
        await fetch(dataUrl)
            .then(response => response.json())
            .then(data => {
                dispatch('RESET_MODAL');
                if (data.status === 200) {
                    const metricId = dataUrl.split('/').reverse()[0];
                    commit('DELETE_METRIC', metricId)
                }
            })
    },

  /**
   *
   * @param commit
   * @param dispatch
   * @param dataUrl
   * @returns {Promise<void>}
   * @constructor
   */
    async DELETE_FORM_WEEK({commit, dispatch}, dataUrl) {
      await fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            dispatch('RESET_MODAL');
            if (data.status === 200) {
                const weekId = dataUrl.split('/').reverse()[0];
                commit('DELETE_WEEK', weekId);
            }
        })
    },

  /**
   *
   * @param commit
   * @param htmlForm
   * @constructor
   */
    DELETE_COMMENT_FOR_CELL({commit}, htmlForm) {
      htmlForm.querySelector('#week_cell_form_comment').value = '';
      htmlForm.querySelector('#week_cell_form_submit').click();
    },

  /**
   *
   * @param state
   * @param computedValues
   * @returns {Promise<boolean>}
   * @constructor
   */
  async UPDATED_COMPUTED_VALUES({state}, computedValues) {

    if( state.isLocal || !computedValues) {
      console.error('Отправка данных по обновлению ComputedValues не состоялась. Содержимое массива: ' + computedValues)
      return false;
    }

    await fetch(state.urlsForFetch[state.lightmetricType].updatingComputedValues, {
      method: 'POST',
      body: JSON.stringify(computedValues),
      headers: {
        'Content-Type': 'application/json'
      }
    })

  },

  GET_AVERAGE_DATA({state, getters, commit}) {
    let url = state.urlsForFetch[state.lightmetricType].AllAverageValuesForCategory + '?';

    getters.getCategoriesListIds.forEach(id => {
      url = `${url}categoryId[]=${id}&`;
    });

    if (state.isLocal) {
      axios.get(`http://localhost:3000/data`)
          .then((data) => {
            commit('ADD_AVERAGE_DATA', data.data);
          })
    } else {
      fetch(url)
          .then(response => response.json())
          .then(data => {
            commit('ADD_AVERAGE_DATA', data);
          })
    }

  }
}