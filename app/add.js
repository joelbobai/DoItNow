import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { addTask } from "../storage/taskStorage";

const AddTaskScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    await addTask(trimmed);
    setTitle("");
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <Text style={styles.label}>Task title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="What do you need to do?"
          placeholderTextColor="#A0A0A0"
          style={styles.input}
        />
        <Pressable
          style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Task</Text>
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
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: "#1B1B1B",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1B1B1B",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#2F6FED",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
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
    marginTop: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#2F6FED",
    fontSize: 16,
  },
});

export default AddTaskScreen;
