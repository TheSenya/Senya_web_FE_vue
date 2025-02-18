<template>
    <div class="title-container">
        <div class="note-name">
            <input v-model="noteName" type="text" :placeholder="noteName" @input="handleNameChange">
        </div>
        <div class="note-button-container">
            <button class="save-button">save</button>
            <button class="delete-button">delete</button>
        </div>
    </div>
    <div class="editor-container">
        <TextEditor v-model:content="noteContent"></TextEditor>
    </div>
</template>

<script>
import TextEditor from '@/common/TextEditor.vue';
import WebSocketService from '@/services/websocketService';
import { debounce } from 'lodash';

export default {
    name: 'Notes',
    components: {
        TextEditor
    },
    data() {
        return {
            noteName: '',
            noteContent: '',
            noteId: null, // Will be set when creating/loading a note
            lastReceivedUpdate: null
        }
    },
    created() {
        // Connect to WebSocket when component is created
        // WebSocketService.connect();
        
        // Add message listener
        // WebSocketService.addMessageListener(this.handleWebSocketMessage);
    },
    beforeUnmount() {
        // Clean up listener when component is destroyed
        // WebSocketService.removeMessageListener(this.handleWebSocketMessage);
    },
    methods: {
        handleWebSocketMessage(data) {
            // Ignore our own updates
            if (data.timestamp === this.lastReceivedUpdate) return;
            
            if (data.noteId === this.noteId) {
                if (data.content !== undefined) {
                    this.noteContent = data.content;
                }
                if (data.name !== undefined) {
                    this.noteName = data.name;
                }
            }
        },

        // Debounced method to send updates
        sendUpdate: debounce(function(update) {
            if (!WebSocketService.isConnected) return;
            
            const timestamp = Date.now();
            this.lastReceivedUpdate = timestamp;
            
            WebSocketService.sendMessage({
                type: 'update',
                noteId: this.noteId,
                timestamp,
                ...update
            });
        }, 500),

        handleNameChange() {
            this.sendUpdate({ name: this.noteName });
        },

        // Watch for content changes from TextEditor
        onContentChange(newContent) {
            this.sendUpdate({ content: newContent });
        }
    },
    watch: {
        noteContent(newContent) {
            this.sendUpdate({ content: newContent });
        }
    }
}
</script>

<style lang="css" scoped>
.title-container {
    display: flex;
    padding: 10px;
    justify-content: space-between;

    /* .note-name{

    } */

    .note-button-container{
        display: flex;
        .delete-button{
            margin-left: 10px;
        }
        
    }
}
</style>