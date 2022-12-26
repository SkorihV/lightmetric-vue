<template>
  <div class="table__comment-trigger"><i class="fas fa-comment"></i></div>
</template>

<script>
export default {
  name: "v-comment-trigger",
  props: {
    dataComment: {
      type: [String, Object],
      required: true
    }
  }
}
</script>

<style lang="scss">
.table {
  &__comment-trigger {
    cursor: pointer;
    width: 10px;
    height: 10px;
    position: absolute;
    right: 0;
    top: -3px;
    color: white;
    text-shadow: 0 0 1px black;
    i {
      font-size: 10px;
    }
  }
}
</style>