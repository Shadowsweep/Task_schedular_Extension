chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.sync.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      const task = tasks.find(t => t.id.toString() === alarm.name);
      
      if (task) {
        chrome.windows.create({
          url: 'reminder.html',
          type: 'popup',
          width: 400,
          height: 300
        });
        
        // Pass the task data to the reminder window
        chrome.storage.local.set({ currentTask: task });
      }
    });
  });