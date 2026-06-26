import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const AppText = ({ style, type = 'regular', ...props }) => {
  const getFontFamily = () => {
    switch (type) {
      case 'semiBold': return 'Montserrat-SemiBold';
      case 'bold': return 'Montserrat-Bold';
      case 'black': return 'Montserrat-Black';
      default: return 'Montserrat-Regular';
    }
  };

  return <Text style={[{ fontFamily: getFontFamily() }, style]} {...props} />;
};