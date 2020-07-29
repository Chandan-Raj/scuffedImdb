import React, { useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableHighlight, Modal, Button, ActivityIndicator, Platform } from 'react-native';
import * as Speech from 'expo-speech';
{/*import { Audio, Permissions,FileSystem } from 'expo'*/}

export default function App() {
const apiurl = 'http://www.omdbapi.com/?apikey=d00206ee'
const [state, setState] = useState({
  s:"Enter a movie name..",
  results: [],
  selected: {}
});





{/* Audio Speech To Text Above*/}

  const search = () => {
    axios(apiurl + '&s=' + state.s).then(({ data }) => {
      let results = data.Search;
      setState(prevState=>{
        return {...prevState, results:results}
      })
    })
  }

  const openPopup = id => {
    axios(apiurl + "&i=" +id).then(({ data }) =>{
      let result = data;
      setState(prevState => {
        return{...prevState,selected:result}
      })
    })
  }

  onSpeak = () =>{
     let thingsToSay = state.selected.Plot;
    Speech.speak(thingsToSay,{
      language: 'en',
      pitch: 1,
      rate: 1
    })
  }
  
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScuffedIMDB</Text>
      <TextInput
        style={styles.searchBox}
        onChangeText={text => setState(prevState => {
          return{...prevState, s: text}
        })}
        onSubmitEditing={search}
        value={state.s}
      />
      <ScrollView style={styles.results}>
        {state.results.map(result =>(
        <TouchableHighlight key={result.imdbID} onPress={()=>openPopup(result.imdbID)}>
          <View style={styles.result}>
          <Image
            source={{ uri: result.Poster}}
            style={{
              width: '100%',
              height: 300
            }}
            resizeMode="cover"
          />
            <Text style={styles.heading}>{result.Title}</Text>
          </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
      <Modal
      animationType="fade"
      transparent={false}
      visible={(typeof state.selected.Title != 'undefined')}
      >
      <View style={styles.popup}>
      <Image
            source={{ uri: state.selected.Poster}}
            style={{
              width: '100%',
              height: 300
            }}
            resizeMode="cover"
          />
        <Text style={styles.poptile}>{state.selected.Title}</Text>
        <Text style={{marginBottom: 20}}>Rating: {state.selected.imdbRating}</Text>
        <Text>{state.selected.Plot}</Text>
        <Button title="Read Out Title" onPress={this.onSpeak}/>
      </View>
      <TouchableHighlight
      onPress={()=> setState(prevState => {
        return {...prevState, selected:{}}
      })}
      >
      <Text style={styles.closeBtn}>Close</Text>
      </TouchableHighlight>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcba03',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 70,
    paddingHorizontal: 20
  },
  title:{
    color: '#000',
    fontSize: 32,
    fontWeight: '700',
    textAlign: "center",
    marginBottom: 20
  },
  searchBox:{
    fontSize: 20,
    fontWeight: '300',
    padding: 20,
    width: '100%',
    backgroundColor:'#fff',
    borderRadius: 8,
    marginBottom: 40
  },
  results:{
    flex: 1,
  },
  result:{
    flex: 1,
    width: '100%',
    marginBottom: 20
  },
  heading:{
    color:'#000',
    fontSize: 18,
    fontWeight: '700',
    padding: 20,
    backgroundColor: '#ffcd42'
  },
  popup:{
    padding: 20
  },
  poptitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5
  },
  closeBtn: {
    padding: 20,
    fontSize: 20,
    color: '#fcba03',
    fontWeight: '700',
    backgroundColor: '#2484C4'
  }
});
