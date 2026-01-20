import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import TaskItem from "../components/TaskItem";
import { deleteTask, getTasks, toggleTask } from "../storage/taskStorage";

const TaskListScreen = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  const loadTasks = useCallback(async () => {
    const stored = await getTasks();
    setTasks(stored);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const handleToggle = async (id) => {
    const updated = await toggleTask(id);
    setTasks(updated);
  };

  const handleDelete = async (id) => {
    const updated = await deleteTask(id);
    setTasks(updated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Do It Now</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={handleToggle} onDelete={handleDelete} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks yet. Add one to get started.</Text>
          }
          contentContainerStyle={
            tasks.length === 0 ? styles.emptyContainer : styles.listContent
          }
        />
        <Pressable style={styles.addButton} onPress={() => router.push("/add")}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B1B1B",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#8A8A8A",
    textAlign: "center",
  },
  addButton: {
    margin: 16,
    backgroundColor: "#2F6FED",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TaskListScreen;
