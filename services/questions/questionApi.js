import api from '../api';

export const getQuestions = async (topicId) => {
  try {
    const response = await api.get(`/Question/api/Topic/${topicId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw `/Question/api/Topic/${topicId} + topicId + "ngaopngaongao" + error`;
  }
};