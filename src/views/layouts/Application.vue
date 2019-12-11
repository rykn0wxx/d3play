<template>
  <v-app>
    <g-app-wrapper>
      <div class="app-toolbar layout-row">
        toolbar here
      </div>
      <g-app-content>
        <div class="layout-column flex">
          <RouterView class="app-view" />
        </div>
      </g-app-content>
    </g-app-wrapper>
  </v-app>
</template>

<script>
export default {
  name: 'LayoutsApplication'
}
</script>

<style lang="scss" scoped></style>
