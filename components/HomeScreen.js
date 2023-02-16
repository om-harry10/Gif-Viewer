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
  TouchableOpacity,
  Dimensions,
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
  const [selectedIDs, setSelectedIDs] = useState([]);
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

  const onPress = id => {
    selectedIDs.includes(id)
      ? selectedIDs.splice(selectedIDs.indexOf(id), 1)
      : selectedIDs.push(id);
    setSelectedIDs([...selectedIDs]);
  };

  const renderItem = item => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item.id)}
        style={styles.gifCellStyle}>
        <Image
          style={[styles.imageThumbnail]}
          source={{
            uri: selectedIDs.includes(item.id)
              ? item.images.original_still.url
              : item.images.original.url,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      {isLoading ? (
        <View style={[styles.container, {justifyContent: 'center'}]}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View style={{marginVertical: 10}}>
          <TextInput
            onChangeText={val => onChangeText(val)}
            placeholder="Search..."
            placeholderTextColor={theme.color}
            value={searchQuery}
            style={{color: theme.color}}
          />
          <Switch
            onValueChange={toggleSwitch}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            style={styles.switch}
            value={mode}
          />
          <FlatList
            data={gifData}
            renderItem={({item}) => renderItem(item)}
            //Setting the number of column
            numColumns={2}
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
  },
  imageThumbnail: {
    height: 200,
  },
  container1: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'red',
  },
  loaderStyle: {
    marginVertical: 15,
  },
  gifCellStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 2,
  },
  switch: {marginBottom: 20, marginRight: 20},
});

//{height:parseInt(item.images.original.height), width: parseInt(item.images.original.width)}
