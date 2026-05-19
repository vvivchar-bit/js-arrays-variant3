const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskPriority = document.getElementById("taskPriority");
const taskStatus = document.getElementById("taskStatus");
const taskDate = document.getElementById("taskDate");

const priorityFilter = document.getElementById("priorityFilter");
const statusFilter = document.getElementById("statusFilter");
const resetFilters = document.getElementById("resetFilters");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const doneTasks = document.getElementById("doneTasks");
const inProgressTasks = document.getElementById("inProgressTasks");
const pendingTasks = document.getElementById("pendingTasks");
const overdueTasks = document.getElementById("overdueTasks");

const runArrayDemo = document.getElementById("runArrayDemo");
const arrayResult = document.getElementById("arrayResult");

const priorityLabels = {
    high: "High",
    medium: "Medium",
    low: "Low"
};

const statusLabels = {
    pending: "Очікує",
    "in-progress": "У процесі",
    done: "Виконано"
};

const getDateWithOffset = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
};

const getToday = () => new Date().toISOString().split("T")[0];

let tasks = JSON.parse(localStorage.getItem("tasksVariant3")) || [
    {
        id: 1,
        title: "Створити структуру проєкту",
        priority: "high",
        status: "done",
        date: getDateWithOffset(-1)
    },
    {
        id: 2,
        title: "Реалізувати Task Tracker",
        priority: "high",
        status: "in-progress",
        date: getDateWithOffset(1)
    },
    {
        id: 3,
        title: "Записати demo відео",
        priority: "medium",
        status: "pending",
        date: getDateWithOffset(2)
    },
    {
        id: 4,
        title: "Перевірити прострочені задачі",
        priority: "low",
        status: "pending",
        date: getDateWithOffset(-2)
    }
];

const saveTasks = () => {
    localStorage.setItem("tasksVariant3", JSON.stringify(tasks));
};

const validateTask = (title, priority, status, date) => {
    if (!title.trim()) {
        alert("Введіть назву завдання.");
        return false;
    }

    if (!priority) {
        alert("Оберіть пріоритет.");
        return false;
    }

    if (!status) {
        alert("Оберіть статус.");
        return false;
    }

    if (!date) {
        alert("Оберіть дату.");
        return false;
    }

    return true;
};

const addTask = (title, priority, status, date) => {
    const newTask = {
        id: Date.now(),
        title: title.trim(),
        priority,
        status,
        date
    };

    tasks = [...tasks, newTask];

    saveTasks();
    renderTasks();
};

const deleteTask = (id) => {
    tasks = tasks.filter((task) => task.id !== id);

    saveTasks();
    renderTasks();
};

const changeTaskStatus = (id, newStatus) => {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            return {
                ...task,
                status: newStatus
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
};

const getFilteredTasks = () => {
    const selectedPriority = priorityFilter.value;
    const selectedStatus = statusFilter.value;

    return tasks.filter((task) => {
        const priorityMatch = selectedPriority === "all" || task.priority === selectedPriority;
        const statusMatch = selectedStatus === "all" || task.status === selectedStatus;

        return priorityMatch && statusMatch;
    });
};

const getTaskStatistics = () => {
    const today = getToday();

    return tasks.reduce(
        (stats, task) => {
            stats.total += 1;

            if (task.status === "done") {
                stats.done += 1;
            }

            if (task.status === "in-progress") {
                stats.inProgress += 1;
            }

            if (task.status === "pending") {
                stats.pending += 1;
            }

            if (task.status !== "done" && task.date < today) {
                stats.overdue += 1;
            }

            return stats;
        },
        {
            total: 0,
            done: 0,
            inProgress: 0,
            pending: 0,
            overdue: 0
        }
    );
};

const updateStatistics = () => {
    const statistics = getTaskStatistics();

    totalTasks.textContent = statistics.total;
    doneTasks.textContent = statistics.done;
    inProgressTasks.textContent = statistics.inProgress;
    pendingTasks.textContent = statistics.pending;
    overdueTasks.textContent = statistics.overdue;
};

const renderTasks = () => {
    const filteredTasks = getFilteredTasks();

    updateStatistics();

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p class="empty-message">Завдання не знайдено.</p>';
        return;
    }

    taskList.innerHTML = filteredTasks
        .map((task) => {
            const isOverdue = task.status !== "done" && task.date < getToday();

            return `
                <div class="task-item ${task.priority}">
                    <div class="task-header">
                        <div class="task-title">${task.title}</div>
                        <div>${priorityLabels[task.priority]}</div>
                    </div>

                    <div class="task-info">
                        <p>Статус: ${statusLabels[task.status]}</p>
                        <p>Дата: ${task.date}</p>
                        ${isOverdue ? '<p class="overdue">Прострочено</p>' : ""}
                    </div>

                    <div class="task-actions">
                        <button class="btn-progress" onclick="changeTaskStatus(${task.id}, 'in-progress')">
                            У процесі
                        </button>

                        <button class="btn-done" onclick="changeTaskStatus(${task.id}, 'done')">
                            Виконано
                        </button>

                        <button class="btn-delete" onclick="deleteTask(${task.id})">
                            Видалити
                        </button>
                    </div>
                </div>
            `;
        })
        .join("");
};

const flatten = (array) => {
    return array.reduce((result, item) => {
        if (Array.isArray(item)) {
            return [...result, ...flatten(item)];
        }

        return [...result, item];
    }, []);
};

const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupKey = item[key];

        return {
            ...result,
            [groupKey]: [...(result[groupKey] || []), item]
        };
    }, {});
};

const unique = (array) => {
    return array.filter((item, index) => array.indexOf(item) === index);
};

const chunk = (array, size) => {
    if (size <= 0) {
        return [];
    }

    const result = [];

    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }

    return result;
};

const runTransformationsDemo = () => {
    const nestedArray = [1, [2, 3], [4, [5, 6]], 7];
    const duplicateArray = ["JS", "HTML", "CSS", "JS", "HTML", "Git"];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

    const groupedTasks = groupBy(tasks, "priority");
    const foundHighPriorityTask = tasks.find((task) => task.priority === "high");

    const result = {
        "flatten([1, [2, 3], [4, [5, 6]], 7])": flatten(nestedArray),
        "groupBy(tasks, 'priority')": groupedTasks,
        "unique(['JS', 'HTML', 'CSS', 'JS', 'HTML', 'Git'])": unique(duplicateArray),
        "chunk([1,2,3,4,5,6,7,8], 3)": chunk(numbers, 3),
        "find high priority task": foundHighPriorityTask || "Не знайдено"
    };

    arrayResult.textContent = JSON.stringify(result, null, 4);
};

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = taskTitle.value;
    const priority = taskPriority.value;
    const status = taskStatus.value;
    const date = taskDate.value;

    if (!validateTask(title, priority, status, date)) {
        return;
    }

    addTask(title, priority, status, date);

    taskForm.reset();
});

priorityFilter.addEventListener("change", renderTasks);
statusFilter.addEventListener("change", renderTasks);

resetFilters.addEventListener("click", () => {
    priorityFilter.value = "all";
    statusFilter.value = "all";

    renderTasks();
});

runArrayDemo.addEventListener("click", runTransformationsDemo);

renderTasks();