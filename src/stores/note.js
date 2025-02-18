import { defineStore } from 'pinia'
import { ref } from 'vue'
import envVariables from '@/constants/env_contants'
import { useAuthStore } from '@/stores/auth'
import { useNoteFolderStore } from '@/stores/noteFolder'

export const useNoteStore = defineStore('note', () => {
    const notes = ref([])
    const currentNote = ref(null)
    const fileFormats = ref([])

    const fetchFileFormats = async () => {
        const response = await fetch(`${envVariables.API_BASE_URL}/note/file_formats`)
        const data = await response.json()
        fileFormats.value = data
    }

    const fetchNotes = async () => {
        
    }

    const createNote = async (title, fileFormat, folderId) => {
        console.log('createNote start', title, fileFormat, folderId)
        const authStore = useAuthStore()
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
        // notes.value.push(data)
    }

    const updateNote = async (note) => {

    }

    const deleteNote = async (note) => {

    }



    return { notes, fetchNotes, createNote, updateNote, deleteNote }
})

