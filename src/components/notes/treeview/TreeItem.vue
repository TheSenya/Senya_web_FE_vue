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

  <Modal v-if="modals.showEditModal" :visible="modals.showEditModal" @close="modals.showEditModal = false" :title="modals.editModalTitle">
    <div>
      <p>edit folder</p>
      <input type="text" v-model="newFolderName" :placeholder="item.name" />
      <div class="modal-button-container">
        <button @click="closeAllModals">Close</button>
        <button @click="editItem">Rename</button>
      </div>
    </div>
  </Modal>

  <!-- <Modal v-if="modals.showAddModal" :visible="modals.showAddModal" @close="modals.showAddModal = false" :title="modals.addModalTitle">
    <div>
      <p>add folder</p>
      <input type="text" v-model="newFolderName" placeholder="please enter a folder name" />
      <div class="modal-button-container">
        <button @click="closeAllModals">Close</button>
        <button @click="addItem">Add</button>
      </div>
    </div>
  </Modal> -->

  <Modal v-if="modals.showDeleteModal" :visible="modals.showDeleteModal" @close="modals.showDeleteModal = false" :title="modals.deleteModalTitle">
    <div>
      <p>are you sure you want to delete the folder <span class="folder-name">{{ item.name }}</span>?</p>
      <div class="modal-button-container">
        <button @click="closeAllModals">Close</button>
        <button @click="deleteItem">Delete</button>
      </div>
    </div>
  </Modal>

  <Modal v-if="modals.showAddModal" :visible="modals.showAddModal" @close="modals.showAddModal = false" :title="modals.addModalTitle">
    <div>
      <label for="itemType">Select Type:</label>
      <select id="itemType" v-model="selectedType">
        <option value="" disabled>Select an option</option>
        <option value="folder">Folder</option>
        <option value="file">File</option>
      </select>
    </div>

    <div v-if="selectedType === 'file'">
      <label for="fileType">File Type:</label>
      <select id="fileType" v-model="selectedFileType">
        <option value="" disabled>Select a file type</option>
        <option v-for="ft in fileTypes" :key="ft">{{ ft }}</option>
      </select>
      <input id="fileName" v-model="newFileName" placeholder="please enter a file name" />
    </div>

    <div v-if="selectedType === 'folder'">
      <label for="folderName">Folder Name:</label>
      <input id="folderName" v-model="newFolderName" placeholder="please enter a folder name" />
    </div>

    <button @click="createItem">Confirm</button>
  </Modal>
  
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useNoteFolderStore } from '@/stores/noteFolder'
import { useNoteStore } from '@/stores/note'
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
      newFileName: '',
      selectedType: '',
      selectedFileType: '',
      fileTypes: ['Markdown', 'Text', 'Docx'],

      modals: {
        showEditModal: false,
        editModalTitle: 'Edit Folder',
        showDeleteModal: false,
        deleteModalTitle: 'Delete Folder',
        showAddModal: false,
        addModalTitle: 'Add Folder/File',
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
      this.setSelectedNoteFolder(this.item.id)

    },
    deleteItem() {
      console.log('deleteItem', this.item)
      this.deleteNoteFolder(this.item.id)

      // close the modal
      this.modals.showDeleteModal = false
    },
    addItem() {
      this.selectedType = ''
      this.selectedFileType = ''
      this.showModal = true
    },
    createItem() {
      if (!this.selectedType) return
      if (this.selectedType === 'folder') {
        // e.g. logic to create a folder
        this.createNoteFolder(this.newFolderName, this.item.id)
      } else if (this.selectedType === 'file') {
        // e.g. logic to create a file with the chosen file type
        // this.createNoteFile('File Name', this.selectedFileType, this.item.id)
      }
      // Close modal afterwards
      this.showModal = false
    },
    closeModal() {
      this.showModal = false
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
  /* border: 2px solid #2196F3;
  border-radius: 4px; */
  box-shadow: inset 0 0 0 2px lightcoral;
  border-radius: 2px;
  transition: border 0.2s;
}
</style>