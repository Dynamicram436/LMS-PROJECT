import apiClient from './axiosConfig';

export const ProgressService = {
    updateVideoProgress: async (userId, courseId, videoId, isCompleted = true) => {
        try {
            const response = await apiClient.post('/exam/video-progress', {
                userId,
                courseId,
                videoId,
                isCompleted
            });
            return response.data;
        } catch (error) {
            console.error('Error updating video progress:', error);
            throw error;
        }
    },

    getUserProgress: async (userId) => {
        try {
            const response = await apiClient.get(`/exam/results/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user progress:', error);
            throw error;
        }
    }
};

export default ProgressService;
