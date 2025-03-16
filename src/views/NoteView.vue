<template>
    <div class="notes-container">
        <div class="title-container">
            Notes
        </div>

        <div class="note-body-container" ref="container">
            <div class="left-side-container" :style="{ width: leftWidth + 'px' }">
                <TreeView :items="treeData" />
            </div>
            <div class="divider" @mousedown="startDragging"/>
                
            <div class="right-side-container">
                <div v-if="this.treeData == []" class="loader-container">
                    hello
                </div>
                <div v-else-if="this.currentNote == ''" class="note-not-selected-container">
123
                </div>
                <div v-else class="note-container">
                    <Notes/>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import Notes from '@/components/notes/Notes.vue'
import TreeView from '@/components/notes/treeview/TreeView.vue';
import { mapActions, mapState } from 'pinia';
import { useNoteFolderStore } from '@/stores/noteFolder';
import { useNoteStore } from '@/stores/note';

export default {
    name: 'NoteView',
    components:{
        Notes,
        TreeView
    },
    data() {
        return {
            leftWidth: 200,
            isDragging: false,
            minWidthLeftContainer: 130,
            maxWidthLeftContainer: 400,
            currentNote: 'test',
            sortedNotes: {},
            treeData: []
        }
    },
    computed: {
        ...mapState(useNoteFolderStore, ['noteFolders']),
        ...mapState(useNoteStore, ['notes']),
    },
    async created() {
        try {
            await this.fetchNoteFolders();
            await this.fetchNotes();

            this.treeData = this.buildTree( this.noteFolders, this.notes)
            // Update treeData with the fetched folders if needed
        } catch (error) {
            console.error('Error fetching note folders:', error);
        }
    },
    mounted() {
        document.addEventListener('mousemove', this.handleDragging)
        document.addEventListener('mouseup', this.stopDragging)
    },
    beforeDestroy() {
        document.removeEventListener('mousemove', this.handleDragging)
        document.removeEventListener('mouseup', this.stopDragging)
    },
    methods: {
        ...mapActions(useNoteFolderStore, ['fetchNoteFolders']),
        ...mapActions(useNoteStore, ['fetchNotes']),
        startDragging() {
            this.isDragging = true
        },
        stopDragging() {
            this.isDragging = false
        },
        handleDragging(e) {
            if (this.isDragging) {
                const containerRect = this.$refs.container.getBoundingClientRect()
                const newWidth = e.clientX - containerRect.left
                this.leftWidth = Math.min(Math.max(newWidth, this.minWidthLeftContainer), this.maxWidthLeftContainer)
            }
        },
        buildTree(){

            const folderMap = {}
            const tree = []

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
                folderMap[note.folder_id].children.push(noteNode);

            })

            return tree
        }
        
    },
    watch: {
        noteFolders: {
            handler() {
                this.treeData = this.buildTree();
            },
            immediate: true
        },
        notes: {
            handler() {
                this.treeData = this.buildTree();
            },
            immediate: true
        }
    }
}
</script>

<style lang="css" scoped>
.notes-container {
    padding: 20px;
    height: 85vh;
}

.title-container {
    height: 20px;
}

.note-body-container {
    height: 100%;
    display: flex;
    position: relative;
}

.left-side-container {
    width: 200px;
    min-width: 20%;
    flex: none;
    border: 1px solid black;
    border-right: none;
}

.divider {
    width: 5px;
    background-color: #a69898;
    cursor: col-resize;
    flex: none;
    position: relative;
}

.divider:hover,
.divider:active {
    background-color: #db7a7a;
}

.divider::after {
    content: '';
    position: absolute;
    left: -2px;
    right: -2px;
    top: 0;
    bottom: 0;
}

.right-side-container {
    flex: 1;
    border: 1px solid black;
    border-left: none;
    min-width: 100px;
}
</style>