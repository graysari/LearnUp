
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    Pressable,
    Alert,
    ActivityIndicator,
    Modal
} from 'react-native';

import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { getQuestions } from '../services/questions/questionApi';
import { postScore } from '../services/scoreApi';
import { useUser } from '../context/UserContext';

export default function Question({ navigation, route }) {

    const [quizResult, setQuizResult] = useState(null);

    const { user } = useUser();
    const { topicId, totalQuestionCount } = route.params;

    const [questions, setQuestions] = useState([]);
    const [questionCurrentIndex, setQuestionCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [choices, setChoices] = useState([]);
    const [checkAnswer, setCheckAnswer] = useState(true);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [totalAnsweredQuestions, setTotalAnsweredQuestions] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const totalQuestionToAnswered = questions.length || totalQuestionCount;

    const correctAnswer =
        questions[questionCurrentIndex]?.correctAnswer;

    const percentageScore = totalQuestionToAnswered > 0
        ? Math.round((score / totalQuestionToAnswered) * 100)
        : 0;

    const questionProgress = totalQuestionToAnswered > 0
        ? (totalAnsweredQuestions / totalQuestionToAnswered) * 100
        : 0;

    const isTrueFalse =
        choices.length === 2 &&
        choices.every(choice =>
            ['true', 'false'].includes(String(choice).toLowerCase())
        );

    // FETCH QUESTIONS
    const fetchQuestions = async () => {
        try {
            setLoading(true);

            const data = await getQuestions(topicId);

            const shuffledQuestions = [...data].sort(
                () => Math.random() - 0.5
            );

            setQuestions(shuffledQuestions);

        } catch (error) {
            console.log('Error fetching questions:', error);

            Alert.alert(
                'Error',
                'Unable to load questions.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [topicId]);

    // SHUFFLE CHOICES FOR EACH QUESTION
    useEffect(() => {
        const question = questions[questionCurrentIndex];

        if (!question) return;

        const newChoices = [
            question.correctAnswer,
            question.choice1,
            question.choice2,
            question.choice3
        ]
            .filter(choice => choice != null)
            .sort(() => Math.random() - 0.5);

        setChoices(newChoices);

    }, [questions, questionCurrentIndex]);

    // SAVE SCORE
    const handleSubmitScore = async (finalScore) => {
        const total = questions.length;

        const percentage = total > 0
            ? Math.round((finalScore / total) * 100)
            : 0;

        try {
            await postScore(
                percentage,
                total,
                topicId,
                user.userId
            );

        } catch (error) {
            console.error('Error saving score:', error?.message);
        }
    };

    // QUIZ RESULT
    const showQuizResult = (finalScore) => {
        const total = questions.length;

        const percentage = total > 0
            ? Math.round((finalScore / total) * 100)
            : 0;

        setQuizResult({
            score: finalScore,
            total: total,
            percentage: percentage
        });
    };

    // ANSWER COLORS
    const getAnswerStyle = (choice) => {

        if (checkAnswer) {
            if (selectedAnswer === choice) {
                return {
                    borderColor: '#6366F1',
                    backgroundColor: '#EEF2FF',
                    borderWidth: 2,
                };
            }

            return {
                borderColor: '#E2E8F0',
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
            };
        }

        if (choice === correctAnswer) {
            return {
                borderColor: '#22C55E',
                backgroundColor: '#F0FDF4',
                borderWidth: 2,
            };
        }

        if (choice === selectedAnswer) {
            return {
                borderColor: '#EF4444',
                backgroundColor: '#FEF2F2',
                borderWidth: 2,
            };
        }

        return {
            borderColor: '#E2E8F0',
            backgroundColor: '#FFFFFF',
            borderWidth: 1.5,
        };
    };

    const getChoiceColor = (choice) => {
        if (!checkAnswer) {
            if (choice === correctAnswer) return '#22C55E';
            if (choice === selectedAnswer) return '#EF4444';
        }

        if (selectedAnswer === choice) return '#6366F1';

        return '#E2E8F0';
    };

    // CHECK ANSWER / NEXT QUESTION
    const handleNextQuestion = async () => {

        if (submitting) return;

        if (checkAnswer) {

            if (selectedAnswer === null) {
                Alert.alert(
                    'Select an Answer',
                    'Please select an answer before continuing.'
                );
                return;
            }

            setIsAnswerCorrect(
                selectedAnswer === correctAnswer
            );

            setCheckAnswer(false);
            return;
        }

        // Calculate the final score before changing state
        const finalScore = isAnswerCorrect
            ? score + 1
            : score;

        if (totalAnsweredQuestions === questions.length) {

            setSubmitting(true);
            setScore(finalScore);

            await handleSubmitScore(finalScore);

            showQuizResult(finalScore);
            return;
        }

        if (isAnswerCorrect) {
            setScore(prevScore => prevScore + 1);
        }

        setQuestionCurrentIndex(prevIndex => prevIndex + 1);
        setTotalAnsweredQuestions(prevTotal => prevTotal + 1);
        setCheckAnswer(true);
        setSelectedAnswer(null);
        setIsAnswerCorrect(false);
    };

    // LOADING SCREEN
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#6366F1"
                />
                <Text style={styles.loadingText}>
                    Loading questions...
                </Text>
            </View>
        );
    }

    if (questions.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons
                    name="help-circle-outline"
                    size={48}
                    color="#94A3B8"
                />

                <Text style={styles.loadingText}>
                    No questions available.
                </Text>

                <Pressable onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => {
                        Alert.alert(
                            'Leave Quiz?',
                            'Your current progress will be lost.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Leave',
                                    onPress: () => navigation.popToTop()
                                }
                            ]
                        );
                    }}
                >
                    <Ionicons
                        name="chevron-back"
                        size={26}
                        color="#0F172A"
                    />
                </Pressable>

                <Text style={styles.headerTitle}>
                    Quiz
                </Text>

                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* PROGRESS CARD */}
                <View style={styles.progressCard}>

                    <View style={styles.progressHeader}>
                        <Text style={styles.questionCount}>
                            Question {totalAnsweredQuestions} of {totalQuestionToAnswered}
                        </Text>

                        <Text style={styles.scoreText}>
                            Score: <Text style={styles.scoreValue}>
                                {percentageScore}%
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${Math.min(100, questionProgress)}%` }
                            ]}
                        />
                    </View>

                </View>

                {/* QUESTION CARD */}
                <View style={styles.questionCard}>

                    {isTrueFalse && (
                        <View style={styles.trueFalseBadge}>
                            <Ionicons
                                name="checkbox-outline"
                                size={17}
                                color="#6366F1"
                            />

                            <Text style={styles.trueFalseText}>
                                True or False
                            </Text>
                        </View>
                    )}

                    <Text style={styles.questionText}>
                        {questions[questionCurrentIndex]?.questionText}
                    </Text>

                </View>

                {/* ANSWER OPTIONS */}
                <View style={styles.optionsContainer}>

                    {choices.map((choice, index) => {

                        const isCorrectChoice =
                            !checkAnswer && choice === correctAnswer;

                        const isWrongChoice =
                            !checkAnswer &&
                            choice === selectedAnswer &&
                            choice !== correctAnswer;

                        const choiceLabel = isTrueFalse
                            ? String(choice).toLowerCase() === 'true'
                                ? 'T'
                                : 'F'
                            : String.fromCharCode(65 + index);

                        return (
                            <Pressable
                                key={index}
                                disabled={!checkAnswer}
                                onPress={() => setSelectedAnswer(choice)}
                                style={({ pressed }) => [
                                    styles.option,
                                    getAnswerStyle(choice),
                                    pressed && styles.buttonPressed
                                ]}
                            >

                                <View style={[
                                    styles.optionCircle,
                                    {
                                        backgroundColor:
                                            getChoiceColor(choice)
                                    }
                                ]}>
                                    <Text style={[
                                        styles.optionLetter,
                                        {
                                            color:
                                                selectedAnswer === choice ||
                                                    isCorrectChoice
                                                    ? '#FFFFFF'
                                                    : '#64748B'
                                        }
                                    ]}>
                                        {choiceLabel}
                                    </Text>
                                </View>

                                <Text style={styles.optionText}>
                                    {choice}
                                </Text>

                                {isCorrectChoice && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={25}
                                        color="#22C55E"
                                    />
                                )}

                                {isWrongChoice && (
                                    <Ionicons
                                        name="close-circle"
                                        size={25}
                                        color="#EF4444"
                                    />
                                )}

                            </Pressable>
                        );
                    })}

                </View>

                {/* ANSWER RESULT */}
                {!checkAnswer && (
                    <View style={[
                        styles.resultContainer,
                        {
                            backgroundColor: isAnswerCorrect
                                ? '#F0FDF4'
                                : '#FEF2F2'
                        }
                    ]}>

                        <Ionicons
                            name={isAnswerCorrect
                                ? 'checkmark-circle'
                                : 'close-circle'}
                            size={27}
                            color={isAnswerCorrect
                                ? '#16A34A'
                                : '#DC2626'}
                        />

                        <View style={styles.resultContent}>

                            <Text style={[
                                styles.resultTitle,
                                {
                                    color: isAnswerCorrect
                                        ? '#16A34A'
                                        : '#DC2626'
                                }
                            ]}>
                                {isAnswerCorrect
                                    ? 'Correct answer!'
                                    : 'Incorrect answer!'}
                            </Text>

                            {!isAnswerCorrect && (
                                <Text style={styles.correctAnswerText}>
                                    Correct answer: {correctAnswer}
                                </Text>
                            )}

                        </View>

                    </View>
                )}

            </ScrollView>

            {/* BOTTOM BUTTON */}
            <View style={styles.bottomContainer}>

                <Pressable
                    disabled={submitting}
                    onPress={handleNextQuestion}
                    style={({ pressed }) => [
                        styles.nextButton,
                        pressed && styles.buttonPressed,
                        submitting && { opacity: 0.6 }
                    ]}
                >
                    <Text style={styles.nextButtonText}>
                        {submitting
                            ? 'Saving Score...'
                            : checkAnswer
                                ? 'Check Answer'
                                : totalAnsweredQuestions === questions.length
                                    ? 'Finish Quiz'
                                    : 'Next Question'}
                    </Text>

                    {!checkAnswer && !submitting && (
                        <Ionicons
                            name="arrow-forward"
                            size={20}
                            color="#FFFFFF"
                        />
                    )}
                </Pressable>

            </View>

            <Modal
                visible={quizResult !== null}
                transparent
                animationType="fade"
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>

                        <View style={styles.trophyContainer}>
                            <Ionicons
                                name="trophy"
                                size={42}
                                color="#16A34A"
                            />
                        </View>

                        <Text style={styles.modalTitle}>
                            Quiz Completed!
                        </Text>

                        <Text style={styles.modalSubtitle}>
                            You've finished all the questions.
                        </Text>

                        <Text style={styles.modalPercentage}>
                            {quizResult?.percentage ?? 0}%
                        </Text>

                        <View style={styles.resultDetails}>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>
                                    Correct Answers
                                </Text>

                                <Text style={styles.resultValue}>
                                    {quizResult?.score ?? 0} / {quizResult?.total ?? 0}
                                </Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>
                                    Result
                                </Text>

                                <Text style={[
                                    styles.resultValue,
                                    {
                                        color: (quizResult?.percentage ?? 0) > 75
                                            ? '#16A34A'
                                            : '#D97706'
                                    }
                                ]}>
                                    {(quizResult?.percentage ?? 0) > 75
                                        ? 'Passed'
                                        : 'Keep Practicing'}
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            style={styles.modalButton}
                            onPress={() => {
                                setQuizResult(null);
                                navigation.popToTop();
                            }}
                        >
                            <Text style={styles.modalButtonText}>
                                Back to Home
                            </Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    modalCard: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: 380,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },

    trophyContainer: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    modalTitle: {
        fontSize: 23,
        fontWeight: '700',
        color: '#0F172A',
    },

    modalSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
    },

    modalPercentage: {
        fontSize: 44,
        fontWeight: '800',
        color: '#6366F1',
        marginVertical: 20,
    },

    resultDetails: {
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
        width: '100%',
        gap: 18,
    },

    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    resultLabel: {
        fontSize: 14,
        color: '#64748B',
    },

    resultValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },

    modalButton: {
        backgroundColor: '#6366F1',
        borderRadius: 14,
        paddingVertical: 16,
        width: '100%',
        alignItems: 'center',
        marginTop: 24,
    },

    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 48,
        paddingBottom: 18,
    },

    backButton: {
        width: 36,
        alignItems: 'flex-start',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        flex: 1,
        textAlign: 'center',
    },

    headerSpacer: {
        width: 36,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    progressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 1,
    },

    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },

    questionCount: {
        fontSize: 14,
        color: '#475569',
    },

    scoreText: {
        fontSize: 14,
        color: '#475569',
    },

    scoreValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#6366F1',
    },

    progressTrack: {
        height: 10,
        backgroundColor: '#E2E8F0',
        borderRadius: 10,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 10,
    },

    questionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 22,
        minHeight: 170,
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 1,
    },

    trueFalseBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        marginBottom: 22,
    },

    trueFalseText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6366F1',
    },

    questionText: {
        fontSize: 23,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: 33,
    },

    optionsContainer: {
        gap: 12,
    },

    option: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 76,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 18,
        gap: 15,
    },

    optionCircle: {
        width: 45,
        height: 45,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },

    optionLetter: {
        fontSize: 19,
        fontWeight: '700',
    },

    optionText: {
        flex: 1,
        fontSize: 17,
        color: '#0F172A',
    },

    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 18,
        borderRadius: 18,
        marginTop: 22,
    },

    resultContent: {
        flex: 1,
    },

    resultTitle: {
        fontSize: 16,
        fontWeight: '700',
    },

    correctAnswerText: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 5,
    },

    bottomContainer: {
        marginBottom: 30,
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#F8FAFC',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },

    nextButton: {
        backgroundColor: '#6366F1',
        borderRadius: 16,
        paddingVertical: 17,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    nextButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    buttonPressed: {
        opacity: 0.75,
        transform: [{ scale: 0.98 }],
    },

    loadingContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },

    loadingText: {
        fontSize: 15,
        color: '#64748B',
        marginTop: 14,
    },

    backText: {
        color: '#6366F1',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 20,
    },

});
