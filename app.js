document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date');
    const priorityInput = document.getElementById('priority');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Render initial todos
    renderTodos();

    // Add new todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const todoText = todoInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (todoText) {
            const todo = {
                id: Date.now(),
                text: todoText,
                completed: false,
                dueDate: dueDate,
                priority: priority,
                createdAt: new Date().toISOString()
            };

            todos.unshift(todo);
            saveTodos();
            renderTodos();

            todoForm.reset();
        }
    });

    // Handle todo actions (complete, edit, delete)
    todoList.addEventListener('click', (e) => {
        const todoItem = e.target.closest('.todo-item');
        if (!todoItem) return;

        const todo = todos.find(t => t.id === parseInt(todoItem.dataset.id));
        if (!todo) return;

        if (e.target.matches('.todo-checkbox')) {
            todo.completed = e.target.checked;
            saveTodos();
            renderTodos();
        } else if (e.target.matches('.edit-btn')) {
            const newText = prompt('Edit task:', todo.text);
            if (newText !== null && newText.trim() !== '') {
                todo.text = newText.trim();
                saveTodos();
                renderTodos();
            }
        } else if (e.target.matches('.delete-btn')) {
            if (confirm('Are you sure you want to delete this task?')) {
                todos = todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos();
            }
        }
    });

    // Handle filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTodos();
        });
    });

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Render todos
    function renderTodos() {
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <div class="todo-text">${todo.text}</div>
                    <div class="todo-details">
                        ${todo.dueDate ? `Due: ${new Date(todo.dueDate).toLocaleDateString()}` : ''}
                        ${todo.priority ? `• Priority: ${todo.priority}` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `).join('');
    }
});