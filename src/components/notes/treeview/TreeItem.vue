<template>
  <div class="tree-item">
    <div class="item-label" @mouseenter="toggleFolderButtons" @mouseleave="toggleFolderButtons"
      :style="{ paddingLeft: `${depth * 20 + 5}px` }" @click="toggle" :class="{ 'selected': isSelected }">
    <div class="item-label-container">
      <span v-if="isFolder" class="caret" :class="{ 'caret-down': isExpanded }">▶</span>
      <span v-else class="file-icon">📄</span>
      {{ item.name }}
    </div>
    <div class="button-container" v-if="showFolderButtons">
      <span v-show="depth > 0" class="delete-button" @click="showDeleteModal">X</span>
      <span class="add-button" @click="showAddModal">+</span>
      <span class="edit-button" @click="showEditModal">⛭</span>
    </div>
  </div>
  
  <div v-if="isFolder && isExpanded" class="children">
    <TreeItem v-for="child in item.children" :key="child.name" :item="child" :depth="depth + 1" />
  </div>
    
  </div>

  <Modal v-if="modals.showEditModal" :visible="modals.showEditModal" @close="closeAllModals" :title="modals.editModalTitle">
    <div>
      <p>edit folder</p>
      <input type="text" v-model="newFolderName" :placeholder="item.name" />
      <div class="modal-button-container">
        <button @click="closeAllModals">Close</button>
        <button @click="editItem">Rename</button>
      </div>
    </div>
  </Modal>

  <Modal v-if="modals.showAddModal" :visible="modals.showAddModal" @close="closeAllModals" :title="modals.addModalTitle">
    <div>
      <p>add folder</p>
      <input type="text" v-model="newFolderName" placeholder="please enter a folder name" />
      <div class="modal-button-container">
        <button @click="closeAllModals">Close</button>
        <button @click="addItem">Add</button>
      </div>
    </div>
  </Modal>

  <Modal v-if="modals.showDeleteModal" :visible="modals.showDeleteModal" @close="closeAllModals" :title="modals.deleteModalTitle">
    <div>
      <p>are you sure you want to delete the folder <span class="folder-name">{{ item.name }}</span>?</p>
      <div class="modal-button-container">
        <button @click="closeAllModals">Close</button>
        <button @click="deleteItem">Delete</button>
      </div>
    </div>
  </Modal>
  
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useNoteFolderStore } from '@/stores/note'
import Modal from '@/common/Modal.vue'

export default {
  name: 'TreeItem',
  components: {
    Modal
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isExpanded: false,
      showFolderButtons: false,
      newFolderName: '',

      modals: {
        showEditModal: false,
        editModalTitle: 'Edit Folder',
        showDeleteModal: false,
        deleteModalTitle: 'Delete Folder',
        showAddModal: false,
        addModalTitle: 'Add Folder',
      }
    }
  },
  computed: {
    ...mapState(useNoteFolderStore, ['noteFolders', 'selectedNoteFolder']),
    isFolder() {
      return ((this.item.children && this.item.children.length) || (this.item.type == 'folder'))
    },
    isSelected() {
      console.log('isSelected', this.item.id, this.selectedNoteFolder)

      return this.item.id === this.selectedNoteFolder
    },
  },
  methods: {
    ...mapActions(useNoteFolderStore, ['createNoteFolder', 'deleteNoteFolder', 'setSelectedNoteFolder']),
    toggle() {
      if (this.isFolder) {
        this.isExpanded = !this.isExpanded
      }
      if (this.item.id === this.selectedNoteFolder) {
        this.setSelectedNoteFolder(null)
      } else {
        this.setSelectedNoteFolder(this.item.id)
      }
    },
    deleteItem() {
      console.log('deleteItem', this.item)
      this.deleteNoteFolder(this.item.id)

      // close the modal
      this.modals.showDeleteModal = false
    },
    addItem() {
      console.log('addItem', this.item, this.item.id)
      this.createNoteFolder(this.newFolderName, this.item.id)

      // close the modal and reset the input
      this.modals.showAddModal = false
      this.newFolderName = ''
    },
    editItem(){
      console.log('editItem', this.item)

      // close the modal and reset the input
      this.modals.showEditModal = false
      this.newFolderName = ''
    },
    toggleFolderButtons() {
      this.showFolderButtons = !this.showFolderButtons
    },
    showAddModal() {
      this.modals.showAddModal = true
    },
    showDeleteModal() {
      this.modals.showDeleteModal = true
    },
    showEditModal() {
      this.modals.showEditModal = true
    },
  }
}
</script>

<style scoped>
.tree-item {
  text-align: left;
  cursor: pointer;
  user-select: none;

}

.item-label {
  padding: 5px 0;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
}

.item-label:hover {
  background-color: #f0f0f0;
}

.caret {
  margin-right: 5px;
  transition: transform 0.2s;
  display: inline-block;
}

.caret-down {
  transform: rotate(90deg);
}

.file-icon {
  margin-right: 5px;
}

.children {
  margin-left: 10px;
}

.button-container {

  .delete-button {
    margin-right: 5px;
  }

  .add-button {
    margin-left: 5px;
  }
}

.selected {
  border: 2px solid #2196F3;
  border-radius: 4px;
  transition: border 0.2s;
}
</style>