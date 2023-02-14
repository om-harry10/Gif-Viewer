/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import {EventRegister} from 'react-native-event-listeners';
import ThemeContext from './components/Config/ThemeContext';
import Theme from './components/Config/Theme';

import HomeScreen from './components/HomeScreen';
import Home from "./components/Home";

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: mode ? Colors.darker : Colors.lighter,
  };
  const [mode, setMode] = useState(false);

  useEffect(() =>  {
    let eventListener = EventRegister.addEventListener('changeTheme', data => {
      setMode(data);
      console.log(data);
    });
     return () => {
      EventRegister.removeEventListener(eventListener);
      
     }
  })

  return (
    <ThemeContext.Provider
    value={mode ? Theme.dark : Theme.light}
    >
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={mode ? 'light-content' : 'dark-content'}
        backgroundColor={mode ? 'black' : 'white'}
      />
      < Home />
    </SafeAreaView>
    </ThemeContext.Provider>
   
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
