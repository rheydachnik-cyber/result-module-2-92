import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controls, TaskItem } from './components';
import {
  fetchTasks,
  createTempTask,
  setEditingTask,
  updateTaskTitle,
  saveTask,
  deleteTaskAsync,
  deleteTask,
  setSearchText,
  setSortMode,
  updateTaskAsync,
  clearEditingTask,
} from './store/actions/tasksActions';
import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();
  const { items: taskList } = useSelector((state) => state.tasks);
  const { searchText, sortAlphabetically } = useSelector((state) => state.filter);
  const { loading, error } = useSelector((state) => state.ui);
  
  const isFirstRender = useRef(true);

  const handleTaskAddition = useCallback(() => {
    const hasTempTask = taskList.some(task => task.id === 'FRESH_TASK_ID');
    if (hasTempTask) {
      dispatch(deleteTask('FRESH_TASK_ID'));
      dispatch(clearEditingTask());
    }
    dispatch(createTempTask());
  }, [dispatch, taskList]);

  const handleTaskStoring = useCallback((taskId) => {
    const task = taskList.find((t) => t.id === taskId);
    if (task) {
      if (!task.title || !task.title.trim()) {
        if (taskId === 'FRESH_TASK_ID') {
          dispatch(deleteTask(taskId));
          dispatch(clearEditingTask());
        }
        return;
      }

      dispatch(saveTask(taskId, task.title, task.completed));
    }
  }, [dispatch, taskList]);

  const handleTaskModification = useCallback((id) => {
    if (id !== 'FRESH_TASK_ID') {
      dispatch(setEditingTask(id));
    }
  }, [dispatch]);

  const handleTaskTitleAlteration = useCallback((id, newTitle) => {
    dispatch(updateTaskTitle(id, newTitle));
  }, [dispatch]);

  const handleTaskStatusToggle = useCallback((id, newStatus) => {
    if (id !== 'FRESH_TASK_ID') {
      dispatch(updateTaskAsync(id, { completed: newStatus }));
    }
  }, [dispatch]);

  const handleTaskDeletion = useCallback((id) => {
    if (id === 'FRESH_TASK_ID') {
      dispatch(deleteTask(id));
      dispatch(clearEditingTask());
    } else {
      dispatch(deleteTaskAsync(id));
    }
  }, [dispatch]);

  const handleFilterChange = useCallback((text) => {
    dispatch(setSearchText(text));
  }, [dispatch]);

  const handleSortToggle = useCallback((sortAlphabetically) => {
    dispatch(setSortMode(sortAlphabetically));
  }, [dispatch]);

  useEffect(() => {
    const hasTempTask = taskList.some(task => task.id === 'FRESH_TASK_ID');
    if (!hasTempTask) {
      dispatch(fetchTasks());
    }
  }, [searchText, sortAlphabetically, dispatch]);
  useEffect(() => {
    const hasTempTask = taskList.some(task => task.id === 'FRESH_TASK_ID');
    if (hasTempTask) {
      dispatch(deleteTask('FRESH_TASK_ID'));
      dispatch(clearEditingTask());
    }
  }, []);

  if (loading) return <div className={styles.appContainer}>Загрузка...</div>;
  if (error) return <div className={styles.appContainer}>Ошибка: {error}</div>;

  return (
    <div className={styles.appContainer}>
      <Controls
        onAddTask={handleTaskAddition}
        onFilterChange={handleFilterChange}
        onSortToggle={handleSortToggle}
      />
      <div className={styles.tasksArea}>
        {taskList.length > 0 ? (
          taskList.map(({ id, title, completed, isEditing = false }) => (
            <TaskItem
              key={id}
              identifier={id}
              title={title}
              completed={completed}
              isEditing={isEditing}
              onEditRequest={() => handleTaskModification(id)}
              onTitleUpdate={(newTitle) => handleTaskTitleAlteration(id, newTitle)}
              onStatusChange={(newStatus) =>
                handleTaskStatusToggle(id, newStatus)
              }
              onSaveRequest={() => handleTaskStoring(id)}
              onDeleteRequest={() => handleTaskDeletion(id)}
            />
          ))
        ) : (
          <div className={styles.tasksArea}>Нет задач</div>
        )}
      </div>
    </div>
  );
};