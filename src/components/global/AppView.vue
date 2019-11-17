<template>
  <div class="app-view" :class="{ 'tw-overflow-hidden': inTrans }">
    <transition :name="direction" @before-enter="transStarted" @after-leave="transCompleted" @after-appear="transCompleted" appear>
      <RouterView :class="{ 'tw-overflow-hidden': inTrans }" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppView',
  data() {
    return {
      direction: 'zoom-in',
      currentIndex: null,
      inTrans: false
    }
  },
  created() {
    this.currentIndex = this.$route.meta.pathIndex
  },
  watch: {
    $route: {
      handler: 'routeHandler',
      immediate: true
    }
  },
  methods: {
    transStarted() {
      this.inTrans = true
    },
    transCompleted() {
      this.inTrans = false
    },
    routeHandler(newVal, oldVal) {
      if (this.currentIndex) {
        this.direction = this.currentIndex > newVal.meta.pathIndex ? 'slide-left' : 'slide-right'
      }
      this.currentIndex = newVal.meta.pathIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-left,
.slide-right,
.zoom-in {
  &-enter-active,
  &-leave-active {
    transition-property: opacity, transform, visibility;
    transition-timing-function: ease-in-out;
  }
  &-enter-active {
    transition-duration: 1s;
  }
  &-leave-active {
    position: absolute !important;
    min-width: 100%;
    transition-duration: 1.5s;
  }
}
.slide-left {
  &-enter {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
  &-enter-to {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }
  &-leave {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }
  &-leave-to {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(-100%, 0, 0);
  }
}
.slide-right {
  &-enter {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(-100%, 0, 0);
  }
  &-enter-to {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }
  &-leave {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }
  &-leave-to {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}
.zoom-in {
  &-enter {
    opacity: 0;
    visibility: hidden;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  &-enter-to {
    opacity: 1;
    visibility: visible;
    transform: scale3d(1, 1, 1);
  }
}
</style>
