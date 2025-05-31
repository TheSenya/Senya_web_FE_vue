<template>
  <div class="todo-view-container">
    <header class="todo-header">
      <h1>My Todos</h1>
    </header>
    <main class="todo-main-content">
    </main>
  </div>
</template>

<script>

export default {
  name: 'TodoView',
  components: {
    // AddTodoForm,
  },
  data() {
    return {
      todos: [], // We'll manage the list of todos here for now
    };
  },
  methods: {
    handleAddTodo(newTodoText) {
      this.todos.push({
        id: Date.now(), // Simple unique ID
        text: newTodoText,
        completed: false,
      });
      console.log('Current todos:', this.todos); // For debugging
    },
  },
};
</script>

<style scoped>
.todo-view-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.todo-header h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 600;
}

.todo-main-content {
  /* Styles for the main content area if needed later */
}
</style>
