const matchesContainer = document.getElementById('matches');

fetch('/api/matches')
  .then(res => {
    if (!res.ok) throw new Error('Network response was not OK');
    return res.json();
  })
  .then(data => {
    console.log('Received match data:', data);

    if (!data || data.length === 0) {
      matchesContainer.innerHTML = '<p>No upcoming matches found.</p>';
      return;
    }

    data.sort((a, b) => {
      const dateA = new Date(a.strTimestamp);
      const dateB = new Date(b.strTimestamp);
      return dateA - dateB;
    });

    data.forEach(game => {
      const card = document.createElement('div');
      card.classList.add('match-card');

      const homeTeam = game.strHomeTeam || 'TBD';
      const awayTeam = game.strAwayTeam || 'TBD';

      let matchDate = 'Date & Time not available';
      if (game.strTimestamp) {
        const parsedDate = new Date(game.strTimestamp);
        if (!isNaN(parsedDate.getTime())) {
          matchDate = parsedDate.toLocaleString();
        }
      }

      card.innerHTML = `
        <h3>${homeTeam} vs ${awayTeam}</h3>
        <p><strong>Date & Time:</strong> ${matchDate}</p>
      `;

      matchesContainer.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error fetching match data:', error);
    matchesContainer.innerHTML = '<p>Failed to load match data. Please try again later.</p>';
  });
