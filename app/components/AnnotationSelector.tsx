import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Image, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../shared/theme';

interface AnnotationSelectorProps {
  imageUri: string;
  onConfirm: (rectCoords: { x: number; y: number; width: number; height: number } | null) => void;
}

export default function AnnotationSelector({ imageUri, onConfirm }: AnnotationSelectorProps) {
  const [rectCoords, setRectCoords] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // Fetch image dimensions
  useEffect(() => {
    Image.getSize(imageUri, (width, height) => {
      setImageSize({ width, height });
    });
  }, [imageUri]);

  // Capture container size
  const handleContainerLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height });
  };

  const handleTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setTouchStart({ x: locationX, y: locationY });
    setCurrentCoords({ x: locationX, y: locationY, width: 0, height: 0 });
  };

  const handleTouchMove = (event: any) => {
    if (!touchStart) return;
    const { locationX, locationY } = event.nativeEvent;
    const x = Math.min(touchStart.x, locationX);
    const y = Math.min(touchStart.y, locationY);
    const width = Math.abs(locationX - touchStart.x);
    const height = Math.abs(locationY - touchStart.y);
    setCurrentCoords({ x, y, width, height });
  };

  const handleTouchEnd = (event: any) => {
    if (!touchStart) return;
    const { locationX, locationY } = event.nativeEvent;
    const x = Math.min(touchStart.x, locationX);
    const y = Math.min(touchStart.y, locationY);
    const width = Math.abs(locationX - touchStart.x);
    const height = Math.abs(locationY - touchStart.y);
    const finalCoords = { x, y, width, height };
    setRectCoords(finalCoords);
    setCurrentCoords(finalCoords);
    setTouchStart(null);
  };

  const getAbsoluteCoords = () => {
    if (!rectCoords || !containerDimensions.width || !containerDimensions.height || !imageSize) return null;

    // Convert relative coordinates to pixel values based on the image size
    const clampedX = Math.max(rectCoords.x, 0);
    const clampedY = Math.max(rectCoords.y, 0);

    return {
      x: (clampedX / containerDimensions.width) * imageSize.width, // Convert relative x to actual pixels
      y: (clampedY / containerDimensions.height) * imageSize.height, // Convert relative y to actual pixels
      width: (rectCoords.width / containerDimensions.width) * imageSize.width, // Convert relative width to actual pixels
      height: (rectCoords.height / containerDimensions.height) * imageSize.height, // Convert relative height to actual pixels
    };
  };

  return (
    <View style={styles.annotationContainer}>
      <Text style={styles.title}>Select Barbell Area</Text>
      <View style={styles.imageContainer} onLayout={handleContainerLayout}>
        <Image source={{ uri: imageUri }} style={styles.annotationImage} />
        <View
          style={StyleSheet.absoluteFill}
          onStartShouldSetResponder={() => true}
          onResponderGrant={handleTouchStart}
          onResponderMove={handleTouchMove}
          onResponderRelease={handleTouchEnd}
        >
          {(currentCoords || rectCoords) && (
            <Svg height="100%" width="100%" style={styles.annotationSvg}>
              <Rect
                x={(currentCoords || rectCoords)!.x}
                y={(currentCoords || rectCoords)!.y}
                width={(currentCoords || rectCoords)!.width}
                height={(currentCoords || rectCoords)!.height}
                fill={`${colors.primary}20`}
                stroke={colors.primary}
                strokeWidth="2"
              />
            </Svg>
          )}
        </View>
      </View>
      <Button title="Confirm Selection" onPress={() => onConfirm(getAbsoluteCoords() || rectCoords)} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  annotationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    width: '90%',
    height: '80%',
    aspectRatio: 9 / 16,
    borderColor: colors.primary,
  },
  annotationImage: {
    flex: 1,
  },
  annotationSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});