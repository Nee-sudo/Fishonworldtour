// Complete Script for Fish Journey EJS pages

document.addEventListener('DOMContentLoaded', function() {
  console.log('Fish journey script loaded!');

  // 1. Countdown Timer from April 1, 2025
  const startDate = new Date('2025-04-01T00:00:00');
  
  function updateTimer() {
    const now = new Date();
    const elapsed = now - startDate;
    
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }
  
  updateTimer();
  setInterval(updateTimer, 1000);

  // 2. Leaflet Map init
  if (document.getElementById('map')) {
    const map = L.map('map').setView([20, 0], 2); // Center on Atlantic
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add marker for starting point or fetched locations
    L.marker([51.505, -0.09]).addTo(map)
      .bindPopup('Fish starting point!')
      .openPopup();
  }

  // 3. Manual Track Form
  const trackForm = document.getElementById('manualTrackForm');
  if (trackForm) {
    trackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const country = document.getElementById('country').value;
      if (!country) return;
      
      try {
        const response = await fetch('/api/track', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({country})
        });
        if (response.ok) {
          alert('Fish sent to ' + country + '!');
          trackForm.reset();
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  }

  // 4. Post Comment
  window.postComment = async function() {
    const text = document.getElementById('userComment').value.trim();
    if (!text) return;
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text})
      });
      if (response.ok) {
        document.getElementById('userComment').value = '';
        location.reload(); // Reload to show new comment
      }
    } catch (err) {
      alert('Error posting comment');
    }
  };
});
