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
  safeContainer: { flex: 1, backgroundColor: '#ffffff' },
  flexOne: { flex: 1 },
  screenHeader: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#f4f4f5' },
  backButtonFrame: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitleText: { fontSize: 18, color: '#352a48' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 4 },
  sectionTitleLabel: { fontSize: 12, color: '#352a48', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 24, marginBottom: 14, paddingHorizontal: 2, opacity: 0.9 },
  directContactCardFrame: { backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 1, borderColor: '#e4e4e7', paddingHorizontal: 16 },
  contactRowItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  contactIconWrapper: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' },
  contactTextStack: { flex: 1, gap: 2, overflow: 'hidden' },
  contactMethodLabel: { fontSize: 11, color: '#71717a' },
  textScrollWrapper: { flexGrow: 0, width: '100%' },
  copiableValueText: { fontSize: 14, color: '#352a48', fontWeight: '600', padding: 0, margin: 0 },
  innerCardDividerLine: { height: 1, backgroundColor: '#f4f4f5' },
  formInputFieldWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 16, marginBottom: 12, paddingHorizontal: 14, height: 50 },
  formTextAreaFieldHeight: { height: 120, paddingTop: 14, paddingBottom: 14 },
  primitiveInputComponent: { flex: 1, fontSize: 14, color: '#18181b', padding: 0, includeFontPadding: false },
  formExecutionSubmitButton: { backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  submitButtonTextText: { color: '#ffffff', fontSize: 15 }
});