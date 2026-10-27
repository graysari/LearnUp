
import React, { useState, useMemo } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  addQuestion,
  editQuestion,
  deleteQuestion,
} from "../services/questions/questionApi";

const COLORS = {
  primary: "#4355FF",
  background: "#F7FAFC",
  white: "#FFFFFF",
  text: "#0F172A",
  secondary: "#64748B",
  border: "#DCE5F1",
  lightPrimary: "#EEF2FF",
  danger: "#EF4444",
  greenLight: "#E3F7EE",
};

const getTopicId = (topic) =>
  topic.topicId ?? topic.id;

const getTopicName = (topic) =>
  topic.topicName ?? topic.name ?? "Untitled Topic";

export default function AddQuestion({
  navigation,
  route,
}) {
  const {
    subjectId,
    subjectName = "Subject",
    subjectIcon = "book-outline",
    gradeId,
    subjectDescription = "",
    topicId: initialTopicId = null,
    topics = [],
    question = null,
  } = route.params ?? {};

  const isEditing = Boolean(question);

  const questionId =
    question?.questionId ?? question?.id;

  // Existing database stores the correct answer
  // separately from three incorrect choices.
  const initialCorrectAnswer =
    question?.correctAnswer ??
    question?.correct_answer ??
    "";

  const initialIncorrectChoices = [
    question?.choice1 ?? question?.choice_1 ?? "",
    question?.choice2 ?? question?.choice_2 ?? "",
    question?.choice3 ?? question?.choice_3 ?? "",
  ];

  const initialChoices = isEditing
    ? [
        initialCorrectAnswer,
        ...initialIncorrectChoices,
      ]
    : ["", "", "", ""];

  const [selectedTopicId, setSelectedTopicId] =
    useState(
      question?.topicId ??
        question?.topic_id ??
        initialTopicId
    );

  const [questionText, setQuestionText] =
    useState(
      question?.questionText ??
        question?.question_text ??
        ""
    );

  const [choices, setChoices] =
    useState(initialChoices);

  const [correctIndex, setCorrectIndex] =
    useState(isEditing ? 0 : null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [answerPickerVisible, setAnswerPickerVisible] =
    useState(false);

  const availableTopics = useMemo(() => {
    return Array.isArray(topics) ? topics : [];
  }, [topics]);

  const updateChoice = (index, value) => {
    setChoices((previous) =>
      previous.map((choice, i) =>
        i === index ? value : choice
      )
    );
  };

  const handleSave = async () => {
    if (saving) return;

    if (selectedTopicId == null) {
      Alert.alert(
        "Required",
        "Please select a topic."
      );
      return;
    }

    if (!questionText.trim()) {
      Alert.alert(
        "Required",
        "Please enter the question text."
      );
      return;
    }

    if (!choices[0].trim() || !choices[1].trim()) {
      Alert.alert(
        "Required",
        "Please enter at least two answer choices."
      );
      return;
    }

    if (correctIndex == null) {
      Alert.alert(
        "Required",
        "Please select the correct answer."
      );
      return;
    }

    if (!choices[correctIndex]?.trim()) {
      Alert.alert(
        "Required",
        "The selected correct answer is empty."
      );
      return;
    }

    const correctAnswer =
      choices[correctIndex].trim();

    const incorrectChoices = choices
      .filter((_, index) => index !== correctIndex)
      .map((choice) => choice.trim());

    const payload = {
      questionText: questionText.trim(),
      correctAnswer,
      choice1: incorrectChoices[0] || null,
      choice2: incorrectChoices[1] || null,
      choice3: incorrectChoices[2] || null,
      topicId: Number(selectedTopicId),
    };

    try {
      setSaving(true);

      if (isEditing) {
        if (questionId == null) {
          throw new Error("Question ID is missing.");
        }

        await editQuestion(questionId, payload);
      } else {
        await addQuestion(payload);
      }

      Alert.alert(
        "Success",
        isEditing
          ? "Question updated successfully."
          : "Question added successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        "Save question error:",
        error.response?.data ?? error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ??
          error.message ??
          "Unable to save question."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (questionId == null) return;

    Alert.alert(
      "Delete Question",
      "Are you sure you want to delete this question?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);

              await deleteQuestion(questionId);

              Alert.alert(
                "Deleted",
                "Question deleted successfully.",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              console.log(
                "Delete question error:",
                error.response?.data ?? error.message
              );

              Alert.alert(
                "Error",
                error.response?.data?.message ??
                  "Unable to delete question."
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const renderTopicButton = (topic) => {
    const id = getTopicId(topic);

    const active =
      String(selectedTopicId) === String(id);

    return (
      <Pressable
        key={String(id)}
        style={[
          styles.topicButton,
          active && styles.topicButtonActive,
        ]}
        onPress={() => setSelectedTopicId(id)}
      >
        <Text
          style={[
            styles.topicButtonText,
            active && styles.topicButtonTextActive,
          ]}
          numberOfLines={1}
        >
          {getTopicName(topic)}
        </Text>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.text}
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          {isEditing
            ? "Edit Question"
            : "Add Question"}
        </Text>

        {isEditing ? (
          <Pressable
            style={styles.headerAction}
            onPress={handleDelete}
            disabled={deleting || saving}
          >
            {deleting ? (
              <ActivityIndicator
                size="small"
                color={COLORS.danger}
              />
            ) : (
              <Ionicons
                name="trash-outline"
                size={22}
                color={COLORS.danger}
              />
            )}
          </Pressable>
        ) : (
          <View style={styles.headerAction} />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Subject */}
        <View style={styles.subjectCard}>
          <View style={styles.subjectIconContainer}>
            <Ionicons
              name={subjectIcon || "book-outline"}
              size={35}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.subjectDetails}>
            <Text style={styles.subjectName}>
              {subjectName || "Subject"}
            </Text>

            {gradeId != null && (
              <Text style={styles.subjectGrade}>
                Grade {gradeId}
              </Text>
            )}

            {!!subjectDescription && (
              <Text
                style={styles.subjectDescription}
                numberOfLines={2}
              >
                {subjectDescription}
              </Text>
            )}
          </View>
        </View>

        {/* Topic */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Topic <Text style={styles.required}>*</Text>
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.topicScrollContent}
          >
            {availableTopics.map(renderTopicButton)}
          </ScrollView>

          {availableTopics.length === 0 && (
            <Text style={styles.helperText}>
              No topics available for this subject.
            </Text>
          )}
        </View>

        {/* Question text */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Question Text{" "}
            <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.questionInputContainer}>
            <TextInput
              style={styles.questionInput}
              placeholder="Enter the question here..."
              placeholderTextColor="#94A3B8"
              value={questionText}
              onChangeText={setQuestionText}
              maxLength={500}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.questionCount}>
              {questionText.length}/500
            </Text>
          </View>
        </View>

        {/* Choices */}
        {choices.map((choice, index) => (
          <View
            key={index}
            style={styles.choiceGroup}
          >
            <Text style={styles.label}>
              Choice {index + 1}{" "}
              {index < 2 && (
                <Text style={styles.required}>*</Text>
              )}
            </Text>

            <View style={styles.choiceRow}>
              <TextInput
                style={styles.choiceInput}
                placeholder={`Enter choice ${index + 1}`}
                placeholderTextColor="#94A3B8"
                value={choice}
                onChangeText={(value) =>
                  updateChoice(index, value)
                }
              />

              <Pressable
                style={styles.radioButton}
                onPress={() => setCorrectIndex(index)}
              >
                <Ionicons
                  name={
                    correctIndex === index
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={25}
                  color={
                    correctIndex === index
                      ? COLORS.primary
                      : "#A5B4CF"
                  }
                />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Correct answer */}
        <View style={styles.correctAnswerCard}>
          <Text style={styles.correctAnswerLabel}>
            Correct Answer{" "}
            <Text style={styles.required}>*</Text>
          </Text>

          <Pressable
            style={styles.answerSelector}
            onPress={() =>
              setAnswerPickerVisible(
                !answerPickerVisible
              )
            }
          >
            <Text
              style={[
                styles.answerSelectorText,
                correctIndex == null &&
                  styles.answerPlaceholder,
              ]}
              numberOfLines={1}
            >
              {correctIndex == null
                ? "Select correct answer"
                : `Choice ${correctIndex + 1} (${choices[correctIndex] || "Empty"})`}
            </Text>

            <Ionicons
              name={
                answerPickerVisible
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={19}
              color={COLORS.text}
            />
          </Pressable>

          {answerPickerVisible && (
            <View style={styles.answerOptions}>
              {choices.map((choice, index) => (
                <Pressable
                  key={index}
                  style={styles.answerOption}
                  onPress={() => {
                    setCorrectIndex(index);
                    setAnswerPickerVisible(false);
                  }}
                >
                  <Text
                    style={styles.answerOptionText}
                    numberOfLines={2}
                  >
                    Choice {index + 1}:{" "}
                    {choice || "(Empty)"}
                  </Text>

                  {correctIndex === index && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Save */}
        <Pressable
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving || deleting}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <>
              <Ionicons
                name={
                  isEditing
                    ? "checkmark-circle-outline"
                    : "add-circle-outline"
                }
                size={23}
                color="#FFFFFF"
              />

              <Text style={styles.saveButtonText}>
                {isEditing
                  ? "Update Question"
                  : "Save Question"}
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
  },

  backButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.text,
  },

  headerAction: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 16,
    padding: 13,
    marginBottom: 20,
    gap: 13,
  },

  subjectIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 16,
    backgroundColor: "#DFE5FF",
    alignItems: "center",
    justifyContent: "center",
  },

  subjectDetails: {
    flex: 1,
  },

  subjectName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  subjectGrade: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },

  subjectDescription: {
    fontSize: 12,
    color: "#7185A6",
    marginTop: 5,
  },

  fieldGroup: {
    marginBottom: 19,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
  },

  required: {
    color: COLORS.danger,
  },

  topicScrollContent: {
    gap: 7,
  },

  topicButton: {
    minHeight: 39,
    paddingHorizontal: 13,
    backgroundColor: "#F0F3FA",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  topicButtonActive: {
    backgroundColor: COLORS.primary,
  },

  topicButtonText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },

  topicButtonTextActive: {
    color: "#FFFFFF",
  },

  helperText: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 7,
  },

  questionInputContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
  },

  questionInput: {
    minHeight: 105,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 30,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },

  questionCount: {
    position: "absolute",
    right: 12,
    bottom: 9,
    fontSize: 11,
    color: "#7185A6",
  },

  choiceGroup: {
    marginBottom: 15,
  },

  choiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  choiceInput: {
    flex: 1,
    height: 43,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 13,
    fontSize: 14,
    color: COLORS.text,
  },

  radioButton: {
    width: 28,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
  },

  correctAnswerCard: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 12,
    padding: 10,
    marginTop: 2,
    marginBottom: 12,
  },

  correctAnswerLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  answerSelector: {
    minHeight: 41,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  answerSelectorText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },

  answerPlaceholder: {
    color: "#94A3B8",
  },

  answerOptions: {
    backgroundColor: COLORS.white,
    borderRadius: 9,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },

  answerOption: {
    minHeight: 43,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  answerOptionText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },

  saveButton: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  saveButtonDisabled: {
    opacity: 0.65,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
});
