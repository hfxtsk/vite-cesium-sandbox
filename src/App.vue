<template>
  <Viewer>
    <component :is="currentComp" v-if="currentComp"></component>
  </Viewer>
</template>

<script setup lang="ts">
import { onMounted, ref, defineAsyncComponent, DefineComponent } from 'vue';
import Viewer from './components/Viewer.vue';
import ErrorComp from './components/ErrorComp.vue';

const currentComp = ref<DefineComponent>();

onMounted(() => {
  console.log('compName', window.location.hash);
  const compName = window.location.hash.substring(1);
  if (compName) {
    currentComp.value = defineAsyncComponent({
      loader: () => import(`./components/${compName}.vue`),
      errorComponent: ErrorComp
    });
  }
});
</script>
<style scoped></style>
