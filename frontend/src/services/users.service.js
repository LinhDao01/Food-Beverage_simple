import { DEFAULT_AVATAR } from '@/constants';

/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */

// hàm bất đồng bộ để  thực hiện yêu cầu HTTP đến một URL được chỉ định
async function efetch(url, options = {}) {
  let result = {};
  let json = {};

  try {
    result = await fetch(url, options);
    json = await result.json();
  } catch (error) {
    throw new Error(error.message);
  }

  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message);
  } 

  return json.data;
}

function userService() {
  const baseUrl = '/api/v1/users';

  async function fetchUser(id) {
    const { user } = await efetch(`${baseUrl}/${id}`);
    return {
      ...user,
      avatar: user.avatar ?? DEFAULT_AVATAR
    };
  }
  
  async function createUser(user) {
    return efetch(`${baseUrl}/signup`, {
      method: 'POST',
      body: user
    });
  } 

  async function login(email, password) {
    return efetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
  }

  async function updateUser(id, user) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: user
    });
  }

  async function deleteUser(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }

  return {
    fetchUser,
    login,
    createUser,
    updateUser,
    deleteUser
  };
}

export default userService();