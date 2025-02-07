<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click.self="handleBackdropClick">
      <div class="modal-container" :style="modalStyles">
        <div class="modal-header">
          <span class="modal-title">{{ title }}</span>
          <button v-if="showClose" class="modal-close" @click="closeModal" :style="xPositionStyle">✕</button>
        </div>
        <div class="modal-content">
          <!-- Slot for modal content -->
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    // Controls the visibility of the modal
    visible: {
      type: Boolean,
      required: true
    },
    // Width of the modal (default: 500px)
    width: {
      type: String,
      default: "500px"
    },
    // Height of the modal (default: auto)
    height: {
      type: String,
      default: "500px"
    },
    // Whether to display a close button (default: true)
    showClose: {
      type: Boolean,
      default: true
    },
    // Allows closing the modal when clicking on the backdrop (default: true)
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    // NEW PROP FOR MODAL TITLE
    title: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      xPosition: parseInt(this.width) || 250
    }
  },
  computed: {
    modalStyles() {
      return {
        width: this.width,
        height: this.height
      };
    },
    xPositionStyle() {
      return {
        left: (this.xPosition / 2 - 15).toString() + "px" || "200px"
      };
    }
  },
  methods: {
    closeModal() {
      // Emit an event to update the visibility so the parent can close the modal
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.closeModal();
      }
    },
  }
};
</script>

<style scoped>
/* Full-screen overlay backed by a semi-transparent background */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal container styling */
.modal-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  animation: fadeInScale 0.3s ease;
}

/* Transition for fading in/out the modal overlay */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

/* Close button styling */
.modal-close {
  position: absolute;
  top: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: #000;
}

/* Keyframes for a slight scale animation */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* NEW STYLES FOR TOP BAR */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
  height: 50px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
}
</style>
