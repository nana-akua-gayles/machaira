import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, ScrollView, Linking, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { ChevronLeft, Phone, Mail, FileText, Clock } from 'lucide-react-native';
import { AppText } from '../../../../components/AppText';
import FAQSection from './FAQSection';

export const SupportFeedbackScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets(); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupportSubmit = async () => {
    if (!description.trim()) return Alert.alert('Missing Information', 'Please provide a detailed description.');
    try {
      setIsSubmitting(true);
      await new Promise(res => setTimeout(res, 800));
      
      setPhoneNumber('');
      setDuration('');
      setDescription('');

      Alert.alert('Ticket Submitted', 'Thank you! Your feedback has been received.');
    } catch {
      Alert.alert('Submission Error', 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Replaced standard SafeAreaView with a normal View using dynamic top margin padding rules
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.screenHeader}>
        <Pressable style={styles.backButtonFrame} onPress={() => navigation?.canGoBack() && navigation.goBack()} hitSlop={12}>
          <ChevronLeft color="#352a48" size={22} strokeWidth={2.5} />
          <AppText type="bold" style={styles.headerTitleText}>Feedback</AppText>
        </Pressable>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flexOne}
      >
        <ScrollView 
          keyboardShouldPersistTaps="handled" 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: Math.max(insets.bottom, 40) }]}
        >
          <FAQSection />

          <AppText type="bold" style={styles.sectionTitleLabel}>Contact Help Desk Directly</AppText>
          <View style={styles.directContactCardFrame}>
            
            {/* Phone contact */}
            <View style={styles.contactRowItem}>
              <Pressable style={styles.contactIconWrapper} onPress={() => Linking.openURL('tel:+233509938700')}>
                <Phone color="#ef4444" size={16} />
              </Pressable>
              <View style={styles.contactTextStack}>
                <AppText type="regular" style={styles.contactMethodLabel}>Call Us</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.textScrollWrapper}>
                  <TextInput style={styles.copiableValueText} value="+233 (509) 938-700" editable={false} selectTextOnFocus={true} />
                </ScrollView>
              </View>
            </View>

            <View style={styles.innerCardDividerLine} />
            
            {/* Email contact */}
            <View style={styles.contactRowItem}>
              <Pressable style={styles.contactIconWrapper} onPress={() => Linking.openURL('mailto:machairahelpline@machairawithapostlebennie.org')}>
                <Mail color="#ef4444" size={16} />
              </Pressable>
              <View style={styles.contactTextStack}>
                <AppText type="regular" style={styles.contactMethodLabel}>Email Us</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.textScrollWrapper}>
                  <TextInput style={styles.copiableValueText} value="machairahelpline@machairawithapostlebennie.org" editable={false} selectTextOnFocus={true} />
                </ScrollView>
              </View>
            </View>
          </View>

          <AppText type="bold" style={styles.sectionTitleLabel}>Submit a Support Ticket</AppText>
          <View style={styles.formInputFieldWrapper}>
            <Phone color="#71717a" size={16} style={{ marginRight: 12 }} />
            <TextInput style={styles.primitiveInputComponent} placeholder="Phone Number (Optional)" placeholderTextColor="#a1a1aa" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} editable={!isSubmitting} />
          </View>

          <View style={styles.formInputFieldWrapper}>
            <Clock color="#71717a" size={16} style={{ marginRight: 12 }} />
            <TextInput style={styles.primitiveInputComponent} placeholder="How long has this occurred?" placeholderTextColor="#a1a1aa" value={duration} onChangeText={setDuration} editable={!isSubmitting} />
          </View>

          <View style={[styles.formInputFieldWrapper, styles.formTextAreaFieldHeight]}>
            <FileText color="#71717a" size={16} style={{ marginRight: 12, marginTop: 2 }} />
            <TextInput 
              style={[styles.primitiveInputComponent, { textAlignVertical: 'top', paddingTop: 0, height: '100%' }]} 
              placeholder="Detailed description of issue..." 
              placeholderTextColor="#a1a1aa" 
              multiline={true} 
              numberOfLines={4} 
              value={description} 
              onChangeText={setDescription} 
              editable={!isSubmitting} 
            />
          </View>

          <Pressable style={[styles.formExecutionSubmitButton, isSubmitting && { backgroundColor: '#cbd5e1' }]} onPress={handleSupportSubmit} disabled={isSubmitting}>
            <AppText type="bold" style={styles.submitButtonTextText}>{isSubmitting ? 'Sending...' : 'Submit Ticket'}</AppText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f8fafc' }, 
  flexOne: { flex: 1 },
  screenHeader: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButtonFrame: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitleText: { fontSize: 18, color: '#352a48', letterSpacing: -0.5 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitleLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 32, marginBottom: 16, fontWeight: '800' },
  directContactCardFrame: { backgroundColor: '#ffffff', borderRadius: 28, paddingHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05, shadowRadius: 12, elevation: 4, borderWidth: 0 },
  contactRowItem: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 20 },
  contactIconWrapper: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#fff1f1', alignItems: 'center', justifyContent: 'center' },
  contactTextStack: { flex: 1, gap: 4 },
  contactMethodLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  copiableValueText: { fontSize: 15, color: '#352a48', fontWeight: '700' },
  innerCardDividerLine: { height: 1, backgroundColor: '#f8fafc' },
  formInputFieldWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 20, marginBottom: 16, paddingHorizontal: 16, height: 56,
  shadowColor: '#64748b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  formTextAreaFieldHeight: { height: 140, paddingTop: 16, paddingBottom: 16, alignItems: 'flex-start' },
  primitiveInputComponent: { flex: 1, fontSize: 15, color: '#1e293b', fontWeight: '500' },
  formExecutionSubmitButton: { backgroundColor: '#ef4444', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 24,
  shadowColor: '#ef4444', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  submitButtonTextText: { color: '#ffffff', fontSize: 16, letterSpacing: 0.5 }
});