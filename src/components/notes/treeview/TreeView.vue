<template>
  <div class="sort-container">
    <span class="sort-label">sort</span>
      <button @click="sortItems">⌄</button>
  </div>
  <div class="tree-view">
    <TreeItem
      v-for="item in items"
      :key="item.name"
      :item="item"
      :depth="0"
    />
  </div>
</template>

<script>
import TreeItem from './TreeItem.vue'

export default {
  name: 'TreeView',
  components: {
    TreeItem
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style scoped>
.tree-view {
  font-family: Arial, sans-serif;
  padding: 10px;
}

.sort-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>