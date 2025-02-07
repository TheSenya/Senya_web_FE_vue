<template>
    <div class="title-container">
        <div class="note-name">
            <input v-model="noteName" type="text" :placeholder="noteName">
        </div>
        <div class="note-button-container">
            <button class="save-button">save</button>
            <button class="delete-button">delete</button>
        </div>
    </div>
    <div class="editor-container">
        <TextEditor></TextEditor>
    </div>
</template>

<script>
import TextEditor from '@/common/TextEditor.vue';


export default {
    name: 'Notes',
    components:{
        TextEditor
    },
    data() {
        return {
            noteName: ''
        }
    },
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