<template>
  <Dialog
    :visible="visible"
    @update:visible="onDialogHide" 
    :modal="true" 
    :header="title"
    :style="modalComputedStyle"
    :closable="showClose"
    :dismissableMask="closeOnBackdrop"
    :draggable="false" 
  >
    <!-- Slot for modal content -->
    <slot></slot>

    <!-- Optional: You can add a footer slot if needed by components using the modal -->
    <template #footer v-if="$slots.footer">
        <slot name="footer"></slot>
    </template>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';

export default {
  name: "Modal",
  components: {
    Dialog
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: "500px"
    },
    height: {
      type: String,
      default: "auto" // Defaulting to auto height
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    // You might want to add more PrimeVue Dialog props here if needed,
    // e.g., position, blockScroll, etc.
  },
  emits: ['update:visible', 'close'], // Declare emitted events
  computed: {
    modalComputedStyle() {
      const style = {};
      if (this.width) style.width = this.width;
      if (this.height) style.height = this.height;
      // PrimeVue Dialog often manages its height based on content or specific contentStyle prop.
      // If you want to force overall dialog height, this can work, but consider content flow.
      return style;
    }
  },
  methods: {
    onDialogHide(value) {
      // This method is called when PrimeVue Dialog attempts to hide.
      // We update the parent's visible prop and emit our own close event.
      this.$emit("update:visible", value);
      if (!value) { // Only emit close when it's actually closing
        this.$emit("close");
      }
    }
  }
};
</script>

<style scoped>
/* 
  Most custom styles from the original modal can be removed 
  as PrimeVue Dialog handles its own styling. 
  You can add global PrimeVue theme customizations or use PrimeVue's 
  CSS utility classes if needed.

  If you need to override specific Dialog styles, you can do so here, 
  but it's generally recommended to use themes and passthrough props for customization.
*/

/* Default padding and styling for Dialog sections */
:deep(.p-dialog-header) {
  padding: 1rem 1.5rem; /* More horizontal padding for header */
  border-bottom: 1px solid #dee2e6; /* Add a separator line for the header */
}

:deep(.p-dialog-content) {
  padding: 1.5rem; /* Generous padding for content area */
  line-height: 1.6; /* Improve readability of text content */
}

:deep(.p-dialog-footer) {
  padding: 1rem 1.5rem; /* Consistent padding for footer */
  border-top: 1px solid #dee2e6; /* Separator line for the footer */
  display: flex; /* Enable flex for button alignment if needed */
  justify-content: flex-end; /* Align footer content (e.g., buttons) to the right */
}

/* Styling for buttons within the footer slot for consistency */
:deep(.p-dialog-footer button) {
  margin-left: 0.5rem; /* Space out buttons in the footer */
}

/* Add any specific overrides or additional styles if necessary */
</style>
