<template>
    <div class="comment-box">
      <div class="comment-box__data">
        <i class="far fa-user"></i>
        <div class="comment-box__name">
          {{dataForComment.userName}}
        </div>
        <i class="far fa-clock"></i>
        <div class="comment-box__time">
          {{dataForComment.dateTime}}
        </div>
      </div>
      <div class="comment-box__text" v-html="processedCommentText"></div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "v-comment-element",
  methods: {
    ...mapActions([''])
  },
  computed: {
    ...mapGetters(['dataForComment']),
    processedCommentText() {
      let processedText = this.dataForComment.commentText.split(/\n| /);
      processedText = processedText.map(item => {
          if(item.includes("http")) {
            item = `<a href="${item}" target="_blank">ССЫЛКА</a>`
          }
        return item;
        })
          .join(" ");
      return processedText;
    }
  },
}
</script>

<style lang="scss">
.comment-box {
  z-index: 20;
  padding: 10px;
  background: #367FA9;
  min-width: 300px;
  flex-direction: column;
  color: white;
  cursor: auto;
  max-width: 600px;

  &__data {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dotted white;
    margin-bottom: 4px;
  }
  &__name,
  &__time {
    font-size: 14px;
    flex: 1 1 auto;
    margin-left: 2px;
  }
  &__text {
    white-space: break-spaces;
    word-break: break-word;

    a {
      color: #93c47d;
    }
  }
}
</style>