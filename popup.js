document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    
    document.getElementById('addTask').addEventListener('click', addTask);
    
    function addTask() {
      const title = document.getElementById('taskTitle').value;
      const description = document.getElementById('taskDescription').value;
      const time = document.getElementById('taskTime').value;
      
      if (!title || !time) {
        alert('Please fill in the task title and time');
        return;
      }
      
      const task = {
        id: Date.now(),
        title,
        description,
        time,
        created: new Date().toISOString()
      };
      
      chrome.storage.sync.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        tasks.push(task);
        chrome.storage.sync.set({ tasks }, () => {
          createAlarmForTask(task);
          loadTasks();
          clearForm();
        });
      });
    }
    
    function loadTasks() {
      const container = document.getElementById('tasksContainer');
      container.innerHTML = '';
      
      chrome.storage.sync.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        tasks.sort((a, b) => {
          return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
        });
        
        tasks.forEach(task => {
          const taskElement = createTaskElement(task);
          container.appendChild(taskElement);
        });
      });
    }
    
    function createTaskElement(task) {
      const div = document.createElement('div');
      div.className = 'task-item';
      
      const taskInfo = document.createElement('div');
      taskInfo.className = 'task-info';
      
      const title = document.createElement('div');
      title.className = 'task-title';
      title.textContent = task.title;
      
      const time = document.createElement('div');
      time.className = 'task-time';
      time.textContent = `Time: ${task.time}`;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => deleteTask(task.id);
      
      taskInfo.appendChild(title);
      taskInfo.appendChild(time);
      div.appendChild(taskInfo);
      div.appendChild(deleteBtn);
      
      return div;
    }
    
    function deleteTask(taskId) {
      chrome.storage.sync.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        chrome.storage.sync.set({ tasks: updatedTasks }, () => {
          chrome.alarms.clear(taskId.toString());
          loadTasks();
        });
      });
    }
    
    function createAlarmForTask(task) {
      const [hours, minutes] = task.time.split(':');
      const now = new Date();
      const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
                                   parseInt(hours), parseInt(minutes));
      
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      chrome.alarms.create(task.id.toString(), {
        when: scheduledTime.getTime()
      });
    }
    
    function clearForm() {
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDescription').value = '';
      document.getElementById('taskTime').value = '';
    }
  });
  