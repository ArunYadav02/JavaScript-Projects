document.addEventListener("DOMContentLoaded", () => {
    console.log("JS Loaded"); // Confirm that the script is loaded
  
    const taskInput = document.getElementById("task-input");
    const taskDate = document.getElementById("task-date");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
  
    const newListInput = document.getElementById("new-list-name");
    const createListBtn = document.getElementById("create-list-btn");
    const deleteListBtn = document.getElementById("delete-list-btn");
    const listSelect = document.getElementById("list-select");
  
    const lists = {}; // Object to store multiple lists and their tasks
  
    // Function to create a new list
    createListBtn.addEventListener("click", () => {
      const listName = newListInput.value.trim();
      if (listName && !lists[listName]) {
        lists[listName] = []; // Create a new empty list
        const option = document.createElement("option");
        option.value = listName;
        option.textContent = listName;
        listSelect.appendChild(option); // Add the new list to the dropdown
        newListInput.value = ""; // Clear the input field
        console.log("Created new list:", listName); // Debug log
      } else {
        alert("Please enter a unique list name.");
      }
    });
  
    // Function to display tasks of the selected list
    function displayTasks(listName) {
      taskList.innerHTML = ""; // Clear current tasks
      if (lists[listName]) {
        lists[listName].forEach((task, index) => {
          const taskItem = document.createElement("li");
  
          const taskContent = document.createElement("span");
          taskContent.className = "task-text";
          taskContent.textContent = task.text;
  
          const taskDueDate = document.createElement("span");
          taskDueDate.className = "task-date";
          taskDueDate.textContent = task.date ? `Due: ${task.date}` : "No due date";
  
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "delete-btn";
          deleteBtn.textContent = "Delete";
  
          deleteBtn.addEventListener("click", () => {
            lists[listName].splice(index, 1); // Remove task from list
            displayTasks(listName); // Refresh the displayed tasks
          });
  
          taskItem.appendChild(taskContent);
          taskItem.appendChild(taskDueDate);
          taskItem.appendChild(deleteBtn);
          taskList.appendChild(taskItem);
        });
      }
    }
  
    // Event listener for selecting a list
    listSelect.addEventListener("change", () => {
      const selectedList = listSelect.value;
      console.log("Selected list for display:", selectedList); // Debug log
      displayTasks(selectedList); // Display tasks for the selected list
    });
  
    // Event listener to add a task to the selected list
    addTaskBtn.addEventListener("click", () => {
      const taskText = taskInput.value.trim();
      const dueDate = taskDate.value;
      const selectedList = listSelect.value;
  
      if (taskText && selectedList) {
        const task = { text: taskText, date: dueDate };
        lists[selectedList].push(task); // Add task to selected list
        displayTasks(selectedList); // Display updated list of tasks
  
        taskInput.value = "";
        taskDate.value = "";
      } else {
        alert("Please select a list and enter a task.");
      }
    });
  
    // Event listener to delete the selected list
    deleteListBtn.addEventListener("click", () => {
      const selectedList = listSelect.value;
      console.log("Delete List Button Clicked"); // Check if button works
  
      // Check if a list is selected
      if (selectedList) {
        const confirmDeletion = confirm(`Are you sure you want to delete the list "${selectedList}"?`);
  
        // Proceed with deletion if confirmed
        if (confirmDeletion) {
          delete lists[selectedList]; // Remove the list from the `lists` object
          console.log(`List "${selectedList}" deleted from lists object.`);
  
          // Remove the corresponding option from the dropdown
          const optionToRemove = document.querySelector(`option[value="${selectedList}"]`);
          if (optionToRemove) {
            optionToRemove.remove();
          }
  
          // Clear the task list display and reset the dropdown selection
          taskList.innerHTML = "";
          listSelect.value = ""; // Reset the dropdown
          console.log(`List "${selectedList}" removed from dropdown and tasks cleared.`);
        }
      } else {
        alert("Please select a list to delete.");
      }
    });
  });
  