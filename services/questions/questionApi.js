import api from '../api';

export const getQuestions = async (topicId) => {
  try {
    const response = await api.get(`/Questions/Topic/${topicId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw `/Questions/Topic/${topicId} + topicId + "ngaopngaongao" + error`;
  }
};

export const addQuestion = async (payload) => {
  const response = await api.post("/Questions", payload);
  return response.data;
};

export const editQuestion = async (questionId, payload) => {
  const response = await api.put(
    `/Questions/${questionId}`,
    payload
  );
  return response.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await api.delete(
    `/Questions/${questionId}`
  );
  return response.data;
};