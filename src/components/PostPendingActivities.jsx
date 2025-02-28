import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const PostPendingActivities = ({ PostImages, PostCaption, PostTime, onPress }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / (screenWidth - 44));
    setActiveImageIndex(currentIndex);
  };

  const safeImageSource = (image) => {
    // Handle different possible image formats
    if (typeof image === 'string') return { uri: image };
    if (image && image.uri) return image;
    if (image && typeof image === 'object') return { uri: image.toString() };
    return null;
  };

  const validImages = PostImages.map(safeImageSource).filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={screenWidth - 44}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollViewContent}
        >
          {validImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onPress(index)}
              activeOpacity={0.9}
              style={styles.imageContainer}
            >
              <Image
                source={image}
                style={styles.image}
                resizeMode="cover"
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dotContainer}>
          {validImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeImageIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.captionContainer}>
          <View style={styles.captionRow}>
            <Text style={styles.caption}>{PostCaption}</Text>
            <Text style={styles.dateTime}>{PostTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  postContainer: {
    marginVertical: 14,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  imageContainer: {
    width: screenWidth - 44,
    height: 280,
   
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    paddingVertical:0,
    paddingTop:0,
    marginTop:0
  },
  captionContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  captionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caption: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  dateTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#555',
  },
  dotContainer: {
    position: 'absolute',
    top: 250,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'lightgrey',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 11,
    height: 11,
    borderRadius: 6,
  },
});

export default PostPendingActivities;