<template>
    <th
        @contextmenu.prevent="getWeekForm"
        :class="classes">
      {{title}}
      <v-comment-trigger
          v-if="isDataCell"
          :dataComment="data"
          @click="handlerClickComment"
        >
      </v-comment-trigger>
    </th>
</template>

<script>
import vCommentTrigger from './v-comment-trigger'
import {mapActions} from "vuex";

export default {
  name: "v-th",
  components: {
    vCommentTrigger
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: ''
    },
    categoryId: {
      type: [String, Number, null],
      default: null
    },
    planedAt: {
      type: [String, null],
      default: null
    },
    classes: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDataCell: false
    }
  },
  mounted() {
    if (this.data !== null) {
      this.isDataCell = true;
    }
  },
  methods: {
    ...mapActions([
      'FETCH_WEEK_FORM',
      'RESET_MODAL',
      'SET_DATA_FOR_COMMENT',
      'SET_DATA_FOR_SUBMIT_FORM'
    ]),
    getWeekForm() {
      if(this.planedAt !== null && this.categoryId !== null) {
        this.RESET_MODAL()
            .then(()=> {
              this.FETCH_WEEK_FORM({planedAt: this.planedAt, categoryId:this.categoryId})
            })
            .then(() => {
              this.SET_DATA_FOR_SUBMIT_FORM({formType:'week', categoryId: this.categoryId, planed_at:this.planedAt})
            })
      }
    },
    handlerClickComment() {
      this.SET_DATA_FOR_COMMENT({userName: this.data.comment.userName, commentText: this.data.comment.comment, dateTime: this.data.updated_at});
    },
  },
  watch: {
    data() {
      this.isDataCell = this.data !== null;
    }
  },
}
</script>

<style lang="scss">
.table {
  &__th {
    white-space: nowrap;
    padding: 3px;
    background: #367FA9;
    color: white;
    font-weight: 800;
    border-right: 1px dotted white;
    position: relative;
    text-align: center;
    &_main {
      background: #276285;
    }
  }
  &__title-name {
    &_hashtag {
      position: -webkit-sticky;
      position: sticky;
      left: 0;
      z-index: 5;
      width: 50px;
    }
    &_metric {
      position: -webkit-sticky;
      position: sticky;
      left: 50px;
      z-index: 10;
      width: 303px;
      display: flex;
      padding-left: 3px;
    }
    &_minimal {
      position: -webkit-sticky;
      position: sticky;
      left: 353px;
      z-index: 15;
      min-width: 90px;
      width: 90px;
      text-align: center;
    }
    &_normal {
      position: sticky;
      left: 443px;
      z-index: 20;
      min-width: 90px;
      width: 90px;
      text-align: center;
    }

  }
}
</style>