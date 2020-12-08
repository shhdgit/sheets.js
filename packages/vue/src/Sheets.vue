<template>
  <div ref="sheetsRef"></div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

import { Sheets } from '@sheets/core';
import '@sheets/core/src/sheets.scss';

export default {
  name: 'Sheets',
  setup() {
    const sheetsRef = ref<Element>(null as any);
    let sheets: Sheets;

    onMounted(() => {
      sheets = new Sheets(sheetsRef.value);
      console.log(sheets);
      sheets.render();
      sheets.patchValue([[0, 2, 5], [1, 3, 4]]);
      console.log(sheets.getValue())
      // sheets.removeRow(0)
    })
    onUnmounted(() => {
      sheets.dispose();
    })

    return { sheetsRef };
  },
}
</script>
