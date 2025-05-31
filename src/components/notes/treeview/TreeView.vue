<template>
  <!-- <div class="sort-container">
    <span class="sort-label">sort</span>
      <button @click="sortItems">
        <span v-if="sortOrder === 'asc'">↑</span>
        <span v-else>↓</span>
      </button>
  </div> -->

  <div class="search-container">
    <input type="text" placeholder="Search" />
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
  overflow-y: auto;
  max-height: 100%;
}

.sort-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.sort-container button {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.sort-container button:hover {
  background-color: #e0e0e0;
}
</style>