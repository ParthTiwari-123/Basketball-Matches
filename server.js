const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public')); 
const nbaTeams = [134866, 134867, 134868, 134869, 134870, 134871, 134872, 134873, 134874, 134875,
  134876, 134877, 134878, 134879, 134880, 134881, 134882, 134883, 134884, 134885,
  134887, 134888, 134889, 134890, 134891, 134892, 134893, 134894, 134895
];

const euroLeagueTeams = [
  141946, 141947, 141948, 141949, 141950, 141951, 141952, 141953, 141954, 141955
];

const ncaaTeams = [
  138176, 138177, 138178, 138179, 138180, 138181, 138182, 138183
];

const fetchMatchesForTeams = async (teamIds) => {
  const matches = [];

  for (const teamId of teamIds) {
    try {
      const response = await axios.get(`https://www.thesportsdb.com/api/v1/json/123/eventsnext.php?id=${teamId}`);
      console.log(`Response for team ${teamId}:`, response.data);
      if (response.data.events) {
        matches.push(...response.data.events);
      }
    } catch (err) {
      console.error(`Error fetching data for team ID ${teamId}:`, err);
    }
  }

  return matches;
};

app.get('/api/matches', async (req, res) => {
  console.log('Received request for /api/matches');
  try {
    const nbaMatches = await fetchMatchesForTeams(nbaTeams);
    const euroLeagueMatches = await fetchMatchesForTeams(euroLeagueTeams);
    const ncaaMatches = await fetchMatchesForTeams(ncaaTeams);

    const combinedMatches = [
      ...nbaMatches,
      ...euroLeagueMatches,
      ...ncaaMatches
    ];

    if (combinedMatches.length > 0) {
      console.log('Sending combined match data');
      res.json(combinedMatches);
    } else {
      console.error('No upcoming matches found');
      res.status(404).json({ error: 'No upcoming matches found' });
    }
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
