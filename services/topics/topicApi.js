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