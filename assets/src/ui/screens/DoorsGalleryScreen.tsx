import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BackButton } from '../components/BackButton';
type DoorPic = { id: string; name: string; closedUri: string; openUri: string };
const SAMPLE: DoorPic[] = [
  { id:'d1', name:'Front Door', closedUri:'https://placehold.co/320x180?text=Door+Closed', openUri:'https://placehold.co/320x180?text=Door+Open' },
  { id:'d2', name:'Garage', closedUri:'https://placehold.co/320x180?text=Garage+Closed', openUri:'https://placehold.co/320x180?text=Garage+Open' },
];
export const DoorsGalleryScreen: React.FC = () => { const [open, setOpen] = useState<Record<string, boolean>>({}); return (
  <View style={styles.container}>
    <BackButton /><Text style={styles.title}>Doors Gallery</Text>
    {SAMPLE.map(item => { const isOpen = !!open[item.id]; const uri = isOpen ? item.openUri : item.closedUri; return (
      <TouchableOpacity key={item.id} onPress={()=> setOpen(s => ({...s,[item.id]:!isOpen}))} style={styles.card}>
        <Image source={{ uri }} style={styles.img} />
        <Text style={styles.name}>{item.name} — {isOpen ? 'Open' : 'Closed'}</Text>
        <Text style={styles.hint}>Tap to {isOpen ? 'close' : 'open'}</Text>
      </TouchableOpacity>
    ); })}
  </View>
)};
const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#121212',padding:16}, title:{color:'#fff',fontWeight:'900',fontSize:22,marginBottom:12}, card:{backgroundColor:'#1a1624',borderRadius:12,padding:12,marginBottom:12}, img:{width:'100%',height:180,borderRadius:8,backgroundColor:'#000'}, name:{color:'#fff',fontWeight:'800',marginTop:8}, hint:{color:'#cfcfcf'} });
