import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

const getDueDateInfo = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  if (dateStr < today) return { text: "Overdue", style: "overdue" };
  if (dateStr === today) return { text: "Due today", style: "today" };
  if (dateStr === tomorrow) return { text: "Due tomorrow", style: "future" };

  const date = new Date(dateStr + "T00:00:00");
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return { text: `Due ${formatted}`, style: "future" };
};

const TaskItem = ({ task, onToggle, onDelete }) => {
  const router = useRouter();
  const dueInfo = getDueDateInfo(task.dueDate);

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
          onPress={() =>
            router.push({
              pathname: "/add",
              params: {
                editId: task.id,
                editTitle: task.title,
                editDueDate: task.dueDate || "",
              },
            })
          }
          style={styles.editButton}
        >
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onDelete(task.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Remove</Text>
        </Pressable>
      </View>
      <View style={styles.divider} />
      <View style={styles.captionRow}>
        {dueInfo && !task.completed && (
          <Text
            style={[
              styles.dueBadge,
              dueInfo.style === "overdue" && styles.dueOverdue,
              dueInfo.style === "today" && styles.dueToday,
              dueInfo.style === "future" && styles.dueFuture,
            ]}
          >
            {dueInfo.text}
          </Text>
        )}
        <Text style={styles.caption}>
          {task.completed
            ? "Completed"
            : dueInfo
              ? ""
              : "Tap the box to finish"}
        </Text>
      </View>
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
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    marginRight: 6,
  },
  editText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
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
  captionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  caption: {
    fontSize: 12,
    color: "#64748B",
  },
  dueBadge: {
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
    overflow: "hidden",
  },
  dueOverdue: {
    backgroundColor: "#FEF2F2",
    color: "#DC2626",
  },
  dueToday: {
    backgroundColor: "#FFF7ED",
    color: "#EA580C",
  },
  dueFuture: {
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
  },
});

export default TaskItem;
