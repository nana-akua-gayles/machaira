import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Pressable, 
  FlatList, 
  Platform,
  Image,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Modal,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Heart, 
  MessageSquare, 
  PenSquare, 
  User, 
  EyeOff, 
  Eye,
  ArrowLeft,
  X,
  Send,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react-native';

import { AppText } from '../../../components/AppText';

// Initial Mock Feed Data with user-typed custom categories and image blocks
const INITIAL_MOCK_DATA = [
  {
    id: '1',
    author: { name: 'Emmanuel Mensah' },
    isAnonymous: false,
    category: 'Graduation 2026',
    timeAgo: '2 hours ago',
    content: 'Passed my final computer science panel defense today! God really came through when the technical questions got intense. Massive thanks to everyone who prayed with me.',
    attachedImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop', 
    likes: 24,
    hasLiked: false,
    comments: [
      { id: 'c1', author: 'Apostle Bennie', content: 'Glory to God! This is just the beginning.', timeAgo: '1h ago' }
    ]
  },
  {
    id: '2',
    author: { name: 'Anonymous Member' },
    isAnonymous: true,
    category: 'Provision',
    timeAgo: '5 hours ago',
    content: 'Just want to testify about God’s timely provision. My hostel fees were due this week and out of nowhere, an old family friend cleared the balance completely. Faith restored!',
    attachedImage: null,
    likes: 42,
    hasLiked: true,
    comments: []
  },
];

// ==========================================
// SUB-COMPONENT: CREATION FORM VIEW LAYER
// ==========================================
const CreateTestimonyForm = ({ onCancelForm, onSubmitForm }) => {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);

  const handlePickImage = () => {
    // Mock picker simulation - attaches photo image placeholder resource links
    setAttachedImage('https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600&auto=format&fit=crop');
  };

  const handlePublish = () => {
    if (!content.trim() || !category.trim()) return;

    const compiledPost = {
      id: Date.now().toString(),
      author: { name: 'Current User' },
      isAnonymous,
      category: category.trim(),
      timeAgo: 'Just now',
      content: content.trim(),
      attachedImage: attachedImage,
      likes: 0,
      hasLiked: false,
      comments: []
    };
    onSubmitForm(compiledPost);
  };

  const isFormValid = content.trim().length > 0 && category.trim().length > 0;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainWrapper}
    >
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeftSection}>
          <Pressable style={styles.backActionButton} onPress={onCancelForm}>
            <ArrowLeft color="#09090b" size={22} strokeWidth={2.2} />
          </Pressable>
          <AppText type="bold" style={styles.headerTitle}>Share Testimony</AppText>
        </View>
        <Pressable 
          style={[styles.publishBtn, !isFormValid && styles.publishBtnDisabled]} 
          onPress={handlePublish}
          disabled={!isFormValid}
        >
          <AppText type="bold" style={[styles.publishBtnText, !isFormValid && styles.publishTextDisabled]}>
            Publish
          </AppText>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.formScrollWrapper} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <AppText type="semiBold" style={styles.inputLabel}>What is this testimony about?</AppText>
          <TextInput
            style={styles.customTextInput}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g., Financial Breakthrough, Healing"
            placeholderTextColor="#a1a1aa"
            maxLength={30}
          />
        </View>

        <View style={styles.inputGroup}>
          <AppText type="semiBold" style={styles.inputLabel}>Your Story</AppText>
          <TextInput
            style={[styles.customTextInput, styles.textAreaInput]}
            value={content}
            onChangeText={setContent}
            placeholder="Type what God has done for you..."
            placeholderTextColor="#a1a1aa"
            multiline
            textAlignVertical="top"
          />
        </View>

        {attachedImage ? (
          <View style={styles.mediaPreviewContainer}>
            <Image source={{ uri: attachedImage }} style={styles.previewImage} />
            <Pressable style={styles.removeImageBtn} onPress={() => setAttachedImage(null)}>
              <X color="#ffffff" size={16} strokeWidth={2.5} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.attachImagePlaceholder} onPress={handlePickImage}>
            <ImageIcon color="#352a48" size={20} strokeWidth={2} />
            <AppText type="semiBold" style={styles.attachImageText}>Attach an image (proof, photo)</AppText>
          </Pressable>
        )}

        <View style={styles.switchCard}>
          <View style={styles.switchLabelArea}>
            <View style={styles.iconHeadingRow}>
              {isAnonymous ? <EyeOff color="#ef4444" size={18} /> : <Eye color="#10b981" size={18} />}
              <AppText type="semiBold" style={styles.switchTitle}>Post Anonymously</AppText>
            </View>
            <AppText type="regular" style={styles.switchHelpText}>
              Your name won't be visible to the Machaira community.
            </AppText>
          </View>
          <Switch
            trackColor={{ false: '#e4e4e7', true: '#ddd6fe' }}
            thumbColor={isAnonymous ? '#352a48' : '#f4f4f5'}
            onValueChange={setIsAnonymous}
            value={isAnonymous}
          />
        </View>

        <View style={styles.encouragementBanner}>
          <Sparkles color="#6d28d9" size={16} />
          <AppText type="regular" style={styles.encouragementText}>
            Your testimony builds faith in others. Thank you for sharing!
          </AppText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ==========================================
// MAIN PARENT LAYER EXPORT: TESTIMONY HARBOR
// ==========================================
export const Testimony = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [isCreating, setIsCreating] = useState(false);
  const [feedData, setFeedData] = useState(INITIAL_MOCK_DATA);
  const [activeCategory, setActiveCategory] = useState('All');

  // Comment Layer Sheet Overlay Modal States
  const [selectedTestimony, setSelectedTestimony] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Like Action Trigger Function Logic
  const handleLike = (id) => {
    setFeedData(prevData => 
      prevData.map(item => {
        if (item.id === id) {
          return {
            ...item,
            hasLiked: !item.hasLiked,
            likes: item.hasLiked ? item.likes - 1 : item.likes + 1
          };
        }
        return item;
      })
    );
  };

  // Append Comment Interaction Process 
  const handleAddComment = () => {
    if (!commentText.trim() || !selectedTestimony) return;

    const newComment = {
      id: Date.now().toString(),
      author: 'You', 
      content: commentText.trim(),
      timeAgo: 'Just now'
    };

    setFeedData(prevData => 
      prevData.map(item => {
        if (item.id === selectedTestimony.id) {
          const updatedComments = [...item.comments, newComment];
          // Sync live state shifts downward into the open viewport card layout instantly
          setSelectedTestimony({ ...item, comments: updatedComments });
          return { ...item, comments: updatedComments };
        }
        return item;
      })
    );

    setCommentText('');
  };

  const uniqueCategories = ['All', ...new Set(feedData.map(item => item.category))];
  const filteredData = activeCategory === 'All' ? feedData : feedData.filter(item => item.category === activeCategory);

  // Short circuit render when toggling composition status form
  if (isCreating) {
    return (
      <CreateTestimonyForm 
        onCancelForm={() => setIsCreating(false)}
        onSubmitForm={(newPost) => {
          setFeedData([newPost, ...feedData]);
          setIsCreating(false);
        }}
      />
    );
  }

  const renderHeader = () => (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerLeftSection}>
        <Pressable style={styles.backActionButton} onPress={onBack}>
          <ArrowLeft color="#09090b" size={22} strokeWidth={2.2} />
        </Pressable>
        <View>
          <AppText type="bold" style={styles.headerTitle}>Testimonies</AppText>
          <AppText type="regular" style={styles.headerSubtitle}>Celebrate what God is doing</AppText>
        </View>
      </View>
      
      <Pressable style={styles.createButton} onPress={() => setIsCreating(true)}>
        <PenSquare color="#ffffff" size={15} />
        <AppText type="semiBold" style={styles.createButtonText}>Share</AppText>
      </Pressable>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatarFallbackCircle, item.isAnonymous ? styles.avatarAnonBg : styles.avatarUserBg]}>
          {item.isAnonymous ? <EyeOff color="#71717a" size={15} /> : <User color="#ffffff" size={15} />}
        </View>
        <View style={styles.authorMetaStack}>
          <View style={styles.authorBadgeRow}>
            <AppText type="semiBold" style={styles.authorNameText}>
              {item.isAnonymous ? 'Anonymous Member' : item.author.name}
            </AppText>
            <View style={styles.categoryBadge}>
              <AppText type="bold" style={styles.categoryBadgeText}>{item.category}</AppText>
            </View>
          </View>
          <AppText type="regular" style={styles.timeAgoText}>{item.timeAgo}</AppText>
        </View>
      </View>

      <AppText type="regular" style={styles.contentBodyText}>{item.content}</AppText>

      {item.attachedImage && (
        <View style={styles.imageAttachmentFrame}>
          <Image source={{ uri: item.attachedImage }} style={styles.imageAttachmentContent} />
        </View>
      )}

      <View style={styles.cardFooter}>
        <Pressable style={styles.interactionButton} onPress={() => handleLike(item.id)}>
          <Heart 
            color={item.hasLiked ? '#ef4444' : '#64748b'} 
            fill={item.hasLiked ? '#ef4444' : 'transparent'} 
            size={16} 
          />
          <AppText type="semiBold" style={[styles.interactionText, item.hasLiked && styles.likedText]}>
            {item.likes} Encouragements
          </AppText>
        </Pressable>

        <Pressable style={styles.interactionButton} onPress={() => setSelectedTestimony(item)}>
          <MessageSquare color="#64748b" size={16} />
          <AppText type="semiBold" style={styles.interactionText}>
            {item.comments.length > 0 ? `${item.comments.length} Replies` : 'Reply'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.mainWrapper}>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View>
            {renderHeader()}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContainer}>
              {uniqueCategories.map((cat) => (
                <Pressable key={cat} onPress={() => setActiveCategory(cat)} style={[styles.filterPill, activeCategory === cat && styles.filterPillActive]}>
                  <AppText type="semiBold" style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>{cat}</AppText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* ==========================================
          REPLIES MODAL (BOTTOM OVERLAY SHEET)
          ========================================== */}
      <Modal
        visible={selectedTestimony !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTestimony(null)}
      >
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={styles.modalSheet}
          >
            <View style={styles.modalHeader}>
              <AppText type="bold" style={styles.modalTitle}>Replies</AppText>
              <Pressable style={styles.closeModalBtn} onPress={() => setSelectedTestimony(null)}>
                <X color="#71717a" size={18} />
              </Pressable>
            </View>

            <ScrollView style={styles.commentListContainer} showsVerticalScrollIndicator={false}>
              {selectedTestimony?.comments.length === 0 ? (
                <View style={styles.emptyCommentsBox}>
                  <AppText type="regular" style={styles.emptyCommentsText}>
                    Be the first to encourage them with a reply!
                  </AppText>
                </View>
              ) : (
                selectedTestimony?.comments.map(comment => (
                  <View key={comment.id} style={styles.commentItemCard}>
                    <View style={styles.commentAuthorRow}>
                      <AppText type="semiBold" style={styles.commentAuthorText}>{comment.author}</AppText>
                      <AppText type="regular" style={styles.commentTimeText}>{comment.timeAgo}</AppText>
                    </View>
                    <AppText type="regular" style={styles.commentBodyText}>{comment.content}</AppText>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Shifted & lifted reply bar input field stack block */}
            <View style={[styles.commentInputRow, { paddingBottom: Math.max(insets.bottom, 16) }]}>
              <TextInput
                style={styles.replyTextInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Write an encouraging reply..."
                placeholderTextColor="#a1a1aa"
                maxLength={200}
              />
              <Pressable 
                style={[styles.sendCommentBtn, !commentText.trim() && styles.sendCommentBtnDisabled]}
                onPress={handleAddComment}
                disabled={!commentText.trim()}
              >
                <Send color={commentText.trim() ? '#ffffff' : '#a1a1aa'} size={14} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#ffffff' },
  listContainer: { paddingBottom: 60 },
  formScrollWrapper: { paddingHorizontal: 20, paddingBottom: 40 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
  headerLeftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backActionButton: { paddingVertical: 4 },
  headerTitle: { fontSize: 22, color: '#09090b', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, color: '#71717a', marginTop: 1 },
  createButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#352a48', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12 },
  createButtonText: { color: '#ffffff', fontSize: 12 },
  inputGroup: { marginTop: 20 },
  inputLabel: { fontSize: 13, color: '#3f3f46', marginBottom: 8 },
  customTextInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#09090b', fontFamily: 'Montserrat-Regular' },
  textAreaInput: { minHeight: 120 },
  publishBtn: { backgroundColor: '#352a48', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  publishBtnDisabled: { backgroundColor: '#f4f4f5' },
  publishBtnText: { color: '#ffffff', fontSize: 13 },
  publishTextDisabled: { color: '#a1a1aa' },
  attachImagePlaceholder: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#f5f3ff', borderWidth: 1, borderStyle: 'dashed', borderColor: '#c084fc', borderRadius: 16, padding: 16, marginTop: 20 },
  attachImageText: { color: '#352a48', fontSize: 12 },
  mediaPreviewContainer: { marginTop: 20, width: '100%', height: 180, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  previewImage: { width: '100%', height: '100%' },
  removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(9, 9, 11, 0.7)', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  switchCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9', padding: 16, borderRadius: 16, marginTop: 24 },
  switchLabelArea: { flex: 1, paddingRight: 16 },
  iconHeadingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  switchTitle: { fontSize: 13, color: '#09090b' },
  switchHelpText: { fontSize: 11, color: '#71717a', lineHeight: 15 },
  encouragementBanner: { flexDirection: 'row', gap: 10, backgroundColor: '#faf5ff', padding: 12, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  encouragementText: { fontSize: 11, color: '#5b21b6', flex: 1 },
  filterScrollContainer: { paddingHorizontal: 20, marginBottom: 18, gap: 8 },
  filterPill: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#f4f4f5', borderWidth: 1, borderColor: '#e4e4e7' },
  filterPillActive: { backgroundColor: '#352a48', borderColor: '#352a48' },
  filterText: { fontSize: 12, color: '#71717a' },
  filterTextActive: { color: '#ffffff' },
  cardContainer: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 24, padding: 16, marginHorizontal: 20, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarFallbackCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarUserBg: { backgroundColor: '#352a48' },
  avatarAnonBg: { backgroundColor: '#e4e4e7' },
  authorMetaStack: { flex: 1 },
  authorBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  authorNameText: { fontSize: 13, color: '#09090b', flex: 1 },
  timeAgoText: { fontSize: 11, color: '#a1a1aa', marginTop: 1 },
  categoryBadge: { backgroundColor: '#e2e8f0', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 8 },
  categoryBadgeText: { fontSize: 10, color: '#475569' },
  contentBodyText: { fontSize: 13, color: '#3f3f46', marginTop: 12, lineHeight: 20 },
  imageAttachmentFrame: { width: '100%', height: 160, borderRadius: 16, overflow: 'hidden', marginTop: 12 },
  imageAttachmentContent: { width: '100%', height: '100%' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderColor: '#f1f5f9' },
  interactionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  interactionText: { fontSize: 12, color: '#64748b' },
  likedText: { color: '#ef4444' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(9, 9, 11, 0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, height: '80%', paddingHorizontal: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  modalTitle: { fontSize: 16, color: '#09090b' },
  closeModalBtn: { backgroundColor: '#f4f4f5', padding: 6, borderRadius: 12 },
  commentListContainer: { flex: 1, marginTop: 12 },
  emptyCommentsBox: { paddingVertical: 40, alignItems: 'center' },
  emptyCommentsText: { color: '#a1a1aa', fontSize: 13 },
  commentItemCard: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  commentAuthorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  commentAuthorText: { fontSize: 12, color: '#09090b' },
  commentTimeText: { fontSize: 11, color: '#a1a1aa' },
  commentBodyText: { fontSize: 13, color: '#3f3f46', lineHeight: 18 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f4f4f5', backgroundColor: '#ffffff' },
  replyTextInput: { flex: 1, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, fontSize: 13, color: '#09090b', fontFamily: 'Montserrat-Regular' },
  sendCommentBtn: { backgroundColor: '#352a48', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sendCommentBtnDisabled: { backgroundColor: '#f4f4f5' }
});