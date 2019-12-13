<template>
  <v-app>
    <g-app-wrapper>
      <div class="app-toolbar layout-row">
        <ul class="nav">
          <li>
            <router-link to="/home">Home</router-link>
          </li>
          <li>
            <router-link to="/about">About</router-link>
          </li>
          <li>
            <router-link to="/other">Other</router-link>
          </li>
        </ul>
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

<style lang="scss" scoped>
.nav {
  display: flex;
  width: 100%;
  li {
    padding: 10px;
  }
}
</style>
