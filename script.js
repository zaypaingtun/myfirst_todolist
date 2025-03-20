document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    updateTaskCount();
    
    // Ensure the Add Task button works
    document.getElementById("add-task-btn").addEventListener("click", addTask);
    
    // Ensure Enter key also adds a task
    document.getElementById("task-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
});

function addTask() {
    let input = document.getElementById("task-input");
    let task = input.value.trim();

    if (task === "") return;

    let ul = document.getElementById("task-list");
    let li = document.createElement("li");

    li.setAttribute("draggable", true);
    li.innerHTML = `${task} <span onclick="removeTask(this)">❌</span>`;
    li.addEventListener("click", () => {
        li.classList.toggle("checked");
        saveTasks();
    });
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);

    ul.appendChild(li);
    saveTasks();
    updateTaskCount();

    input.value = "";
}

function removeTask(span) {
    let li = span.parentElement;
    li.remove();
    saveTasks();
    updateTaskCount();
}

function updateTaskCount() {
    let count = document.querySelectorAll("#task-list li").length;
    document.getElementById("task-count").innerText = count;
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#task-list li").forEach(li => {
        tasks.push({ text: li.textContent.replace("❌", "").trim(), checked: li.classList.contains("checked") });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let ul = document.getElementById("task-list");

    tasks.forEach(task => {
        let li = document.createElement("li");
        li.setAttribute("draggable", true);
        li.innerHTML = `${task.text} <span onclick="removeTask(this)">❌</span>`;
        if (task.checked) li.classList.add("checked");
        li.addEventListener("click", () => li.classList.toggle("checked"));
        ul.appendChild(li);
    });
}

document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}

/* Drag & Drop */
let draggedItem = null;

function dragStart(event) {
    draggedItem = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (event.target.tagName === "LI") {
        event.target.before(draggedItem);
        saveTasks();
    }
}
