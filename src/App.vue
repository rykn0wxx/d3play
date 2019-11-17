<template>
  <RouterView class="app tw-antialiased" v-cloak />
</template>

<script>
export default {
  name: 'App',
  metaInfo() {
    return {
      title: 'Frontend by mudhead'
    }
  }
}
</script>

<style src="./assets/css/tailwind.css"></style>
