import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1', // Localhost for web
});

export const getReports = async () => {
    const response = await api.get('/reports');
    return response.data;
};

export const getActiveUsers = async () => {
    const response = await api.get('/users/active');
    return response.data;
};

export const getSolutions = async () => {
    const response = await api.get('/solutions');
    return response.data;
};

// Admin Action: Solve a report
export const submitSolution = async (solutionData) => {
    const response = await api.post('/solutions/solve', solutionData);
    return response.data;
};

export const verifyReport = async (id, status) => {
    const formData = new FormData();
    formData.append('status', status);
    const response = await api.patch(`/reports/${id}/verify`, formData);
    return response.data;
};

export const registerAdmin = async (userData) => {
    const response = await api.post('/users/register', {
        ...userData,
        role: 'admin',
        username: userData.email.split('@')[0],
        mobile: "0000000000"
    });
    return response.data;
};

export default api;