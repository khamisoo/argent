// Handles toast for message form submission

document.addEventListener('DOMContentLoaded', function () {
  const messageForm = document.getElementById('messageForm');
  if (!messageForm) return;
  messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = messageForm.querySelector('textarea[name="message"]').value.trim();
    const mention = messageForm.querySelector('input[name="mention"]').value.trim();
    if (!message || !mention) {
      showToast('Both message and mention are required.', 'error', 4000);
      return;
    }
    fetch('/main/message', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, mention }),
      credentials: 'same-origin'
    })
      .then(async (res) => {
        let data;
        try { data = await res.json(); } catch { data = null; }
        if (res.ok && data && data.success) {
          showToast('Message sent successfully!', 'success');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          const errorMsg = (data && data.error) ? data.error : 'Failed to send message.';
          showToast(errorMsg + ' If this keeps happening, contact the developer.', 'error', 5000);
        }
      })
      .catch(() => {
        showToast('Technical error. Please contact the developer.', 'error', 5000);
      });
  });
});
