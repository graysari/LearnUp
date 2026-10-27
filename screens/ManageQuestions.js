
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  Modal,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import {
  getQuestions,
  deleteQuestion,
} from "../services/questions/questionApi";

import {
  getTopicWithGrades,
} from "../services/topics/topicApi";

import {
  getSubjects,
} from "../services/subjects/subjectApi";

import { useUser } from "../context/UserContext";

const COLORS = {
  primary: "#4355FF",
  background: "#F7FAFC",
  white: "#FFFFFF",
  text: "#0F172A",
  secondary: "#64748B",
  border: "#E2E8F0",
  lightPrimary: "#EEF2FF",
  danger: "#EF4444",
};

const getSubjectId = (subject) =>
  subject.id ?? subject.subjectId;

const getTopicId = (topic) =>
  topic.topicId ?? topic.id;

const getTopicName = (topic) =>
  topic.topicName ?? topic.name ?? "Untitled Topic";

const getQuestionId = (question) =>
  question.questionId ?? question.id;

const getQuestionText = (question) =>
  question.questionText ??
  question.question_text ??
  "";

export default function ManageQuestions({
  navigation,
  route,
}) {
  // Route parameters must be declared first.
  const {
    subjectId = null,
    subjectName = null,
    subjectIcon = null,
    gradeId = null,
    topicId: initialTopicId = null,
  } = route.params ?? {};

  const { user } = useUser();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] =
    useState(subjectId);

  const [selectedTopicId, setSelectedTopicId] =
    useState(initialTopicId);

  const [subjectPickerVisible, setSubjectPickerVisible] =
    useState(false);

  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] =
    useState(false);

  const [loadError, setLoadError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const requestIdRef = useRef(0);

  // Subject selection is only enabled when no
  // subject was supplied through navigation.
  const canSelectSubject = subjectId == null;

  const selectedSubject = useMemo(() => {
    return subjects.find(
      (item) =>
        String(getSubjectId(item)) ===
        String(selectedSubjectId)
    );
  }, [subjects, selectedSubjectId]);

  const currentSubjectId = selectedSubjectId;

  const currentSubjectName =
    selectedSubject?.name ??
    subjectName ??
    "Select Subject";

  const currentSubjectIcon =
    selectedSubject?.icon ??
    subjectIcon ??
    "book-outline";

  const currentGradeId =
    selectedSubject?.gradeId ??
    selectedSubject?.grade ??
    gradeId;

  // Load subjects for the selection modal.
  const loadSubjects = useCallback(async () => {
    if (!canSelectSubject) return;

    try {
      setLoadingSubjects(true);

      const data = await getSubjects();

      setSubjects(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.log(
        "Load subjects error:",
        error.response?.data ?? error.message
      );

      Alert.alert(
        "Error",
        "Unable to load subjects."
      );
    } finally {
      setLoadingSubjects(false);
    }
  }, [canSelectSubject]);

  // Load topics and questions.
  const loadData = useCallback(
    async (requestId) => {
      if (currentSubjectId == null) {
        setTopics([]);
        setQuestions([]);
        setLoadError(null);
        setLoading(false);
        return;
      }

      if (user?.userId == null) {
        setTopics([]);
        setQuestions([]);
        setLoadError(
          "Unable to identify the current user."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        // Clear old subject data immediately.
        setTopics([]);
        setQuestions([]);

        const topicData = await getTopicWithGrades(
          currentSubjectId,
          user.userId
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        const topicList = Array.isArray(topicData)
          ? topicData
          : [];

        const results = await Promise.allSettled(
          topicList.map(async (topic) => {
            const id = getTopicId(topic);

            const data = await getQuestions(id);

            const questionList = Array.isArray(data)
              ? data
              : [];

            return questionList.map((question) => ({
              ...question,
              topicId: id,
              topicName: getTopicName(topic),
            }));
          })
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        const failedRequests = results.filter(
          (result) => result.status === "rejected"
        );

        const loadedQuestions = results
          .filter(
            (result) => result.status === "fulfilled"
          )
          .flatMap((result) => result.value);

        setTopics(topicList);
        setQuestions(loadedQuestions);

        if (failedRequests.length > 0) {
          setLoadError(
            `Unable to load questions from ${failedRequests.length} topic(s). Counts may be incomplete.`
          );
        }
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        console.log(
          "Load manage questions error:",
          error.response?.data ?? error.message
        );

        setTopics([]);
        setQuestions([]);
        setLoadError(
          "Unable to load topics and questions."
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [currentSubjectId, user?.userId]
  );

  // Refresh whenever the screen receives focus
  // or the selected subject changes.
  useFocusEffect(
    useCallback(() => {
      const requestId = ++requestIdRef.current;

      loadSubjects();
      loadData(requestId);

      return () => {
        // Invalidate requests from the previous
        // subject or previous screen focus.
        requestIdRef.current += 1;
      };
    }, [loadSubjects, loadData])
  );

  const handleSelectSubject = (subject) => {
    const id = getSubjectId(subject);

    if (id == null) return;

    setSelectedSubjectId(id);
    setSelectedTopicId(null);
    setSearch("");
    setTopics([]);
    setQuestions([]);
    setSubjectPickerVisible(false);
  };

  const topicQuestionCounts = useMemo(() => {
    const counts = {};

    questions.forEach((question) => {
      const id = question.topicId;

      counts[id] = (counts[id] ?? 0) + 1;
    });

    return counts;
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesTopic =
        selectedTopicId == null ||
        String(question.topicId) ===
          String(selectedTopicId);

      const matchesSearch =
        getQuestionText(question)
          .toLowerCase()
          .includes(keyword) ||
        (question.topicName ?? "")
          .toLowerCase()
          .includes(keyword);

      return matchesTopic && matchesSearch;
    });
  }, [questions, selectedTopicId, search]);

  const handleAdd = () => {
    if (currentSubjectId == null) {
      Alert.alert(
        "Select Subject",
        "Please select a subject first."
      );
      return;
    }

    navigation.navigate("AddQuestion", {
      subjectId: currentSubjectId,
      subjectName: currentSubjectName,
      subjectIcon: currentSubjectIcon,
      gradeId: currentGradeId,
      topicId: selectedTopicId,
      topics,
    });
  };

  const handleEdit = (question) => {
    navigation.navigate("AddQuestion", {
      subjectId: currentSubjectId,
      subjectName: currentSubjectName,
      subjectIcon: currentSubjectIcon,
      gradeId: currentGradeId,
      topicId: question.topicId,
      topics,
      question,
    });
  };

  const handleDelete = (question) => {
    const questionId = getQuestionId(question);

    if (questionId == null) {
      Alert.alert(
        "Error",
        "Question ID is missing."
      );
      return;
    }

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
              setDeletingId(questionId);

              await deleteQuestion(questionId);

              setQuestions((previous) =>
                previous.filter(
                  (item) =>
                    getQuestionId(item) !== questionId
                )
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
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const renderTopicButton = (
    topic,
    isAll = false
  ) => {
    const id = isAll ? null : getTopicId(topic);

    const active =
      selectedTopicId == null
        ? isAll
        : !isAll &&
          String(selectedTopicId) === String(id);

    const count = isAll
      ? questions.length
      : topicQuestionCounts[id] ?? 0;

    return (
      <Pressable
        key={isAll ? "all" : String(id)}
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
          {isAll ? "All" : getTopicName(topic)}
        </Text>

        <Text
          style={[
            styles.topicCountText,
            active && styles.topicButtonTextActive,
          ]}
        >
          ({count})
        </Text>
      </Pressable>
    );
  };

  const renderQuestion = ({ item, index }) => {
    const questionId = getQuestionId(item);
    const isDeleting = deletingId === questionId;

    return (
      <View style={styles.questionCard}>
        <View style={styles.questionNumber}>
          <Text style={styles.questionNumberText}>
            {index + 1}
          </Text>
        </View>

        <View style={styles.questionDetails}>
          <Text
            style={styles.questionText}
            numberOfLines={2}
          >
            {getQuestionText(item)}
          </Text>

          <View style={styles.questionTopicRow}>
            <Ionicons
              name="book-outline"
              size={14}
              color={COLORS.primary}
            />

            <Text
              style={styles.questionTopicText}
              numberOfLines={1}
            >
              {item.topicName}
            </Text>
          </View>
        </View>

        <View style={styles.questionActions}>
          <Pressable
            style={styles.editButton}
            onPress={() => handleEdit(item)}
            disabled={isDeleting}
          >
            <Ionicons
              name="pencil-outline"
              size={19}
              color={COLORS.primary}
            />
          </Pressable>

          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator
                size="small"
                color={COLORS.danger}
              />
            ) : (
              <Ionicons
                name="trash-outline"
                size={19}
                color={COLORS.danger}
              />
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
          Manage Questions
        </Text>

        <Pressable
          style={styles.addButton}
          onPress={handleAdd}
        >
          <Ionicons
            name="add"
            size={27}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      {/* Subject */}
      <Pressable
        style={styles.subjectCard}
        disabled={!canSelectSubject}
        onPress={() => setSubjectPickerVisible(true)}
      >
        <View style={styles.subjectIconContainer}>
          <Ionicons
            name={currentSubjectIcon}
            size={35}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.subjectDetails}>
          <Text
            style={styles.subjectName}
            numberOfLines={1}
          >
            {currentSubjectName}
          </Text>

          {currentGradeId != null && (
            <Text style={styles.subjectGrade}>
              Grade {currentGradeId}
            </Text>
          )}

          {canSelectSubject && (
            <Text style={styles.subjectHint}>
              Tap to select subject
            </Text>
          )}
        </View>

        {canSelectSubject && (
          <Ionicons
            name="chevron-down"
            size={20}
            color={COLORS.secondary}
          />
        )}
      </Pressable>

      {/* Counts */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons
              name="book-outline"
              size={23}
              color={COLORS.primary}
            />
          </View>

          <View>
            <Text style={styles.statValue}>
              {topics.length}
            </Text>
            <Text style={styles.statLabel}>
              topics
            </Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons
              name="list-outline"
              size={23}
              color={COLORS.primary}
            />
          </View>

          <View>
            <Text style={styles.statValue}>
              {questions.length}
            </Text>
            <Text style={styles.statLabel}>
              questions
            </Text>
          </View>
        </View>
      </View>

      {/* Topic filters */}
      <View style={styles.topicSection}>
        <Text style={styles.sectionTitle}>
          Topics
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.topicScrollContent
          }
        >
          {renderTopicButton(null, true)}

          {topics.map((topic) =>
            renderTopicButton(topic)
          )}
        </ScrollView>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={23}
          color="#94A3B8"
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search questions..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#94A3B8"
            />
          </Pressable>
        )}
      </View>

      {/* Loading / error / list */}
      {loadError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {loadError}
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
          <Text style={styles.loadingText}>
            Loading questions...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredQuestions}
          renderItem={renderQuestion}
          keyExtractor={(item, index) =>
            String(getQuestionId(item) ?? index)
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="document-text-outline"
                size={44}
                color="#CBD5E1"
              />

              <Text style={styles.emptyTitle}>
                {currentSubjectId == null
                  ? "Select a subject"
                  : "No questions found"}
              </Text>

              <Text style={styles.emptyText}>
                {currentSubjectId == null
                  ? "Choose a subject to view its questions."
                  : search.trim()
                  ? "Try a different search."
                  : "Add a question to get started."}
              </Text>
            </View>
          }
        />
      )}

      {/* Subject picker */}
      <Modal
        visible={subjectPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setSubjectPickerVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select Subject
              </Text>

              <Pressable
                onPress={() =>
                  setSubjectPickerVisible(false)
                }
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={COLORS.text}
                />
              </Pressable>
            </View>

            {loadingSubjects ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
              />
            ) : (
              <FlatList
                data={subjects}
                keyExtractor={(item) =>
                  String(getSubjectId(item))
                }
                renderItem={({ item }) => {
                  const id = getSubjectId(item);

                  const isSelected =
                    String(selectedSubjectId) ===
                    String(id);

                  return (
                    <Pressable
                      style={styles.subjectOption}
                      onPress={() =>
                        handleSelectSubject(item)
                      }
                    >
                      <View style={styles.optionIcon}>
                        <Ionicons
                          name={
                            item.icon ||
                            "book-outline"
                          }
                          size={23}
                          color={COLORS.primary}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.optionName}>
                          {item.name}
                        </Text>

                        <Text style={styles.optionGrade}>
                          Grade{" "}
                          {item.gradeId ??
                            item.grade ??
                            "-"}
                        </Text>
                      </View>

                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={23}
                          color={COLORS.primary}
                        />
                      )}
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No subjects available.
                  </Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
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

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 16,
    padding: 13,
    marginHorizontal: 20,
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

  subjectHint: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 5,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
  },

  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 12,
    padding: 12,
    gap: 11,
  },

  statIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 2,
  },

  topicSection: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  topicScrollContent: {
    paddingHorizontal: 20,
    gap: 7,
  },

  topicButton: {
    minWidth: 70,
    maxWidth: 135,
    minHeight: 51,
    borderRadius: 10,
    backgroundColor: "#F0F3FA",
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    textAlign: "center",
  },

  topicButtonTextActive: {
    color: "#FFFFFF",
  },

  topicCountText: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 3,
  },

  searchContainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 17,
    marginBottom: 10,
    paddingHorizontal: 13,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 7,
    flexGrow: 1,
  },

  questionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 9,
    minHeight: 66,
    gap: 10,
  },

  questionNumber: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F1F5FB",
    alignItems: "center",
    justifyContent: "center",
  },

  questionNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  questionDetails: {
    flex: 1,
    minWidth: 0,
  },

  questionText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    color: COLORS.text,
  },

  questionTopicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },

  questionTopicText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.secondary,
  },

  questionActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#F1F4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 13,
    color: COLORS.secondary,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
    gap: 9,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  emptyText: {
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: "center",
  },

  errorContainer: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
  },

  errorText: {
    fontSize: 12,
    color: "#B91C1C",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "75%",
    minHeight: 220,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  subjectOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },

  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.lightPrimary,
    alignItems: "center",
    justifyContent: "center",
  },

  optionName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  optionGrade: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 3,
  },
});
