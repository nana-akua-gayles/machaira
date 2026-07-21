import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { AppText } from '../../components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Quote, BrainCircuit, BookOpenText, ChevronLeft, Lock } from 'lucide-react-native';
import { supabase } from '../../config/supabaseClient';
import { WhoSaidArena } from './WhoSaidArena';
import * as Haptics from 'expo-haptics';

const GAMES = {
  WHO_SAID: { title: "WHO SAID IT?", desc: "Whose words were these?", icon: BookOpenText },
  MEMORY: { title: "MEMORY CORE", desc: "Scripture recall", icon: BrainCircuit },
  BENNIE: { title: "APOSTLE'S TAKE", desc: "Contextual wisdom", icon: Quote }
};

export const BibleTrivia = ({ navigation }) => {
  const [activeGame, setActiveGame] = useState(null);
  const [viewState, setViewState] = useState('HUB'); 
  const [acts, setActs] = useState([]);
  const [unlockedLevel, setUnlockedLevel] = useState(1); 
  const [currentActIndex, setCurrentActIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch user unlocked level from profile on mount
  useEffect(() => {
    fetchUserProfileProgress();
  }, []);

  const fetchUserProfileProgress = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('unlocked_level')
        .eq('id', session.user.id)
        .single();

      if (data && data.unlocked_level) {
        setUnlockedLevel(data.unlocked_level);
      }
    } catch (err) {
      console.log('Could not load profile progress, defaulting to stage 1.');
    }
  };

  const updateProfileProgressInDB = async (newLevel) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase
        .from('profiles')
        .update({ 
          unlocked_level: newLevel,
          updated_at: new Date()
        })
        .eq('id', session.user.id);
    } catch (err) {
      console.error('Error saving profile progress to database:', err.message);
    }
  };

  const handleGameSelect = async (key) => {
    Haptics.selectionAsync();
    setActiveGame(key);
    setErrorMessage(null);

    if (key === 'WHO_SAID') {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          setErrorMessage('Authentication required to access modules.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('acts')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setActs(data || []);
        setViewState('PATH');
      } catch (err) {
        console.error('Error fetching acts:', err.message);
        setErrorMessage('Failed to load modules.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectAct = async (act, index) => {
    // Check if stage is locked
    if (index + 1 > unlockedLevel) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(`Complete Stage ${index} to unlock this stage.`);
      return;
    }

    Haptics.selectionAsync();
    setCurrentActIndex(index);
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('act_id', act.id);

      if (error) throw error;

      if (!data || data.length === 0) {
        setErrorMessage('No questions available in this stage yet.');
        setLoading(false);
        return;
      }

      setQuestions(data);
      setCurrentQIndex(0);
      setScore(0);
      setViewState('ARENA');
    } catch (err) {
      console.error('Error fetching questions:', err.message);
      setErrorMessage('Failed to load stage questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedAuthor) => {
    const currentQ = questions[currentQIndex];
    
    // Clean and compare against author column
    const cleanSelected = selectedAuthor.replace(/^[A-D]\)\s*/, '').trim().toLowerCase();
    const cleanAuthor = currentQ?.author?.replace(/^[A-D]\)\s*/, '').trim().toLowerCase();

    const isCorrect = cleanSelected === cleanAuthor;
    
    // Calculate new score inside the state updater to avoid stale state bugs
    let updatedScore = score;
    if (isCorrect) {
      setScore(prev => {
        updatedScore = prev + 1;
        return updatedScore;
      });
    }

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Completed current stage successfully. Unlock next level if applicable.
      const nextLevelToUnlock = currentActIndex + 2;
      if (nextLevelToUnlock > unlockedLevel && nextLevelToUnlock <= acts.length + 1) {
        setUnlockedLevel(nextLevelToUnlock);
        updateProfileProgressInDB(nextLevelToUnlock);
      }
      setViewState('COMPLETED');
    }
  };

  const handleRetryStage = () => {
    Haptics.selectionAsync();
    setScore(0);
    setCurrentQIndex(0);
    setViewState('ARENA');
  };

  const handleNextStage = () => {
    Haptics.selectionAsync();
    const nextIndex = currentActIndex + 1;
    if (nextIndex < acts.length) {
      handleSelectAct(acts[nextIndex], nextIndex);
    } else {
      setViewState('PATH');
    }
  };

  const handleCancelStage = () => {
    Haptics.selectionAsync();
    setViewState('PATH');
  };

  const handleBack = () => {
    Haptics.selectionAsync();
    if (viewState === 'ARENA') {
      setViewState('PATH');
      setErrorMessage(null);
    } else if (viewState === 'PATH') {
      setViewState('HUB');
      setActiveGame(null);
      setErrorMessage(null);
    } else if (viewState === 'COMPLETED') {
      setViewState('PATH');
    } else {
      navigation.goBack();
    }
  };

  const getCongratulatoryMessage = () => {
    const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    if (percentage === 100) return "100% YOU ARE BUILT ON THE WORD FR!";
    if (percentage >= 80) return "COME ON NOW! A FEW SLIPPED THROUGH, BUT YOU HELD IT DOWN";
    if (percentage >= 50) return "MORE TIME WITH THE WORD AND YOU'LL BE UNSTOPPABLE.";
    return "THIS IS YOUR SIGN TO BE LEARNING YOUR BIBLE.";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={32} color="#0f172a" />
        </TouchableOpacity>
        <AppText type="bold" style={styles.headerTitle}>
          {activeGame ? GAMES[activeGame].title : "MACHAIRA"}
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0f172a" />
            <AppText style={styles.loaderText}>INITIALIZING...</AppText>
          </View>
        ) : (
          <>
            {viewState === 'HUB' && (
              <View style={styles.grid}>
                <AppText type="bold" style={styles.mainTitle}>CHOOSE{'\n'}YOUR{'\n'}CHALLENGE</AppText>
                {Object.entries(GAMES).map(([key, game]) => (
                  <Pressable key={key} onPress={() => handleGameSelect(key)} style={styles.cardContainer}>
                    <View style={styles.gameCard}>
                      <View style={styles.iconBox}>
                        <game.icon color="#0f172a" size={28} />
                      </View>
                      <View style={styles.textWrap}>
                        <AppText type="bold" style={styles.cardTitle}>{game.title}</AppText>
                        <AppText style={styles.cardSub}>{game.desc}</AppText>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {viewState === 'PATH' && (
              <View style={styles.pathContainer}>
                <AppText type="bold" style={styles.sectionHeading}>SELECT STAGE</AppText>
                {errorMessage && <AppText style={styles.errorText}>{errorMessage}</AppText>}
                {acts.map((act, index) => {
                  const isLocked = index + 1 > unlockedLevel;
                  return (
                    <Pressable 
                      key={act.id} 
                      onPress={() => handleSelectAct(act, index)} 
                      style={[styles.actCard, isLocked && styles.actCardLocked]}
                    >
                      <AppText type="bold" style={[styles.actIndex, isLocked && styles.actIndexLocked]}>
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </AppText>
                      <View style={styles.actText}>
                        <AppText type="bold" style={[styles.actTitle, isLocked && styles.actTitleLocked]}>
                          {act.title}
                        </AppText>
                        <AppText style={[styles.actDesc, isLocked && styles.actDescLocked]}>
                          {isLocked ? 'LOCKED — COMPLETE PREVIOUS STAGE' : act.description}
                        </AppText>
                      </View>
                      {isLocked && <Lock size={20} color="#94a3b8" />}
                    </Pressable>
                  );
                })}
              </View>
            )}

            {viewState === 'ARENA' && questions.length > 0 && (
              <WhoSaidArena 
                question={questions[currentQIndex]}
                currentIndex={currentQIndex}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
              />
            )}

            {viewState === 'COMPLETED' && (
              <View style={styles.completedContainer}>
                <AppText type="bold" style={styles.completeTitle}>GLORY!</AppText>
                <AppText type="bold" style={styles.completeTitle2}>STAGE COMPLETED</AppText>
                <AppText style={styles.congratsMessage}>{getCongratulatoryMessage()}</AppText>
                <AppText style={styles.scoreText}>FINAL SCORE: {score} / {questions.length}</AppText>
                
                <View style={styles.completionActions}>
                  {currentActIndex + 1 < acts.length && unlockedLevel >= currentActIndex + 2 && (
                    <Pressable style={styles.primaryBtn} onPress={handleNextStage}>
                      <AppText type="bold" style={styles.primaryBtnText}>NEXT STAGE</AppText>
                    </Pressable>
                  )}
                  <Pressable style={styles.secondaryBtn} onPress={handleRetryStage}>
                    <AppText type="bold" style={styles.secondaryBtnText}>RETRY</AppText>
                  </Pressable>
                  <Pressable style={styles.outlineBtn} onPress={handleCancelStage}>
                    <AppText type="bold" style={styles.outlineBtnText}>CANCEL</AppText>
                  </Pressable>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 20, padding: 5 },
  headerTitle: { fontSize: 20, letterSpacing: 2, color: '#0f172a' },
  mainTitle: { fontSize: 48, lineHeight: 50, marginBottom: 40, color: '#0f172a' },
  scroll: { padding: 20, flexGrow: 1 },
  grid: { gap: 20 },
  cardContainer: { shadowColor: 'red', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5, marginBottom: 10 },
  gameCard: { flexDirection: 'row', alignItems: 'center', padding: 24, backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#0f172a' },
  iconBox: { padding: 12, backgroundColor: '#f1f5f9', borderWidth: 2, borderColor: '#0f172a' },
  textWrap: { marginLeft: 20, flex: 1 },
  cardTitle: { fontSize: 18, color: '#0f172a', letterSpacing: 1 },
  cardSub: { fontSize: 13, color: '#64748b', marginTop: 4, textTransform: 'uppercase' },
  loaderContainer: { marginTop: 100, alignItems: 'center', justifyContent: 'center', gap: 15 },
  loaderText: { fontSize: 12, letterSpacing: 2, color: '#0f172a' },
  sectionHeading: { fontSize: 28, color: '#0f172a', marginBottom: 20 },
  pathContainer: { gap: 15 },
  actCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#0f172a', padding: 20 },
  actCardLocked: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
  actIndex: { fontSize: 24, color: 'red', marginRight: 20 },
  actIndexLocked: { color: '#94a3b8' },
  actText: { flex: 1 },
  actTitle: { fontSize: 16, color: '#0f172a' },
  actTitleLocked: { color: '#94a3b8' },
  actDesc: { fontSize: 12, color: '#64748b', marginTop: 4 },
  actDescLocked: { color: '#94a3b8' },
  completedContainer: { marginTop: 40, alignItems: 'center', padding: 20, backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#0f172a' },
  completeTitle: { fontSize: 32, color: '#0f172a', marginBottom: 4 },
  completeTitle2: { fontSize: 22, color: '#0f172a', marginBottom: 15, letterSpacing: 1 },
  congratsMessage: { fontSize: 13, color: '#0f172a', textAlign: 'center', marginBottom: 15, letterSpacing: 1, textTransform: 'uppercase' },
  scoreText: { fontSize: 16, color: '#64748b', marginBottom: 25, letterSpacing: 1 },
  completionActions: { width: '100%', gap: 12 },
  primaryBtn: { backgroundColor: '#0f172a', paddingVertical: 18, paddingHorizontal: 30, width: '100%', alignItems: 'center', borderWidth: 2, borderColor: '#0f172a' },
  primaryBtnText: { color: '#ffffff', letterSpacing: 2, fontSize: 14 },
  secondaryBtn: { backgroundColor: '#ffffff', paddingVertical: 18, paddingHorizontal: 30, width: '100%', alignItems: 'center', borderWidth: 2, borderColor: '#0f172a' },
  secondaryBtnText: { color: '#0f172a', letterSpacing: 2, fontSize: 14 },
  outlineBtn: { backgroundColor: '#f1f5f9', paddingVertical: 14, paddingHorizontal: 30, width: '100%', alignItems: 'center', borderWidth: 2, borderColor: '#cbd5e1' },
  outlineBtnText: { color: '#64748b', letterSpacing: 2, fontSize: 13 },
  errorText: { color: 'red', fontSize: 12, fontWeight: 'bold', marginBottom: 15 }
});