/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  Switch,
} from 'react-native';
import React, {useEffect, useState, useRef, useContext} from 'react';
import {url, searchUrl} from './Utils/Constants';
import FastImage from 'react-native-fast-image';
import {debounce} from './Utils/Debounce';
import {EventRegister} from 'react-native-event-listeners';
import ThemeContext from './Config/ThemeContext';

export default function HomeScreen() {
  const [gifData, setGifData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState(false);
  const didMount = useRef(false);
  const theme = useContext(ThemeContext);

  getGifs = async () => {
    try {
      const newUrl = url.concat(`&page=${currentPage}`);

      const response = await fetch(newUrl);
      const json = await response.json();
      setGifData(json.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  searchGifs = async val => {
    try {
      const newUrl = searchUrl.concat(val).concat(`&page=${currentPage}`);
      console.log('newUrl= ' + newUrl);
      const response = await fetch(newUrl);
      const json = await response.json();
      setGifData(json.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSwitch = val => {
    setMode(val);
    EventRegister.emit('changeTheme', val);
  };

  const debouncedFetch = useRef(debounce(searchGifs, 1000)).current;

  useEffect(() => {
    !searchQuery
      ? getGifs()
      : didMount.current
      ? debouncedFetch(searchQuery)
      : (didMount.current = true);
  }, [currentPage, searchQuery]);

  const renderLoader = () => {
    return (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const onChangeText = val => {
    setSearchQuery(val);
  };

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      {isLoading ? (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View style={{marginVertical: 20}}>
          <TextInput
            onChangeText={val => onChangeText(val)}
            placeholder="Search..."
            placeholderTextColor={theme.color}
            value={searchQuery}
            style={{marginTop: 50}}
          />
          <Switch
            onValueChange={toggleSwitch}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            style={{marginBottom: 20, marginRight: 20}}
            value={mode}
          />
          <FlatList
            data={gifData}
            renderItem={({item}) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  margin: 1,
                }}>
                <Image
                  style={[styles.imageThumbnail]}
                  source={{uri: item.images.original.url}}
                />
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index}
            ListFooterComponent={renderLoader}
            onEndReached={loadMore}
            onEndReachedThreshold={0}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  container1: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'red',
  },
  loaderStyle: {
    marginVertical: 15,
    alignItems: 'center',
  },
});
