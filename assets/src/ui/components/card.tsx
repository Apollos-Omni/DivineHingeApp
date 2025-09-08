import React from 'react';
import { View, ViewProps } from 'react-native';

export const Card: React.FC<ViewProps> = ({ style, children, ...props }) => (
  <View
    style={[{
      backgroundColor: '#12121a',
      borderRadius: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    }, style]}
    {...props}
  >
    {children}
  </View>
);
