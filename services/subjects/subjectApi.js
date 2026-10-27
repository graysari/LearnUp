import api from '../api';

export const getSubjects = async () => {
    try {
        const response = await api.get(`/Subjects`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subjects:', error);
        throw error;
    }
};
export const deleteSubject = async (subjectId) => {
    const response = await api.delete(
        `/Subjects/${subjectId}`
    );

    return response.data;
};

export const getDailyChallenge = async (userId) => {
    try {
        const response = await api.get(
            `/Subjects/DailyChallenge/${userId}`
        );

        return response.data;

    } catch (error) {
        console.log('Daily Challenge API Error:', error);
        throw error;
    }

};

export const getSubjectsWithProgress = async (userId) => {
    const response = await api.get(
        `/Subjects/Progress/${userId}`
    );

    return response.data;
};

export const getSubjectAverages = async (userId) => {
    try {
        const response = await api.get(
            `/Subjects/Averages/${userId}`
        );

        return response.data;
    } catch (error) {
        console.log(
            'Get Subject Averages Error:',
            error.message
        );

        throw error;
    }
};

export const addSubject = async (payload) => {
    const response = await api.post('/Subjects', payload);
    return response.data;
};

export const editSubject = async (subjectId, payload) => {
    const response = await api.put(
        `/Subjects/${subjectId}`,
        payload
    );
    return response.data;
};

