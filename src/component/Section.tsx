import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { screenWidth, Sections, useColors } from '../utils/Constants';
import CustomText from './CustomText';
import * as Icons from 'lucide-react-native';
import { navigate } from '../utils/NavigationUtil';

const Section = () => {
  const Colors = useColors();
  const touchHandler = (type: string) => {
    if (type === 'password') {
      navigate('password');
    } else {
      navigate('browser');
    }
  };

  return (
    <View style={{ gap: 15, marginVertical: 15 }}>
      {Sections.map((item, index) => (
        <TouchableOpacity
          onPress={() => touchHandler(item.type)}
          key={index}
          style={[styles.container, { backgroundColor: Colors.lockButton }]}
        >
          <View style={styles.iconTextContainer}>
            <item.icon
              strokeWidth={1.2}
              color={Colors.icons}
              size={screenWidth * 0.08}
            />
            <CustomText fontFamily="Okra-Bold">{item.name}</CustomText>
          </View>

          <Icons.ChevronsRight
            color={Colors.icons}
            size={screenWidth * 0.08}
            strokeWidth={1.2}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
  },
  iconTextContainer: { flexDirection: 'row', alignItems: 'center', gap: 15 },
});
