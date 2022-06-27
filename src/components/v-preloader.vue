<template>
  <div
      id="preloader"
      :class="{'show': showPreloader}"
  >
    <div data-loader="spinner-circle"></div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "v-preloader",
  computed: {
    ...mapGetters(['showPreloader'])
  },

}
</script>

<style scoped>
/*Прелоадер начало*/

#preloader {
  display: none;
  width: 100px;
  height: 100px;
  position: fixed;
  top: 50%;
  left: 50%;
  background: white;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  z-index: 100;

  /*-webkit-transform: translate(-50%, -50%);*/
  /*-moz-transform: translate(-50%, -50%);*/
  /*-ms-transform: translate(-50%, -50%);*/
  /*-o-transform: translate(-50%, -50%);*/
  /*transform: translate(-50%, -50%);*/
}

.show {
  display: flex;
}

#preloader::before {
  content: "";
  width: 2500px;
  height: 2500px;
  background: #00000024;
  position: fixed;
  top: 0;
  left: 0;
}

[data-loader='spinner-circle'] {
  width: 25px;
  height: 25px;
  left: 50%;
  top: 50%;
  position: relative;
  transform: translate(-50%, -50%);

  animation: 1s infinite linear spinner-circle;

  border-radius: 50%;
  box-shadow: 30px 0 0 -6px #00a65a,
  0 30px 0 -6px #00a65a,
  -30px 0 0 -6px #00a65a,
  0 -30px 0 -6px #00a65a,
  21px 21px 0 -6px #00a65a,
  -21px 21px 0 -6px #00a65a,
  -21px -21px 0 -6px #00a65a,
  21px -21px 0 -6px #00a65a;
}

@-webkit-keyframes spinner-circle {
  12.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px rgba(255, 255, 255, 1),
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  25% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px rgba(255, 255, 255, 1);
  }
  37.5% {
    box-shadow: 30px 0 0 -6px rgba(255, 255, 255, 1),
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  50% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px rgba(255, 255, 255, 1),
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  62.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px rgba(255, 255, 255, 1),
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  75% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px rgba(255, 255, 255, 1),
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  87.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px rgba(255, 255, 255, 1),
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  100% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px rgba(255, 255, 255, 1),
    21px -21px 0 -6px #00a65a;
  }
}

@-moz-keyframes spinner-circle {
  12.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px rgba(255, 255, 255, 1),
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  25% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px rgba(255, 255, 255, 1);
  }
  37.5% {
    box-shadow: 30px 0 0 -6px rgba(255, 255, 255, 1),
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  50% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px rgba(255, 255, 255, 1),
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  62.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px rgba(255, 255, 255, 1),
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  75% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px rgba(255, 255, 255, 1),
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  87.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px rgba(255, 255, 255, 1),
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  100% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px rgba(255, 255, 255, 1),
    21px -21px 0 -6px #00a65a;
  }
}

@-o-keyframes spinner-circle {
  12.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px rgba(255, 255, 255, 1),
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  25% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px rgba(255, 255, 255, 1);
  }
  37.5% {
    box-shadow: 30px 0 0 -6px rgba(255, 255, 255, 1),
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  50% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px rgba(255, 255, 255, 1),
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  62.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px rgba(255, 255, 255, 1),
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  75% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px rgba(255, 255, 255, 1),
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  87.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px rgba(255, 255, 255, 1),
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  100% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px rgba(255, 255, 255, 1),
    21px -21px 0 -6px #00a65a;
  }
}

@keyframes spinner-circle {
  12.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px rgba(255, 255, 255, 1),
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  25% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px rgba(255, 255, 255, 1);
  }
  37.5% {
    box-shadow: 30px 0 0 -6px rgba(255, 255, 255, 1),
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  50% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px rgba(255, 255, 255, 1),
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  62.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px rgba(255, 255, 255, 1),
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  75% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px rgba(255, 255, 255, 1),
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  87.5% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px rgba(255, 255, 255, 1),
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px #00a65a,
    21px -21px 0 -6px #00a65a;
  }
  100% {
    box-shadow: 30px 0 0 -6px #00a65a,
    0 30px 0 -6px #00a65a,
    -30px 0 0 -6px #00a65a,
    0 -30px 0 -6px #00a65a,
    21px 21px 0 -6px #00a65a,
    -21px 21px 0 -6px #00a65a,
    -21px -21px 0 -6px rgba(255, 255, 255, 1),
    21px -21px 0 -6px #00a65a;
  }
}

/*Прелоадер конец*/

</style>