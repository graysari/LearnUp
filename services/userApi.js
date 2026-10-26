
import api from './api';

export const loginUser = async (userName, password) => {
    try {
        const response = await api.post('/User', {
            userName: userName,
            password: password
        });

        return response.data;

    } catch (error) {

        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Response:', error.response.data);

            if (error.response.status === 401) {
                throw new Error('Invalid username or password.');
            }

            throw new Error(
                error.response.data?.message || 'Login failed.'
            );
        }

        console.log('Connection Error:', error.message);

        throw new Error('Cannot connect to the server.');
    }
};
export const updateProfile = async (userId, profileData, token) => {
    try {
        const response = await api.put(
            `/User/Profile/${userId}`,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            }
        );

        return response.data;

    } catch (error) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Response:', error.response.data);


            if(error.response.status === 401){
                throw new Error('Unautorized. Please log in again.');
            }

            if(error.response.status === 403){
                throw new Error('You do not have permission to update this profile');
                
            }

            throw new Error(
                error.response.data?.message ||
                'Failed to update profile.'
            );

            
        }

        throw new Error('Cannot connect to the server.');
    }
};

export const changePassword = async (
    currentPassword,
    newPassword,
    token
) => {
    try {
        const response = await api.put(
            '/User/ChangePassword',
            {
                currentPassword,
                newPassword
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Response:', error.response.data);

            if (error.response.status === 401) {
                throw new Error(
                    'Your session has expired. Please log in again.'
                );
            }

            throw new Error(
                error.response.data?.message ||
                'Failed to change password.'
            );
        }

        throw new Error('Cannot connect to the server.');
    }
};
export const uploadProfilePicture = async (imageUri, token) => {
    const formData = new FormData();

    formData.append('file', {
        uri: imageUri,
        name: 'profile.jpg',
        type: 'image/jpeg',
    });

    const response = await api.post(
        '/User/ProfilePicture',
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': undefined,
            },
            timeout: 30000,
        }
    );

    return response.data;
};
