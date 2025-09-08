import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDeviceState } from '../../state/deviceState';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export const HallwayHomeScreen: React.FC = () => {
  const nav = useNavigation();
  const { devices } = useDeviceState();

  const anims = useMemo(() => {
    const map: Record<string, Animated.Value> = {};
    devices.forEach(d => { map[d.id] = new Animated.Value(0); });
    return map;
  }, [devices]);

  const bgX = useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: bgX } } }], { useNativeDriver: false });

  const openDoor = (doorId: string) => {
    const a = anims[doorId];
    if (!a) return nav.navigate('DoorHub' as never, { doorId } as never);
    Animated.timing(a, { toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => {
      a.setValue(0);
      nav.navigate('DoorHub' as never, { doorId } as never);
    });
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#0b0516','#1f0f3a','#5723a0']} style={styles.bg} />
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {devices.length === 0 ? (
          <View style={{ width, justifyContent:'center', alignItems:'center', padding: 24 }}>
            <Text style={{ color:'#fff', fontSize:22, fontWeight:'900', textAlign:'center' }}>No doors yet</Text>
            <Text style={{ color:'#cfc5ff', textAlign:'center', marginTop:8 }}>Add a device on the Devices screen, then come back here.</Text>
          </View>
        ) : devices.map((d, idx) => {
          const a = anims[d.id] ?? new Animated.Value(0);
          const rotate = a.interpolate({ inputRange:[0,1], outputRange:['0deg','-75deg'] });
          const shade = a.interpolate({ inputRange:[0,1], outputRange:[0,0.5] });
          const perspective = 800;
          return (
            <View key={d.id} style={{ width: width*0.78, marginRight: 16 }}>
              <Text style={styles.doorName}>{d.name}</Text>
              <TouchableOpacity activeOpacity={0.9} onPress={()=>openDoor(d.id)}>
                <View style={styles.frame}>
                  <Animated.View style={[styles.door, { transform: [{ perspective }, { rotateY: rotate }] }]}>
                    <LinearGradient colors={['#191326','#221a38']} style={styles.doorInner}>
                      <Text style={styles.badge}>{d.isLocked ? 'LOCKED' : 'UNLOCKED'}</Text>
                    </LinearGradient>
                  </Animated.View>
                  <Animated.View pointerEvents="none" style={[styles.shade, { opacity: shade }]} />
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex:1, backgroundColor:'#0b0516' },
  bg: { ...StyleSheet.absoluteFillObject },
  doorName: { color:'#fff', fontWeight:'900', fontSize:16, marginBottom:8, marginTop:24 },
  frame: { height: width*0.9*1.4, borderRadius:18, overflow:'hidden', borderColor:'rgba(255,255,255,0.08)', borderWidth:1, backgroundColor:'#120c20' },
  door: { ...StyleSheet.absoluteFillObject, justifyContent:'center', alignItems:'center' },
  doorInner: { width:'94%', height:'94%', borderRadius:14, justifyContent:'center', alignItems:'center' },
  badge: { color:'#cfc5ff', fontWeight:'800', letterSpacing:1 },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor:'#000' },
});
