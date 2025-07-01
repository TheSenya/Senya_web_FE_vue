<template>
  <div class="tree-item">
    <div class="item-label" @mouseenter="toggleFolderButtons" @mouseleave="toggleFolderButtons" @click="toggle" :class="{ 'selected': isSelected }">
    <div class="item-label-container">
      <span v-if="isFolderSelected" class="caret" :class="{ 'caret-down': isExpanded }">▶</span>
      <span v-else class="file-icon">📄</span>
      {{ item.name }}
    </div>
    <div class="button-container" v-if="showFolderButtons">
      <Button v-if="depth > 0" icon="pi pi-trash" class="p-button-sm p-button-text p-button-danger" @click.stop="showDeleteModal" />
      <Button icon="pi pi-plus" class="p-button-sm p-button-text p-button-success" @click.stop="showAddModal" />
      <Button icon="pi pi-pencil" class="p-button-sm p-button-text p-button-info" @click.stop="showEditModal" />
    </div>
  </div>
  
  <div v-if="isFolderSelected && isExpanded" class="children">
    <TreeItem v-for="child in item.children" :key="child.name" :item="child" :depth="depth + 1"/>
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

import Modal from '@/common/Modal.vue'
import Button from 'primevue/button';

import { useTreeStore } from '@/stores/tree';
import { useNoteFolderStore } from '@/stores/noteFolder'
import { useNoteStore } from '@/stores/note'

export default {
  name: 'TreeItem',
  components: {
    Modal,
    Button
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
    ...mapState(useNoteStore, ['fileFormats', 'selectedNote']),
    ...mapState(useTreeStore, ['selectedTreeItem']),
    isFolderSelected() {
      return ((this.item.children && this.item.children.length) || (this.item.type == 'folder'))
    },
    isFileSelected() {
      return  this.item.type === 'file'
    },
    isSelected() {
      return this.item.id === this.selectedTreeItem?.id
    },
  },
  methods: {
    ...mapActions(useNoteFolderStore, ['createNoteFolder', 'deleteNoteFolder', 'setSelectedNoteFolder']),
    ...mapActions(useNoteStore, ['createNote', 'setSelectedNote']),
    ...mapActions(useTreeStore, ['setSelectedTreeItem']),
    toggle() {
      if (this.isFolderSelected) {
        this.isExpanded = !this.isExpanded
      }

      console.log('toggle', this.item)
      console.log('this.item.type', this.item.type)
      console.log('isFolderSelected', this.isFolderSelected)
      console.log('isFileSelected', this.isFileSelected)

      if (this.isFolderSelected) {
        console.log('setSelectedNoteFolder', this.item)
        this.setSelectedNoteFolder(this.item.id)
      }
      else  if(this.isFileSelected){
        console.log('setSelectedNote', this.item)
        this.setSelectedNote(this.item)
      }

      this.setSelectedTreeItem(this.item)
    },
    deleteItem() {
      console.log('deleteItem', this.item)
      console.log(this.item.id)
      console.log(JSON.stringify(this.noteFolders))
      this.deleteNoteFolder(this.item.id)

      // close the modal
      this.modals.showDeleteModal = false
    },
    addItem() {
      this.selectedType = ''
      this.selectedFileType = ''
      this.modals.showAddModal = true
    },
    createItem() {
      if (!this.selectedType) return
      if (this.selectedType === 'folder') {
        // e.g. logic to create a folder
        this.createNoteFolder(this.newFolderName, this.item.id)
      } else if (this.selectedType === 'file') {
        // e.g. logic to create a file with the chosen file type
        // this.createNoteFile('File Name', this.selectedFileType, this.item.id)
        this.createNote(this.newFileName, this.selectedFileType, this.item.id)
      }

      // Close modal afterwards
      this.modals.showAddModal = false
    },
    closeModal() {
      this.modals.showAddModal = false
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
  align-items: center;

  &:hover {
    background-color: #828282;
  }
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
  display: flex;
  align-items: center;
}

.button-container .p-button {
  margin-left: 4px;
}

/* Increase the size of icons within the action buttons */
.button-container .p-button{
  font-size: 0.7rem; /* Adjust as needed */
  height: 10px; 
  width: 10px;
}

/* Optional: Ensure icon colors from severity classes are prominent enough with p-button-text */
/* You might not need these if colors are already fine */
/*
.button-container .p-button.p-button-danger .p-icon {
  color: var(--p-button-danger-color, #dc3545); 
}
.button-container .p-button.p-button-success .p-icon {
  color: var(--p-button-success-color, #28a745);
}
.button-container .p-button.p-button-info .p-icon {
  color: var(--p-button-info-color, #17a2b8);
}
*/

.selected {
  box-shadow: inset 0 0 0 2px lightcoral;
  border-radius: 2px;
  transition: border 0.2s;
}
</style>