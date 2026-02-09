import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskItem from "../components/TaskItem";
import {
  addTask,
  clearCompleted,
  deleteTask,
  getTasks,
  toggleTask,
} from "../storage/taskStorage";

const TaskListScreen = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const loadTasks = useCallback(async () => {
    const stored = await getTasks();
    setTasks(stored);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  const handleToggle = async (id) => {
    const updated = await toggleTask(id);
    setTasks(updated);
  };

  const handleDelete = async (id) => {
    const updated = await deleteTask(id);
    setTasks(updated);
  };

  const handleClearCompleted = async () => {
    const updated = await clearCompleted();
    setTasks(updated);
  };

  const handleQuickAdd = async (title) => {
    const updated = await addTask(title);
    setTasks(updated);
    setFilter("all");
  };

  const quickAddOptions = [
    "Review priorities",
    "Reply to emails",
    "Plan tomorrow",
    "Take a walk",
  ];

  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const active = total - completed;
    const progress = total ? completed / total : 0;
    return { total, completed, active, progress };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  }, [filter, tasks]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Do It Now</Text>
          <Text style={styles.subtitle}>
            Plan, focus, and finish strong today.
          </Text>
        </View>
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsLabel}>Today's progress</Text>
              <Text style={styles.statsValue}>
                {summary.completed}/{summary.total} complete
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={handleClearCompleted}
              style={[
                styles.clearButton,
                summary.completed === 0 && styles.clearButtonDisabled,
              ]}
              disabled={summary.completed === 0}
            >
              <Text style={styles.clearButtonText}>Clear done</Text>
            </Pressable>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(summary.progress * 100)}%` },
              ]}
            />
          </View>
          <View style={styles.statsFooter}>
            <Text style={styles.statsFooterText}>{summary.active} active</Text>
            <Text style={styles.statsFooterText}>{summary.completed} done</Text>
          </View>
        </View>
        <View style={styles.quickAddCard}>
          <Text style={styles.quickAddTitle}>Quick add</Text>
          <Text style={styles.quickAddSubtitle}>
            Suggestions that work without extra permissions.
          </Text>
          <View style={styles.quickAddRow}>
            {quickAddOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => handleQuickAdd(option)}
                style={styles.quickAddChip}
                accessibilityRole="button"
              >
                <Text style={styles.quickAddChipText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.filterRow}>
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "completed", label: "Completed" },
          ].map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[
                styles.filterChip,
                filter === item.key && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item.key && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No tasks here yet</Text>
              <Text style={styles.emptyText}>
                Add a task and it will show up in your list.
              </Text>
            </View>
          }
          contentContainerStyle={
            filteredTasks.length === 0 ? styles.emptyList : styles.listContent
          }
        />
        <Pressable style={styles.addButton} onPress={() => router.push("/add")}>
          <Text style={styles.addButtonText}>Add Task</Text>
          <Text style={styles.addButtonSubtext}>Stay on top of today</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#64748B",
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsLabel: {
    fontSize: 13,
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  clearButton: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  clearButtonDisabled: {
    opacity: 0.5,
  },
  clearButtonText: {
    color: "#1D4ED8",
    fontWeight: "600",
    fontSize: 13,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    marginTop: 14,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#2563EB",
  },
  statsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statsFooterText: {
    fontSize: 12,
    color: "#64748B",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterChip: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: "#1D4ED8",
  },
  filterText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 140,
  },
  quickAddCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  quickAddTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  quickAddSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#64748B",
  },
  quickAddRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  quickAddChip: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 10,
  },
  quickAddChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  addButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#1D4ED8",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  addButtonSubtext: {
    color: "#E0E7FF",
    fontSize: 12,
    marginTop: 4,
  },
});

export default TaskListScreen;
