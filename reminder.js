document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['currentTask'], (result) => {
      const task = result.currentTask;
      if (task) {
        document.getElementById('taskTitle').textContent = task.title;
        document.getElementById('taskTime').textContent = task.time;
        document.getElementById('taskDescription').textContent = task.description || 'No description';
      }
    });
    
    document.getElementById('closeButton').addEventListener('click', () => {
      window.close();
    });
  });