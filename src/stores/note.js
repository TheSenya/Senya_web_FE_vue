import { defineStore } from 'pinia'
import { ref } from 'vue'
import envVariables from '@/constants/env_contants'
import { useAuthStore } from '@/stores/auth'
import { useNoteFolderStore } from '@/stores/noteFolder'

export const useNoteStore = defineStore('note', () => {
    const notes = ref([])
    const selectedNote = ref(null)
    const fileFormats = ref([])
    const authStore = useAuthStore()
    
    const fetchFileFormats = async () => {
        const response = await fetch(`${envVariables.API_BASE_URL}/note/file_formats`)
        const data = await response.json()
        fileFormats.value = data
    }

    const fetchNotes = async () => {
        const response = await fetch(`${envVariables.API_BASE_URL}/note/${authStore.user.id}`, {
            headers: {
                'Authorization': `Bearer ${authStore.user.token}`
            },
            credentials: 'include'
        })
        const data = await response.json()
        notes.value = data
        console.log('notes', notes.value)
    }

    const createNote = async (title, fileFormat, folderId) => {
        console.log('createNote start', title, fileFormat, folderId)
        
        console.log('authStore', authStore.user)
        const response = await fetch(`${envVariables.API_BASE_URL}/note`, {
            method: 'POST',
            body: JSON.stringify({title, format:fileFormat, folder_id: folderId}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.user.token}`
            },
            credentials: 'include'
        })
        const data = await response.json()
        console.log('created note', data)
        notes.value.push(data)
    }

    const updateNote = async (note) => {

    }

    const deleteNote = async (note) => {

    }

    const setSelectedNote = async (note) => {
        selectedNote.value = note
    }
    



    return { notes, selectedNote, fetchNotes, createNote, updateNote, deleteNote, setSelectedNote }
})

