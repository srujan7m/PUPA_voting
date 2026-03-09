import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

// Attach a browser-generated voter UUID to every request so API routes
// can identify voters without requiring authentication.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    let id = localStorage.getItem('pupa_voter_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('pupa_voter_id', id);
    }
    config.headers['X-Voter-Token'] = id;
  }
  return config;
});

// Teams
export const fetchTeams = () => api.get('/api/teams');
export const fetchTeam = (id: number | string) => api.get(`/api/team/${id}`);

// Voting
export const submitVote = (teamId: number) => api.post('/api/vote', { teamId });
export const fetchVoteStatus = () => api.get('/api/votes/status');

// Leaderboard
export const fetchLeaderboard = () => api.get('/api/leaderboard');

export default api;
