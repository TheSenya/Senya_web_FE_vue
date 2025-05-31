import { defineStore } from 'pinia'
import { ref } from 'vue'
import envVariables from '@/constants/env_contants'
import { useAuthStore } from '@/stores/auth'

export const useNoteFolderStore = defineStore('noteFolder', () => {
    const noteFolders = ref([])
    const selectedNoteFolder = ref(null)
    const authStore = useAuthStore()

    const setSelectedNoteFolder = (noteFolderId) => {
        selectedNoteFolder.value = noteFolderId
    }

    // get all note folders
    const fetchNoteFolders = async () => {
        console.log('fetchNoteFolders')

        try {

            const response = await fetch(`${envVariables.API_BASE_URL}/note_folder`, {
                headers: {
                    'Authorization': `Bearer ${authStore.user.token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const data = await response.json()
            console.log('data', data)
            noteFolders.value = data
        } catch (error) {
            console.error('Error fetching note folders:', error)
        }
    }

    // create a note folder
    const createNoteFolder = async (folderName, parentId) => {
        console.log('createNoteFolder', folderName, parentId)

        const createNoteFolderData = {
            name: folderName,
            parent_id: parentId,
            user_id: authStore.user.id
        }

        const response = await fetch(`${envVariables.API_BASE_URL}/note_folder`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authStore.user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: folderName,
                parent_id: parentId,
                user_id: authStore.user.id
            }),
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error('Failed to create folder')
        }

        const data = await response.json()
        console.log('createNoteFolder data', data)
        await fetchNoteFolders() // Refresh the folder list
        return data
    }

    // update a note folder
    const updateNoteFolder = async (noteFolderId, newNoteFolderName) => {
        console.log('updateNoteFolder', noteFolderId, newNoteFolderName)

        // send request to update folder name
        const response = await fetch(`${envVariables.API_BASE_URL}/note_folder/${noteFolderId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authStore.user.token}`,
            },
            credentials: 'include',
            body: JSON.stringify({
                name: newNoteFolderName
            })
        })

        if (!response.ok) {
            throw new Error('Failed to update folder')
        }

        await fetchNoteFolders() // Refresh the folder list
        return response.json()
    }

    // delete a note folder
    const deleteNoteFolder = async (noteFolderId) => {
        console.log('deleteNoteFolder', noteFolderId)

        // delete folder
        const response = await fetch(`${envVariables.API_BASE_URL}/note_folder/${noteFolderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authStore.user.token}`,
            },
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error('Failed to delete folder')
        }

        await fetchNoteFolders() // Refresh the folder list
        return response.json()
    }
    return { noteFolders, selectedNoteFolder, setSelectedNoteFolder, fetchNoteFolders, createNoteFolder, updateNoteFolder, deleteNoteFolder }
})