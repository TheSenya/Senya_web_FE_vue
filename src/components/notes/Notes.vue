<template>
    <Toolbar class="mb-4">
        <template #start>
            <InputText v-model="noteName" type="text" :placeholder="noteName || 'Note Name'" @input="handleNameChange" class="p-inputtext-lg" />
        </template>

        <template #end>
            <Button label="Save" icon="pi pi-save" class="p-button-success mr-2" @click="saveNote" />
            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="deleteNote" />
        </template>
    </Toolbar>
    <div class="editor-container">
        <TextEditor v-model:content="noteContent" @update:content="onContentChange"></TextEditor>
    </div>
</template>

<script>
import TextEditor from '@/common/TextEditor.vue';
import { useAuthStore } from '@/stores/auth';
import { mapState, mapActions } from 'pinia';
import { useNoteFolderStore } from '@/stores/noteFolder';
import { useNoteStore } from '@/stores/note';
import { useTreeStore } from '@/stores/tree';

import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
    name: 'Notes',
    components: {
        TextEditor,
        Toolbar,
        InputText,
        Button
    },

    data() {
        return {
            noteName: '',
            noteContent: '',
            noteId: null, // Will be set when creating/loading a note
        }
    },
    mounted() {
        // The watcher with `immediate: true` now handles the initial state loading.
        console.log('Notes component mounted.');
    },
    methods: {
        ...mapActions(useNoteFolderStore, ['createNoteFolder', 'deleteNoteFolder']),
        ...mapActions(useNoteStore, ['createNote', 'updateNote']),

        updateLocalState(note) {
            if (note) {
                this.noteName = note.name;
                this.noteContent = note.content;
                this.noteId = note.id;
            } else {
                // Clear the form if no note is selected
                this.noteName = '';
                this.noteContent = '';
                this.noteId = null;
            }
        },

        handleNameChange() {
            // this.sendUpdate({ name: this.noteName });
        },

        // Watch for content changes from TextEditor
        onContentChange(newContent) {
            this.noteContent = newContent; // Ensure noteContent is updated directly
            // this.sendUpdate({ content: newContent });
        },

        async saveNote(){
            console.log('Save note', this.noteId, this.noteName, this.noteContent);

            await this.updateNote(this.note.id, this.noteName, this.noteContent, this.selectedNote?.format || 'text');
        },
        async deleteNote(){
            console.log('Delete note', this.noteId);
            // Implement delete logic here
            // Potentially send a specific 'delete' message via WebSocket or call an API
        }
    },
    computed: {
        ...mapState(useAuthStore, ['user']),
        ...mapState(useNoteStore, ['selectedNote']),
        ...mapState(useTreeStore, ['selectedTreeItem'])
    },
    watch: {
        selectedNote: {
            handler(newNote) {
                console.log('Watcher: selectedNote changed to', newNote);
                this.updateLocalState(newNote);
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style lang="css" scoped>
/* Removed old .title-container styling as Toolbar handles layout */

.editor-container {
    height: calc(100% - 70px); /* Adjust based on Toolbar height, may need to be dynamic */
    padding: 0 10px 10px 10px;
}

/* Add any additional styling for PrimeVue components if needed */
.p-toolbar {
    border-radius: 0; /* Optional: remove border-radius if you prefer a flatter look */
    padding: 0.5rem 1rem; /* Adjust padding as needed */
}

.mr-2{
    margin-right: 0.5rem;
}

</style>