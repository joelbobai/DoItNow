import { Pressable, StyleSheet, Text, View } from "react-native";

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: task.completed }}
          onPress={() => onToggle(task.id)}
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        >
          {task.completed && <View style={styles.checkboxInner} />}
        </Pressable>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => onDelete(task.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Remove</Text>
        </Pressable>
      </View>
      <View style={styles.divider} />
      <Text style={styles.caption}>
        {task.completed ? "Completed" : "Tap the box to finish"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    borderColor: "#1D4ED8",
    backgroundColor: "#1D4ED8",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "600",
  },
  titleCompleted: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
  },
  deleteText: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 12,
    marginBottom: 8,
  },
  caption: {
    fontSize: 12,
    color: "#64748B",
  },
});

export default TaskItem;
