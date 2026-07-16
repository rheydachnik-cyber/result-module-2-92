import { TASKS_ACTIONS, FILTER_ACTIONS, UI_ACTIONS, FRESH_TASK_ID } from '../../constants';
import { tasksApi } from '../../api/api';

// Task Actions
export const setTasks = (tasks) => ({
  type: TASKS_ACTIONS.SET_TASKS,
  payload: tasks,
});

export const addTask = (task) => ({
  type: TASKS_ACTIONS.ADD_TASK,
  payload: task,
});

export const updateTask = (id, updates) => ({
  type: TASKS_ACTIONS.UPDATE_TASK,
  payload: { id, updates },
});

export const deleteTask = (id) => ({
  type: TASKS_ACTIONS.DELETE_TASK,
  payload: id,
});

export const setEditingTask = (id) => ({
  type: TASKS_ACTIONS.SET_EDITING_ID,
  payload: id,
});

export const clearEditingTask = () => ({
  type: TASKS_ACTIONS.CLEAR_EDITING_ID,
});

export const updateTaskTitle = (id, title) => ({
  type: TASKS_ACTIONS.UPDATE_TASK_TITLE,
  payload: { id, title },
});
export const setLoading = (loading) => ({
  type: UI_ACTIONS.SET_LOADING,
  payload: loading,
});

export const setError = (error) => ({
  type: UI_ACTIONS.SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: UI_ACTIONS.CLEAR_ERROR,
});
export const setSearchText = (text) => ({
  type: FILTER_ACTIONS.SET_SEARCH_TEXT,
  payload: text,
});

export const setSortMode = (sortAlphabetically) => ({
  type: FILTER_ACTIONS.SET_SORT_MODE,
  payload: sortAlphabetically,
});
export const fetchTasks = () => {
  return async (dispatch, getState) => {
    const { filter } = getState();
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const tasks = await tasksApi.getTasks(filter.searchText, filter.sortAlphabetically);
      dispatch(setTasks(Array.isArray(tasks) ? tasks : []));
    } catch (error) {
      console.error('Fetch error:', error);
      dispatch(setError('Не удалось загрузить задачи'));
      dispatch(setTasks([]));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const createTask = (taskData) => {
  return async (dispatch) => {
    try {
      const savedTask = await tasksApi.addTask(taskData);
      dispatch(deleteTask(FRESH_TASK_ID));
      dispatch(addTask(savedTask));
      dispatch(clearEditingTask());
      return savedTask;
    } catch (error) {
      console.error('Create error:', error);
      dispatch(setError('Не удалось создать задачу'));
      throw error;
    }
  };
};

export const updateTaskAsync = (id, updates) => {
  return async (dispatch) => {
    try {
      await tasksApi.updateTask(id, updates);
      dispatch(updateTask(id, updates));
    } catch (error) {
      console.error('Update error:', error);
      dispatch(setError('Не удалось обновить задачу'));
    }
  };
};

export const deleteTaskAsync = (id) => {
  return async (dispatch) => {
    try {
      await tasksApi.deleteTask(id);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error('Delete error:', error);
      dispatch(setError('Не удалось удалить задачу'));
    }
  };
};

export const saveTask = (taskId, title, completed) => {
  return async (dispatch) => {
    if (!title || !title.trim()) {
      if (taskId === FRESH_TASK_ID) {
        dispatch(deleteTask(taskId));
        dispatch(clearEditingTask());
      }
      return;
    }

    if (taskId === FRESH_TASK_ID) {
      await dispatch(createTask({ title, completed }));
    } else {
      await dispatch(updateTaskAsync(taskId, { title }));
      dispatch(clearEditingTask());
    }
  };
};

export const createTempTask = () => {
  return (dispatch, getState) => {
    const { tasks } = getState();
    const hasTempTask = tasks.items.some(task => task.id === FRESH_TASK_ID);
    
    if (!hasTempTask) {
      const newTask = {
        id: FRESH_TASK_ID,
        title: '',
        completed: false,
        isEditing: true,
      };
      dispatch(addTask(newTask));
      dispatch(setEditingTask(FRESH_TASK_ID));
    }
  };
};
