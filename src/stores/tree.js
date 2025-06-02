import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useTreeStore = defineStore('tree', () => {
    const selectedTreeItem = ref(null)

    const setSelectedTreeItem = (item) => {
        selectedTreeItem.value = item
    }

    return { selectedTreeItem, setSelectedTreeItem }
})