document.addEventListener('DOMContentLoaded', function() {
  const gotMeForm = document.getElementById('gotMeForm');
  const locationInput = document.getElementById('locationInput');
  const gotMeBtn = document.getElementById('gotMeBtn');
  const locationStatus = document.getElementById('locationStatus');
  if (!gotMeForm) return;
  gotMeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    gotMeBtn.disabled = true;
    locationStatus.textContent = 'Getting location...';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        locationInput.value = `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`;
        locationStatus.textContent = 'Location attached! Sending...';
        // Use fetch to submit form and show toast
        fetch('/main/gotme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `location=${encodeURIComponent(locationInput.value)}`
        })
        .then(async (res) => {
          const text = await res.text();
          if (res.ok) {
            showToast('Location sent successfully!', 'success');
            setTimeout(() => window.location.reload(), 1200);
          } else {
            const match = text.match(/<div class=\"alert alert-danger\">(.*?)<\/div>/);
            const errorMsg = match ? match[1] : 'Failed to send location.';
            showToast(errorMsg + ' If this keeps happening, contact the developer.', 'error', 5000);
          }
        })
        .catch(() => {
          showToast('Technical error. Please contact the developer.', 'error', 5000);
        });
      }, function(err) {
        locationInput.value = 'Location denied';
        locationStatus.textContent = 'Location denied by user.';
        showToast('Location denied by user. Cannot send.', 'error');
        gotMeBtn.disabled = false;
      }, {timeout: 10000});
    } else {
      locationInput.value = 'Geolocation not supported';
      locationStatus.textContent = 'Geolocation not supported.';
      showToast('Geolocation not supported on this device.', 'error');
      gotMeBtn.disabled = false;
    }
  });
});
