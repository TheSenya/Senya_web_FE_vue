<template>
    <div class="text-editor">
        <div ref="editor"
            :style="{ '--editor-width': editorWidth + '%', '--editor-height': editorMinHeight+ 'px', '--editor-min-width': editorMinWidth + 'px', '--editor-min-height': editorMinHeight + 
                'px'
            }">
        </div>

    </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export default {
    name: 'TextEditor',
    props: {
        value: {
            type: String,
            default: ''
        },
        editorHeight: {
            type: Number,
            default: 100,
            required: false,

        },
        editorWidth: {
            type: Number,
            default: 100,
            required: false,

        },
        editorMinHeight: {
            type: Number,
            default: 600,
            required: false,

        },
        editorMinWidth: {
            type: Number,
            default: 100,
            required: false,

        }
    },
    data() {
        return {
            editor: null,
            content: this.value
        }
    },
    mounted() {
        this.initializeQuill()
    },
    methods: {
        initializeQuill() {
            const options = {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        ['clean']
                    ]
                },
                placeholder: 'Write something...'
            }

            this.editor = new Quill(this.$refs.editor, options)

            // Set initial content
            if (this.content) {
                this.editor.root.innerHTML = this.content
            }

            // Handle content changes
            this.editor.on('text-change', () => {
                const content = this.editor.root.innerHTML
                this.$emit('input', content)
            })
        }
    },
    watch: {
        value(newVal) {
            if (newVal !== this.editor.root.innerHTML) {
                this.editor.root.innerHTML = newVal
            }
        }
    }
}
</script>

<style scoped>
.text-editor {
    border: 1px solid #ccc;
    border-radius: 4px;
}

:deep(.ql-editor) {
    background-color: #f8f9fa;
    width: var(--editor-width);
    height: var(--editor-height);
    min-width: var(--editor-min-width)px;
    min-height: var(--editor-min-height)px;

    /* Light gray background */
}

:deep(.ql-toolbar) {
    background-color: #f0f0f0;
    /* Light gray background for the toolbar */
    border-bottom: 1px solid #ccc;
}
</style>