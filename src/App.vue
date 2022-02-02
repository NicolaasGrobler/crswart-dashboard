<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      
    }
  }
};
</script>

<style lang="scss">
$scroll-background: #f5f5f5;
$primary: #b89c6a;

html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* Works on Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: $primary $scroll-background;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: $scroll-background;
}

*::-webkit-scrollbar-thumb {
  background-color: $primary;
  border-radius: 20px;
  border: 3px solid $scroll-background;
}
</style>

