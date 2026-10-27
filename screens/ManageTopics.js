import React, { useState, useCallback, useMemo } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../context/UserContext";

import { getTopicWithGrades, deleteTopic } from "../services/topics/topicApi";

const COLORS = {
  primary: "#6366F1",
  background: "#F7FAFC",
  white: "#FFFFFF",
  text: "#0F172A",
  secondary: "#64748B",
  border: "#E2E8F0",
};

export default function ManageTopics({ navigation, route }) {
  const { user } = useUser();

  const { subjectId, subjectName = "Subject",subjectIcon, gradeId } = route.params ?? {};

  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadTopics = useCallback(async () => {
    if (subjectId == null || user?.userId == null) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getTopicWithGrades(subjectId, user.userId);

      setTopics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Load topics error:", error.response?.data ?? error.message);

      Alert.alert("Error", "Unable to load topics.");
    } finally {
      setLoading(false);
    }
  }, [subjectId, user?.userId]);

  useFocusEffect(
    useCallback(() => {
      loadTopics();
    }, [loadTopics]),
  );

  const filteredTopics = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return topics.filter((topic) =>
      (topic.topicName ?? topic.name ?? "").toLowerCase().includes(keyword),
    );
  }, [topics, search]);

  const totalQuestions = useMemo(() => {
    return topics.reduce(
      (total, topic) => total + Number(topic.questionCount ?? 0),
      0,
    );
  }, [topics]);

  const getTopicId = (topic) => topic.topicId ?? topic.id;

  const getTopicName = (topic) =>
    topic.topicName ?? topic.name ?? "Untitled Topic";

  const handleAdd = () => {
    navigation.navigate("AddTopic", {
      subjectId,
      subjectName,
      gradeId,
    });
  };

  const handleEdit = (topic) => {
    navigation.navigate("AddTopic", {
      subjectId,
      subjectName,
      gradeId,
      topic: {
        ...topic,
        id: getTopicId(topic),
        name: getTopicName(topic),
      },
    });
  };

  const handleManageQuestions = (topic) => {
    navigation.navigate("ManageQuestions", {

      subjectId: subjectId,
        subjectName: subjectName,
        subjectIcon: subjectIcon,
        gradeId: gradeId,
        topicId: topic.topicId ?? topic.id,
      
    });
  };
//    subjectId: subject.id,
//                     subjectName: subject.name,
//                     subjectIcon: subject.icon,
//                     gradeId: subject.gradeId ?? subject.grade,

  const handleDelete = (topic) => {
    if (deletingId !== null) return;

    const topicId = getTopicId(topic);
    const topicName = getTopicName(topic);

    Alert.alert(
      "Delete Topic",
      `Are you sure you want to delete "${topicName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(topicId);

            try {
              await deleteTopic(topicId);

              setTopics((previous) =>
                previous.filter((item) => getTopicId(item) !== topicId),
              );
            } catch (error) {
              console.log(
                "Delete topic error:",
                error.response?.data ?? error.message,
              );

              Alert.alert(
                "Error",
                error.response?.data?.message ||
                  "Unable to delete this topic. It may contain questions.",
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  };

  const renderTopic = (topic) => {
    const topicId = getTopicId(topic);
    const topicName = getTopicName(topic);
    const isDeleting = deletingId === topicId;

    return (
      <View key={topicId} style={styles.topicCard}>
        {/* Topic information */}
        <Pressable
          style={styles.topicDetails}
          onPress={() => handleManageQuestions(topic)}
          disabled={deletingId !== null}
        >
          <View style={{flexDirection:'row'}}>
            <Text style={styles.topicName} numberOfLines={1}>
              {`${topicName}`}
            </Text>
            <Text style={{color: 'gray', fontWeight:'bold',fontSize:12,alignSelf:'center'}}> {`${topicId}`}</Text>
          </View>
          <Text style={styles.topicCount}>
            {topic.questionCount != null
              ? `${topic.questionCount} questions`
              : "View questions"}
          </Text>
        </Pressable>

        {/* Manage Questions */}
        <Pressable
          style={[styles.actionButton, styles.questionsButton]}
          onPress={() => handleManageQuestions(topic)}
          disabled={deletingId !== null}
          accessibilityLabel={`Manage questions for ${topicName}`}
        >
          <Ionicons name="list-outline" size={21} color={COLORS.primary} />
        </Pressable>

        {/* Edit Topic */}
        <Pressable
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(topic)}
          disabled={deletingId !== null}
          accessibilityLabel={`Edit ${topicName}`}
        >
          <Ionicons name="pencil-outline" size={19} color="#2563EB" />
        </Pressable>

        {/* Delete Topic */}
        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(topic)}
          disabled={deletingId !== null}
          accessibilityLabel={`Delete ${topicName}`}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons name="trash-outline" size={19} color="#EF4444" />
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Manage Topics</Text>

        <Pressable
          style={styles.addButton}
          onPress={handleAdd}
          disabled={deletingId !== null}
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Subject summary - no logo */}
      <View style={styles.subjectCard}>
        <Text style={styles.subjectName}>{subjectName}</Text>

        {gradeId != null && (
          <Text style={styles.subjectGrade}>Grade {gradeId}</Text>
        )}

        <Text style={styles.subjectCount}>
          {topics.length} topics
          {topics.every((topic) => topic.questionCount != null)
            ? ` • ${totalQuestions} questions`
            : ""}
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#94A3B8" />

        <TextInput
          style={styles.searchInput}
          placeholder="Search topics..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={19} color="#94A3B8" />
          </Pressable>
        )}
      </View>

      {/* Topic list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={styles.loadingText}>Loading topics...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredTopics.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={38} color="#CBD5E1" />

              <Text style={styles.emptyText}>No topics found.</Text>
            </View>
          ) : (
            filteredTopics.map(renderTopic)
          )}
        </ScrollView>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 30,
    gap: 16,
  },

  backButton: {
    padding: 2,
  },

  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  subjectCard: {
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 17,
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
  },

  subjectName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  subjectGrade: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },

  subjectCount: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 7,
  },

  searchContainer: {
    height: 46,
    marginHorizontal: 14,
    marginBottom: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
    gap: 8,
  },

  topicCard: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    gap: 7,
  },

  topicDetails: {
    flex: 1,
    minWidth: 0,
    paddingRight: 3,
  },

  topicName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  topicCount: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  questionsButton: {
    backgroundColor: "#EEF2FF",
  },

  editButton: {
    backgroundColor: "#EFF6FF",
  },

  deleteButton: {
    backgroundColor: "#FEF2F2",
  },

  loadingContainer: {
    paddingTop: 45,
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 13,
    color: COLORS.secondary,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 55,
    gap: 12,
  },

  emptyText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
});
