import { HTTP_METHOD } from '../constants';

const API_BASE_URL = 'http://localhost:3003/todos';

const buildUrl = (type, identifier, { searchText, sortAlphabetically } = {}) => {
  let url = API_BASE_URL;
  
  if (type === HTTP_METHOD.GET) {
    const orderParams = sortAlphabetically 
      ? '_sort=title&_order=asc' 
      : '_sort=id&_order=desc';
    const searchParam = searchText ? `&title_like=${searchText}` : '';
    url += `?${orderParams}${searchParam}`;
  } else if (type !== HTTP_METHOD.POST && identifier) {
    url += `/${identifier}`;
  }
  
  return url;
};

const requestToServer = async (type, { identifier, ...data } = {}) => {
  const url = buildUrl(type, identifier, data);
  const requestSettings = {
    method: type,
    headers: { 'Content-Type': 'application/json' },
  };

  if (type !== HTTP_METHOD.GET && type !== HTTP_METHOD.DELETE) {
    requestSettings.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, requestSettings);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const tasksApi = {
  getTasks: (searchText = '', sortAlphabetically = false) =>
    requestToServer(HTTP_METHOD.GET, { searchText, sortAlphabetically }),
  
  addTask: (taskData) => requestToServer(HTTP_METHOD.POST, taskData),
  
  updateTask: (id, updates) => requestToServer(HTTP_METHOD.PATCH, { identifier: id, ...updates }),
  
  deleteTask: (id) => requestToServer(HTTP_METHOD.DELETE, { identifier: id }),
};
