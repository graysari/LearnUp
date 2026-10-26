import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addSubject, editSubject } from "../services/subjects/subjectApi";

export default function AddSubject({ navigation, route }) {
  const ALL_OUTLINE_ICONS = Object.keys(Ionicons.glyphMap)
    .filter((name) => name.endsWith("-outline"))
    .sort();

  const [iconModalVisible, setIconModalVisible] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const filteredIcons = useMemo(() => {
    const keyword = iconSearch.trim().toLowerCase();

    return ALL_OUTLINE_ICONS.filter((name) =>
      name.toLowerCase().includes(keyword),
    );
  }, [iconSearch]);

  const handleSelectIcon = (selectedIcon) => {
    setIcon(selectedIcon);
    setIconModalVisible(false);
    setIconSearch("");
  };

  const subject = route.params?.subject;
  const isEditing = Boolean(subject);

  const [name, setName] = useState(subject?.name ?? "");
  const [grade, setGrade] = useState(
    String(subject?.gradeId ?? subject?.grade ?? 4),
  );
  const [icon, setIcon] = useState(subject?.icon ?? "book-outline");
  const [gradeOpen, setGradeOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (payload) => {
    return await addSubject(payload);
  };

  const handleEdit = async (subjectId, payload) => {
    return await editSubject(subjectId, payload);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter a subject name.");
      return;
    }

    const payload = {
      name: name.trim(),
      icon,
      gradeId: Number(grade),
    };

    try {
      setSaving(true);

      if (isEditing) {
        await handleEdit(subject.id, payload);
      } else {
        await handleAdd(payload);
      }

      Alert.alert(
        "Success",
        isEditing
          ? "Subject updated successfully."
          : "Subject added successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log("Save subject error:", error.response?.data ?? error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to save subject.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Subject" : "Add Subject"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewSection}>
          <View style={styles.previewOuter}>
            <Ionicons name={icon} size={43} color="#6366F1" />
          </View>
          <Text style={styles.previewHint}>Tap an icon below to change</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Subject Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mathematics"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Grade Level <Text style={styles.required}>*</Text>
          </Text>

          <Pressable
            style={styles.gradeSelector}
            onPress={() => setGradeOpen(!gradeOpen)}
          >
            <Text style={styles.gradeValue}>Grade {grade}</Text>
            <Ionicons
              name={gradeOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#0F172A"
            />
          </Pressable>

          {gradeOpen && (
            <View style={styles.gradeOptions}>
              {Array.from({ length: 6 }, (_, i) => i + 1).map((value) => (
                <Pressable
                  key={value}
                  style={styles.gradeOption}
                  onPress={() => {
                    setGrade(String(value));
                    setGradeOpen(false);
                  }}
                >
                  <Text style={styles.gradeValue}>Grade {value}</Text>
                  {grade === String(value) && (
                    <Ionicons name="checkmark" size={18} color="#6366F1" />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Icon <Text style={styles.required}>*</Text>
          </Text>

          <Pressable
            style={styles.iconPickerButton}
            onPress={() => setIconModalVisible(true)}
          >
            <View style={styles.selectedIconContainer}>
              <Ionicons name={icon} size={28} color="#6366F1" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.selectedIconTitle}>Select Icon</Text>

              <Text style={styles.selectedIconName}>{icon}</Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, saving && { opacity: 0.65 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveText}>
              {isEditing ? "Update Subject" : "Save Subject"}
            </Text>
          )}
        </Pressable>
      </View>

      <Modal
        visible={iconModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIconModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.iconModal}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Choose an Icon</Text>

                <Text style={styles.modalSubtitle}>
                  {filteredIcons.length} icons available
                </Text>
              </View>

              <Pressable onPress={() => setIconModalVisible(false)}>
                <Ionicons name="close" size={25} color="#64748B" />
              </Pressable>
            </View>

            {/* Search */}
            <View style={styles.iconSearchContainer}>
              <Ionicons name="search-outline" size={20} color="#94A3B8" />

              <TextInput
                style={styles.iconSearchInput}
                placeholder="Search icons..."
                placeholderTextColor="#94A3B8"
                value={iconSearch}
                onChangeText={setIconSearch}
                autoCorrect={false}
              />
            </View>

            {/* All Outline Icons */}
            <FlatList
              data={filteredIcons}
              keyExtractor={(item) => item}
              numColumns={4}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.iconGrid}
              columnWrapperStyle={styles.iconRow}
              initialNumToRender={32}
              maxToRenderPerBatch={32}
              renderItem={({ item }) => {
                const isSelected = icon === item;

                return (
                  <Pressable
                    style={[
                      styles.iconGridItem,
                      isSelected && styles.iconGridSelected,
                    ]}
                    onPress={() => handleSelectIcon(item)}
                  >
                    <Ionicons
                      name={item}
                      size={27}
                      color={isSelected ? "#6366F1" : "#64748B"}
                    />

                    <Text style={styles.iconGridLabel} numberOfLines={2}>
                      {item.replace("-outline", "")}
                    </Text>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.noIconsText}>No matching icons found.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  iconPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },

  selectedIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedIconTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  selectedIconName: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },

  iconModal: {
    height: "85%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 22,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  modalSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },

  iconSearchContainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 16,
  },

  iconSearchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },

  iconGrid: {
    paddingBottom: 30,
  },

  iconRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  iconGridItem: {
    width: "23%",
    minHeight: 83,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 6,
    gap: 8,
  },

  iconGridSelected: {
    backgroundColor: "#EEF2FF",
    borderWidth: 2,
    borderColor: "#6366F1",
  },

  iconGridLabel: {
    fontSize: 10,
    color: "#64748B",
    textAlign: "center",
  },

  noIconsText: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 35,
  },
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 18,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  previewSection: {
    alignItems: "center",
    paddingTop: 35,
    paddingBottom: 42,
  },
  previewOuter: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "#E8ECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  previewHint: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 14,
  },
  fieldGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    height: 54,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
    fontSize: 15,
  },
  gradeSelector: {
    height: 54,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gradeValue: {
    fontSize: 15,
    color: "#0F172A",
  },
  gradeOptions: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    marginTop: 6,
    overflow: "hidden",
  },
  gradeOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  iconList: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 5,
    paddingHorizontal: 3,
  },
  iconOption: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  iconSelected: {
    borderWidth: 2,
    borderColor: "#6366F1",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#F7FAFC",
  },
  saveButton: {
    height: 54,
    backgroundColor: "#6366F1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 35,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
