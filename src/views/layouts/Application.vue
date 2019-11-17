<template>
  <div class="layouts-application flex layout-row tw-flex tw-max-w-full tw-max-h-full tw-overflow-hidden">
    <div dark class="layouts-app tw-w-full">
      <g-app-content contentClass="tw-h-full img-placeholder" wrapClass="tw-overflow-auto">
        <GAppView class="tw-flex-noshrink view-wrapper tw-relative tw-block tw-h-full" />
      </g-app-content>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutsApplication'
}
</script>

<style lang="scss" scoped></style>
