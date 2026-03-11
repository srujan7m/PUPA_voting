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
export const updateTeamProfile = (
  id: number | string,
  data: { teamName?: string; description?: string; teamMembers?: string; stallImages?: string[]; editPin?: string; currentPin?: string }
) => api.patch(`/api/team/${id}`, data);

// File upload — use native fetch so the browser sets multipart/form-data with
// the correct boundary automatically. Axios can interfere with FormData headers.
export const uploadImage = async (file: File): Promise<{ data: { url: string } }> => {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok) {
    const err: any = new Error(json.error || 'Upload failed');
    err.response = { data: json };
    throw err;
  }
  return { data: json };
};

// Voting — voter submits selection + mobile number for admin verification
export const submitPendingVote = (teamIds: number[], mobileNumber: string) =>
  api.post('/api/votes/pending', { teamIds, mobileNumber });
export const fetchVoteStatus = () => api.get('/api/votes/status');

export default api;
