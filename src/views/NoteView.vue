<template>
    <div class="notes-container">
        <div class="title-container">
            <div class="title-container-left">
                Notes
            </div>
            <div class="title-container-right">
                <SelectButton v-model="currentMode" :options="modeOptions" optionLabel="label" optionValue="value" />
            </div>
        </div>

        <Splitter style="height: 100%" class="mb-5" @resizeend="onResizeEnd">
            <SplitterPanel :size="leftPanelSize" :min-size="10">
                <TreeView :items="treeData" />
            </SplitterPanel>
            <SplitterPanel :size="100 - leftPanelSize" :min-size="10">
                <div v-if="selectedTreeItem === null" class="note-not-selected-container">
                    Select a note or folder.
                </div>
                <div v-else-if="selectedTreeItem.type === 'folder'" class="note-not-selected-container">
                    You have selected a folder.
                </div>
                <div v-else-if="selectedTreeItem.type === 'file'" class="note-container">
                    <Notes />
                </div>
            </SplitterPanel>
        </Splitter>
    </div>
</template>

<script>
import Notes from '@/components/notes/Notes.vue'
import TreeView from '@/components/notes/treeview/TreeView.vue';

import { mapActions, mapState } from 'pinia';
import { useNoteFolderStore } from '@/stores/noteFolder';
import { useNoteStore } from '@/stores/note';
import { useTreeStore } from '@/stores/tree';

import SelectButton from 'primevue/selectbutton';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

export default {
    name: 'NoteView',
    components:{
        Notes,
        TreeView,
        SelectButton,
        Splitter,
        SplitterPanel
    },
    data() {
        return {
            leftWidth: 200, // Initial width, will be controlled by Splitter's size prop
            leftPanelSize: 20, // Percentage for the left panel
            minWidthLeftContainer: 130, // Keep for reference if needed for minSize logic
            maxWidthLeftContainer: 400, // Keep for reference if needed
            sortedNotes: {},
            treeData: [],
            currentMode: 'view',
            modeOptions: [
                { label: 'View', value: 'view' },
                { label: 'Edit', value: 'edit' }
            ]
        }
    },
    computed: {
        ...mapState(useNoteFolderStore, ['noteFolders']),
        ...mapState(useNoteStore, ['notes'],),
        ...mapState(useTreeStore, ['selectedTreeItem']),
    },
    async created() {
        try {
            await this.fetchNoteFolders();
            await this.fetchNotes();

            // this.treeData = this.buildTree( this.noteFolders, this.notes)
            // Update treeData with the fetched folders if needed
        } catch (error) {
            console.error('Error fetching note folders:', error);
        }

        console.log('Notes created', this.selectedTreeItem);
        console.log('selectedNote', this.selectedNote);
        console.log('noteName', this.noteName);
        console.log('selectedTreeItem', this.selectedTreeItem);
    },
    mounted() {
        // Remove old event listeners for dragging
    },
    beforeDestroy() {
        // Remove old event listeners for dragging
    },
    methods: {
        ...mapActions(useNoteFolderStore, ['fetchNoteFolders']),
        ...mapActions(useNoteStore, ['fetchNotes']),
        onResizeEnd(event) {
            // event.sizes contains the new sizes of the panels in percentage
            this.leftPanelSize = event.sizes[0];
            // If you need to store width in pixels, you might need to calculate it
            // based on the container width, but PrimeVue handles resizing internally.
        },
        buildTree(){
            const folderMap = {}
            const tree = []

            console.log('noteFolders', this.noteFolders)

            this.noteFolders.forEach((folder) => {
                const node = {
                    id: folder.id,
                    name: folder.name,
                    type: 'folder',  // Changed to 'folder' instead of folder.type
                    children: []     // Fixed typo from 'childen'
                }
                folderMap[folder.id] = node
            })

            this.noteFolders.forEach((folder) => {
                const node = folderMap[folder.id];
                if (folder.parent_id != null && folderMap[folder.parent_id]) {
                    folderMap[folder.parent_id].children.push(node);
                }
                else{
                    tree.push(node);
                }
            })
            
            this.notes.forEach((note) => {
                const noteNode = {
                    id: note.id,
                    name: note.name,
                    type: 'file',
                    content: null,
                };
                if (folderMap[note.folder_id]) {
                    folderMap[note.folder_id].children.push(noteNode);
                } else {
                    console.warn(`Note "${note.name}" (ID: ${note.id}) has an invalid folder_id: ${note.folder_id}. It will not be displayed in the tree.`);
                }
            });

            return tree;
        }
    },
    watch: {
        noteFolders: {
            handler(newFolders, oldFolders) {
                console.log('Watcher: noteFolders changed', newFolders);
                this.treeData = this.buildTree();
                console.log('Watcher: treeData after noteFolders change', this.treeData);
            },
            immediate: true,
            deep: true // Add deep watch if folder properties might change internally without the folder object itself being replaced
        },
        notes: {
            handler(newNotes, oldNotes) {
                this.treeData = this.buildTree();
            },
            immediate: true,
            deep: true // Add deep watch as notes might be added to the array
        }
    }
}
</script>

<style lang="css" scoped>
.notes-container {
    padding: 20px;
    height: 85vh;
    display: flex; /* Added for Splitter to take full height */
    flex-direction: column; /* Added for Splitter to take full height */
}

.title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.title-container-left {
    font-size: 24px;
    font-weight: bold;
}

/* Removed title-container-right button styling as SelectButton has its own */

.note-body-container { /* This class might be removable if Splitter handles all layout */
    height: 100%;
    display: flex;
    position: relative;
}

/* .left-side-container, .divider, .right-side-container are no longer needed
   as Splitter and SplitterPanel handle this.
   However, you might want to style the panels themselves if needed.
*/
.p-splitter-panel { /* Example to style splitter panels */
    border: 1px solid #dee2e6; /* PrimeVue's default border color */
}

.loader-container, .note-not-selected-container, .note-container {
    padding: 1rem; /* Added some padding */
    height: 100%; /* Ensure it fills the panel */
    overflow: auto; /* If content overflows */
}

</style>