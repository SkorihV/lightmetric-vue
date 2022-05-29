import axios from "axios";

export default {
    async FETCH_DATA_METRIC({commit, state}) {
        let search = '';
        search = window.location.search;
        if(state.isLocal) {
            return await axios.get(`http://localhost:3000/data${search}`)
                .then((data) => {
                    commit('SET_DATA_METRIC', data.data);
                }).then(() => {
                    commit('PROCESSING_HIDE_SHOW_METRIC_FOR_LOCAL');
                })
        } else {
            return await axios.get(`/lightmetric_vue/json_list${search}`)
                .then((data) => {
                    commit('SET_DATA_METRIC', data.data);
                }).then(() => {
                    commit('PROCESSING_HIDE_SHOW_METRIC_FOR_LOCAL');
                })
        }
    },
    UPDATE_POSITION_FOR_METRIC_GROUP({commit, state}, metricGroupId) {
        if (state.isLocal) {return false;}
        let request = '/lightmetric_vue/type/updatePositionMetrics';
        let listIds = '';
        for (let key in state.metricsGroups) {
           if (key === metricGroupId) {
               let group = state.metricsGroups[key];
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

        return axios.put(`${request}?metric_id_str=${listIds}`)
            .then(response => {
                if (response) {
                    console.log('Ok');
                }
            })
            .catch((err) => console.error(err));
    },
    FETCH_METRIC_FORM({commit, state}, metricID = '') {
        let search = '';
        let request = '/lightmetric_vue/type/form'
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
            axios.get(`${request}${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data);
                    commit('VISIBILITY_MODAL', true);
                })
        }
    },
    FETCH_WEEK_FORM({commit, state}, {planedAt, categoryId}) {
        if (!planedAt || !categoryId) {
            return false;
        }

        let request = '/lightmetric_vue/week/form'
        let search = `?planed_at=${planedAt}&category_id=${categoryId}`;

        if (state.isLocal) {
            axios.get(`http://localhost:3000/data${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data.form_week);
                    commit('VISIBILITY_MODAL', true);
                })

        } else {
            axios.get(`${request}${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data);
                    commit('VISIBILITY_MODAL', true);
                })
        }
    },
    FETCH_CELL_FORM({commit, state}, {metricId, planedAt}) {
        if (!metricId || !planedAt) {
            return false;
        }

        let request = '/lightmetric_vue/weekcell/form'
        let search = `?planed_at=${planedAt}&metric_id=${metricId}`;

        if (state.isLocal) {
            axios.get(`http://localhost:3000/data${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data.form_cell);
                    commit('VISIBILITY_MODAL', true);
                })

        } else {
            axios.get(`${request}${search}`)
                .then(response => {
                    commit('PUT_HTML_FOR_MODAL', response.data);
                    commit('VISIBILITY_MODAL', true);
                })
        }
    },
   async SAVING_FORMULA_FOR_METRIC({commit}, {formData, metricId}){
        let request = `/lightmetric_vue/typeformulaAdd?id=${metricId}`

       await fetch(request, {
           method: 'POST',
           body: formData
        })
       .then(response => {
           console.log(response.status)
       })

    },

    SUBMIT_FORM({dispatch}, data) {
        if (data.dataForSubmit.formType === 'metric') {
            dispatch('SUBMIT_FORM_METRIC', data)
        } else if (data.dataForSubmit.formType === 'cell') {
            dispatch('SUBMIT_FORM_CELL', data)
        } else if (data.dataForSubmit.formType === 'week') {
            dispatch('SUBMIT_FORM_WEEK', data)
        }
    },


    async SUBMIT_FORM_METRIC({commit, dispatch}, {formData, dataForSubmit}) {
        let metricId = dataForSubmit.metricId;
        let responseUrl = `/lightmetric_vue/type/form`

        if (metricId) {
            responseUrl += `?metric_id=${metricId}`;
        }
        // let response не используется, значит не обязательно заводить переменную
        let response = await fetch(responseUrl, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                dispatch('RESET_MODAL');
                return data.data;
            })
            .then(data => {
                if(metricId) {
                    commit('REPLACE_METRIC_DATA', data)
                } else {
                    commit('CREATE_NEW_METRIC', data)
                }
                return data;
            })
            .then((data) => {
                setTimeout(() => {
                    dispatch('UPDATE_POSITION_FOR_METRIC_GROUP', data.typeCategory.id);
                    commit('PROCESSING_HIDE_SHOW_METRIC_FOR_LOCAL');
                }, 200)
            })
            .catch((err) => console.error(err));
    },

    async SUBMIT_FORM_WEEK({commit, dispatch}, {formData, dataForSubmit}) {
        let categoryId = dataForSubmit.categoryId;
        let planet_at = dataForSubmit.planed_at
        let responseUrl = `/lightmetric_vue/week/form?planed_at=${planet_at}&category_id=${categoryId}`
        let response = await fetch(responseUrl, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                dispatch('RESET_MODAL');
                return data.data;
            })
            .then(data => {
                commit('REPLACE_WEEK_DATA', data);
            })
            .catch((err) => console.error(err));

    },
    async SUBMIT_FORM_CELL({commit, dispatch}, {formData, dataForSubmit}) {
        let metricId = dataForSubmit.metricId;
        let planet_at = dataForSubmit.planed_at
        let responseUrl = `/lightmetric_vue/weekcell/form?metric_id=${metricId}&planed_at=${planet_at}`
        let response = await fetch(responseUrl, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                dispatch('RESET_MODAL');
                return data;
            })
            .then(data => {
                commit('REPLACE_CELL_DATA', data)
            })
            .then(() => {
                commit('PROCESSING_HIDE_SHOW_METRIC_FOR_LOCAL');
            })
            .catch((err) => console.error(err));
    },

    DELETE_DATA({dispatch}, {dataUrl, dataType}) {
        if (dataType.formType === 'metric') {
            dispatch('DELETE_FORM_METRIC', dataUrl)
        } else if (dataType.formType === 'cell') {
            dispatch('DELETE_FORM_CELL', dataUrl)
        } else if (dataType.formType === 'week') {
            dispatch('DELETE_FORM_WEEK', dataUrl)
        }
    },

    async DELETE_FORM_METRIC({commit, dispatch}, dataUrl) {
        await fetch(dataUrl)
            .then(response => response.json())
            .then(data => {
                dispatch('RESET_MODAL');
                if (data.status === 200) {
                    let metricId = dataUrl.split('/').reverse()[0];
                    commit('DELETE_METRIC', metricId)
                }
            })
    },

    async DELETE_FORM_CELL({commit}, dataUrl) {

    },

    async DELETE_FORM_WEEK({commit, dispatch}, dataUrl) {
        await fetch(dataUrl)
            .then(response => response.json())
            .then(data => {
                dispatch('RESET_MODAL');
                if (data.status === 200) {
                    let weekId = dataUrl.split('/').reverse()[0];
                    commit('DELETE_WEEK', weekId);
                }
            })
    },

    DELETE_COMMENT_FOR_CELL({commit}, htmlForm) {
        htmlForm.querySelector('#week_cell_form_comment').value = '';
        htmlForm.querySelector('#week_cell_form_submit').click();
    }

}