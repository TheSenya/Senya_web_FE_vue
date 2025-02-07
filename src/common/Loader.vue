<template>
    <div 
      class="spinner"
      :style="{
        width: size,
        height: size,
        borderColor: color,
        borderBottomColor: 'transparent',
        borderWidth: borderWidth
      }"
    ></div>
  </template>
  
  <script>
  export default {
    name: 'Spinner',
    props: {
      size: {
        type: String,
        default: '50px'
      },
      color: {
        type: String,
        default: '#333'
      },
      borderWidth: {
        type: String,
        default: '4px'
      }
    }
  }
  </script>
  
  <style scoped>
  .spinner {
    display: inline-block;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>