import { TASKS_ACTIONS } from '../../constants';

const initialState = {
  items: [],
  editingId: null,
};

export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case TASKS_ACTIONS.SET_TASKS:
      return {
        ...state,
        items: action.payload,
      };

    case TASKS_ACTIONS.ADD_TASK: {
      const existingTaskIndex = state.items.findIndex(
        task => task.id === action.payload.id
      );
      
      if (existingTaskIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingTaskIndex] = action.payload;
        return {
          ...state,
          items: updatedItems,
        };
      }

      return {
        ...state,
        items: [action.payload, ...state.items],
      };
    }

    case TASKS_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        items: state.items.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };

    case TASKS_ACTIONS.DELETE_TASK:
      return {
        ...state,
        items: state.items.filter(task => task.id !== action.payload),
        editingId: state.editingId === action.payload ? null : state.editingId,
      };

    case TASKS_ACTIONS.SET_EDITING_ID:
      return {
        ...state,
        editingId: action.payload,
        items: state.items.map(task =>
          task.id === action.payload
            ? { ...task, isEditing: true }
            : { ...task, isEditing: false }
        ),
      };

    case TASKS_ACTIONS.CLEAR_EDITING_ID:
      return {
        ...state,
        editingId: null,
        items: state.items.map(task => ({
          ...task,
          isEditing: false,
        })),
      };

    case TASKS_ACTIONS.UPDATE_TASK_TITLE:
      return {
        ...state,
        items: state.items.map(task =>
          task.id === action.payload.id
            ? { ...task, title: action.payload.title }
            : task
        ),
      };

    default:
      return state;
  }
};