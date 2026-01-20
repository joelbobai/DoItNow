import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "tasks";

// Privacy statement: This app does not collect, transmit, or share any personal data.
// All data is stored locally on the user’s device.

export const getTasks = async () => {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveTasks = async (tasks) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const addTask = async (title) => {
  const tasks = await getTasks();
  const newTask = { id: createId(), title, completed: false };
  const updated = [newTask, ...tasks];
  await saveTasks(updated);
  return updated;
};

export const toggleTask = async (id) => {
  const tasks = await getTasks();
  const updated = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  await saveTasks(updated);
  return updated;
};

export const deleteTask = async (id) => {
  const tasks = await getTasks();
  const updated = tasks.filter((task) => task.id !== id);
  await saveTasks(updated);
  return updated;
};
