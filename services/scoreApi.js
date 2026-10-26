import api from './api';

export const postScore = async (
    percentageScore,
    totalNumberOfQuestions,
    topicId,
    userId
) => {
    const response = await api.post(`/Score`, {
        percentageScore,
        totalNumberOfQuestions,
        topicId,
        userId
    });

    return response.data;
};