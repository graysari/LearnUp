import api from '../api';


export const getTopics = async (subjectId) => {
  try {
    const response = await api.get(`/Topic/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw `/Topics/${subjectId} + subjectId + "ngaopngaongao" + error`;
  }
};
export const deleteTopic = async (topicId) => {
    const response = await api.delete(`/Topic/${topicId}`);
    return response.data;
};

export const editTopic = async (topicId, payload) => {
    const response = await api.put(
        `/Topic/${topicId}`,
        payload
    );

    return response.data;
};


export const getTopicWithGrades = async (subjectId, userId) => {
  try{
    const responce = await api.get(
      `/Topic/TopicGrades/${subjectId}/User/${userId}`
    );
    return responce.data;  

    
  }
  catch(error){
     console.error('Error fetching topic grades:', error);
    throw `/Topic/TopicGrades/${subjectId}/User/${userId}`;

  }

}
export const addTopic = async (payload) => {
    try {
        const response = await api.post('/Topic', payload);
        return response.data;
    } catch (error) {
        console.log(
            'Add topic error:',
            error.response?.data ?? error.message
        );
        throw error;
    }
};