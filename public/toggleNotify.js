// Handles the notify toggle and updates the server

document.addEventListener('DOMContentLoaded', function () {
  const notifyToggle = document.getElementById('notifyToggle');
  if (!notifyToggle) return;
  notifyToggle.addEventListener('change', function () {
    fetch('/main/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notify: notifyToggle.checked }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          alert('Failed to update notification preference.');
        }
      })
      .catch(() => {
        alert('Failed to update notification preference.');
      });
  });
});document.addEventListener('DOMContentLoaded', function() {
  const notifyToggle = document.getElementById('notifyToggle');
  if (notifyToggle) {
    notifyToggle.addEventListener('change', async function() {
      const notify = notifyToggle.checked;
      try {
        await fetch('/main/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notify }),
        });
      } catch (err) {
        alert('Failed to update notification preference.');
      }
    });
  }
});
