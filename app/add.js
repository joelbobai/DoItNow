import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { addTask, updateTask } from "../storage/taskStorage";
import { SafeAreaView } from "react-native-safe-area-context";

const datePresets = [
  { key: "none", label: "No date" },
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "nextWeek", label: "Next week" },
];

const getDateValue = (preset) => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  switch (preset) {
    case "today":
      return today;
    case "tomorrow":
      return new Date(now.getTime() + 86400000).toISOString().split("T")[0];
    case "nextWeek":
      return new Date(now.getTime() + 7 * 86400000).toISOString().split("T")[0];
    default:
      return null;
  }
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date().toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const AddTaskScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId || null;
  const editTitle = params.editTitle || "";
  const editDueDate = params.editDueDate || "";

  const [title, setTitle] = useState(editTitle);
  const [selectedDate, setSelectedDate] = useState(editDueDate || null);
  const isEditing = !!editId;

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    if (isEditing) {
      await updateTask(editId, {
        title: trimmed,
        dueDate: selectedDate,
      });
    } else {
      await addTask(trimmed, selectedDate);
    }

    setTitle("");
    setSelectedDate(null);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{ title: isEditing ? "Edit Task" : "Add Task" }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{isEditing ? "Edit task" : "New task"}</Text>
          <Text style={styles.subtitle}>
            {isEditing
              ? "Update your task details."
              : "Keep it short, clear, and doable."}
          </Text>
        </View>
        <View style={styles.formCard}>
          <Text style={styles.label}>Task title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What do you need to do?"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
          <Text style={styles.helperText}>
            Tip: start with a verb, like &quot;Review&quot; or &quot;Call&quot;.
          </Text>
        </View>
        <View style={styles.dateCard}>
          <Text style={styles.label}>Due date</Text>
          <View style={styles.dateChipRow}>
            {datePresets.map((preset) => {
              const isActive =
                preset.key === "none"
                  ? !selectedDate
                  : selectedDate === getDateValue(preset.key);
              return (
                <Pressable
                  key={preset.key}
                  onPress={() =>
                    setSelectedDate(
                      preset.key === "none" ? null : getDateValue(preset.key),
                    )
                  }
                  style={[styles.dateChip, isActive && styles.dateChipActive]}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      isActive && styles.dateChipTextActive,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {selectedDate && (
            <Text style={styles.selectedDate}>
              Selected: {formatDisplayDate(selectedDate)}
            </Text>
          )}
        </View>
        <Pressable
          style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? "Save Changes" : "Save Task"}
          </Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </KeyboardAvoidingView>
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
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#64748B",
  },
  label: {
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 8,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0F172A",
  },
  helperText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 10,
  },
  dateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  dateChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  dateChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  dateChipActive: {
    backgroundColor: "#1D4ED8",
  },
  dateChipText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
  dateChipTextActive: {
    color: "#FFFFFF",
  },
  selectedDate: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 8,
  },
  saveButton: {
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#1D4ED8",
    fontSize: 16,
  },
});

export default AddTaskScreen;
