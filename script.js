// script.js
// Wait for the DOM to fully load before running any code
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
  
    // Helper: get tasks array from localStorage (returns [] if none)
    function getStoredTasks() {
      return JSON.parse(localStorage.getItem('tasks') || '[]');
    }
  
    // Helper: save tasks array to localStorage
    function saveTasksToLocalStorage(tasksArray) {
      localStorage.setItem('tasks', JSON.stringify(tasksArray));
    }
  
    // Add a task to the DOM. If save === true, also persist to localStorage.
    // If taskText is provided, use it; otherwise read from the input field.
    function addTask(taskTextArg, save = true) {
      const fromInput = typeof taskTextArg === 'undefined';
      const taskText = (fromInput ? taskInput.value : taskTextArg || '').trim();
  
      // If the task is empty, only alert when user attempted to add via UI (not when loading)
      if (taskText === '') {
        if (fromInput) alert('Please enter a task!');
        return;
      }
  
      // Create list item structure: <li><span>{text}</span><button class="remove-btn">Remove</button></li>
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = taskText;
  
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.className = 'remove-btn';
  
      // When removing: compute the li's index in the list (matching the storage order),
      // remove that index from the stored array, update localStorage, then remove from DOM.
      removeBtn.addEventListener('click', () => {
        // Find this li's index among current list items (DOM order mirrors stored array order)
        const allLis = Array.from(taskList.children);
        const liIndex = allLis.indexOf(li);
  
        if (liIndex > -1) {
          const storedTasks = getStoredTasks();
          storedTasks.splice(liIndex, 1); // remove the corresponding task
          saveTasksToLocalStorage(storedTasks);
        }
  
        // Remove from DOM
        taskList.removeChild(li);
      });
  
      // Assemble and append
      li.appendChild(span);
      li.appendChild(removeBtn);
      taskList.appendChild(li);
  
      // Persist new task if requested
      if (save) {
        const storedTasks = getStoredTasks();
        storedTasks.push(taskText);
        saveTasksToLocalStorage(storedTasks);
      }
  
      // Clear input only if this add came from input (not from loading saved tasks)
      if (fromInput) taskInput.value = '';
    }
  
    // Load tasks from localStorage and render them (do not re-save while loading)
    function loadTasks() {
      const storedTasks = getStoredTasks();
      storedTasks.forEach(taskText => addTask(taskText, false));
    }
  
    // Event listeners: button click and Enter key
    addButton.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', event => {
      if (event.key === 'Enter') addTask();
    });
  
    // Initialize - load saved tasks
    loadTasks();
  });
  