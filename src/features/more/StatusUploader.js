import React, { useState } from 'react';
import { Modal, View, TextInput, Pressable, StyleSheet, Button } from 'react-native';
import { AppText } from '../../components/AppText';
import { supabase } from "../../config/supabaseClient";

export const StatusUploader = () => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const submit = async () => {
    await supabase.from('statuses').insert([{ content: text }]);
    setText('');
    setVisible(false);
  };

  return (
    <>
      <Pressable style={styles.input} onPress={() => setVisible(true)}>
        <AppText style={{ color: '#94a3b8' }}>What is the Lord saying to you?</AppText>
      </Pressable>
      <Modal visible={visible} animationType="slide">
        <View style={{ flex: 1, padding: 40, justifyContent: 'center' }}>
          <TextInput placeholder="Share your testimony..." onChangeText={setText} value={text} multiline />
          <Button title="Post" onPress={submit} />
          <Button title="Cancel" onPress={() => setVisible(false)} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({ input: { padding: 20, backgroundColor: '#f8fafc', borderRadius: 20, margin: 20 } });