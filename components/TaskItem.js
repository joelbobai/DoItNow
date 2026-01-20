import { Pressable, StyleSheet, Text, View } from "react-native";

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
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
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#2F6FED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    borderColor: "#2F6FED",
    backgroundColor: "#2F6FED",
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
    color: "#1B1B1B",
  },
  titleCompleted: {
    color: "#8A8A8A",
    textDecorationLine: "line-through",
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    color: "#2F6FED",
    fontSize: 14,
  },
});

export default TaskItem;
