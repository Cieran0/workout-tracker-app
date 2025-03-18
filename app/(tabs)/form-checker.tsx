import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Alert, Dimensions, SafeAreaView, Text, Image, LayoutChangeEvent, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../shared/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FormChecker() {
  const [exercise, setExercise] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [step, setStep] = useState(0);
  const [frames, setFrames] = useState<any[]>([]);
  const [containerWidth, setContainerWidth] = useState(screenWidth);
  const timelineRef = useRef<View>(null);
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Play/pause state
  const [progressPosition, setProgressPosition] = useState<number>(0); // Current playback position
  const [startFrameUri, setStartFrameUri] = useState<string | null>(null);
  const [rectCoords, setRectCoords] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      setStep(2);
    }
  };

  const handleVideoLoad = async (status: any) => {
    if (status.durationMillis) {
      const duration = status.durationMillis / 1000;
      setVideoDuration(duration);
      setEndTime(duration);
      await generateFrames(duration);
    }
  };

  const generateFrames = async (duration: number) => {
    const frameCount = Math.min(20, Math.round(duration));
    const interval = duration / frameCount;
    const frames = [];

    for (let i = 0; i < frameCount; i++) {
      const time = i * interval;
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri!, {
          time: Math.round(time * 1000),
          quality: 0.5,
        });
        frames.push({ time, uri });
      } catch (error) {
        console.error('Error generating thumbnail:', error);
      }
    }

    setFrames(frames);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const handleStartPan = (event: any) => {
    if (timelineRef.current && event.nativeEvent.state === State.ACTIVE) {
      timelineRef.current.measure((x, y, width, height, pageX) => {
        const touchX = event.nativeEvent.absoluteX - pageX;
        const newTime = (touchX / containerWidth) * videoDuration;
        setStartTime(Math.max(0, Math.min(newTime, endTime)));
      });
    }
  };

  const handleEndPan = (event: any) => {
    if (timelineRef.current && event.nativeEvent.state === State.ACTIVE) {
      timelineRef.current.measure((x, y, width, height, pageX) => {
        const touchX = event.nativeEvent.absoluteX - pageX;
        const newTime = (touchX / containerWidth) * videoDuration;
        setEndTime(Math.max(startTime, Math.min(newTime, videoDuration)));
      });
    }
  };

  const handleProgressPan = (event: any) => {
    if (timelineRef.current && event.nativeEvent.state === State.ACTIVE) {
      timelineRef.current.measure((x, y, width, height, pageX) => {
        const touchX = event.nativeEvent.absoluteX - pageX;
        const newPosition = (touchX / containerWidth) * videoDuration;
        setProgressPosition(Math.max(0, Math.min(newPosition, videoDuration)));

        // Seek the video to the new position
        if (videoRef.current) {
          videoRef.current.setPositionAsync(newPosition * 1000);
        }
      });
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const interval = setInterval(async () => {
        if (isPlaying) {
          const status = await videoRef.current?.getStatusAsync();
          if (status?.isLoaded && !status.isBuffering) {
            setProgressPosition(status.positionMillis / 1000);
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleConfirmTrim = async () => {
    if (!videoUri) return;

    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: Math.round(startTime * 1000),
        quality: 0.8,
      });
      setStartFrameUri(uri);
      setStep(3);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate frame');
    }
  };

  const handleTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setTouchStart({ x: locationX, y: locationY });
  };

  const handleTouchEnd = (event: any) => {
    if (!touchStart) return;

    const { locationX, locationY } = event.nativeEvent;
    const x = Math.min(touchStart.x, locationX);
    const y = Math.min(touchStart.y, locationY);
    const width = Math.abs(locationX - touchStart.x);
    const height = Math.abs(locationY - touchStart.y);

    setRectCoords({ x, y, width, height });
    setTouchStart(null);
  };

  const handleSendData = async () => {
    if (!videoUri || !rectCoords) {
      Alert.alert('Error', 'Please complete all steps');
      return;
    }

    const payload = {
      exercise,
      videoUri,
      startTime,
      endTime,
      barbellArea: rectCoords,
    };

    console.log('Sending data:', payload);
    Alert.alert('Success', 'Data sent to backend');
    setStep(4); // Reset or navigate
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <GestureHandlerRootView style={styles.container}>
        {step === 0 && (
          <View>
            <Text style={styles.title}>Select Exercise</Text>
            <Button title="Bench Press" onPress={() => { setExercise('bench'); setStep(1); }} color={colors.primary} />
            <Button title="Squat" onPress={() => { setExercise('squat'); setStep(1); }} color={colors.primary} />
          </View>
        )}

        {step === 1 && (
          <Button title="Pick a Video" onPress={pickVideo} color={colors.primary} />
        )}

        {step === 2 && videoUri && (
          <View style={styles.videoContainer}>
            {/* Video Player */}
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={styles.video}
              onLoad={handleVideoLoad}
              shouldPlay={isPlaying}
            />

            {/* Tap to Play/Pause */}
            <View style={styles.tapArea} onStartShouldSetResponder={() => true} onResponderRelease={() => setIsPlaying(!isPlaying)} />

            {/* Timeline and Handles */}
            <View
              ref={timelineRef}
              style={styles.timelineContainer}
              onLayout={handleLayout}
            >
              <View style={styles.timeline}>
                {frames.map((frame, index) => (
                  <Image
                    key={index}
                    source={{ uri: frame.uri }}
                    style={[styles.frame, { width: containerWidth / frames.length }]}
                  />
                ))}
              </View>

              {/* Start Handle */}
              <PanGestureHandler onGestureEvent={handleStartPan}>
                <View style={[styles.handleContainer, { left: (startTime / videoDuration) * containerWidth - 20 }]}>
                  <View style={[styles.handle, { backgroundColor: colors.primary }]} />
                </View>
              </PanGestureHandler>

              {/* End Handle */}
              <PanGestureHandler onGestureEvent={handleEndPan}>
                <View style={[styles.handleContainer, { left: (endTime / videoDuration) * containerWidth - 20 }]}>
                  <View style={[styles.handle, { backgroundColor: colors.primary }]} />
                </View>
              </PanGestureHandler>

              {/* Progress Indicator */}
              <PanGestureHandler onGestureEvent={handleProgressPan}>
                <View style={[styles.handleContainer, { left: (progressPosition / videoDuration) * containerWidth - 20 }]}>
                  <View style={[styles.handle, { backgroundColor: 'yellow' }]} />
                </View>
              </PanGestureHandler>

              <View style={styles.timestamps}>
                <Text style={styles.timestamp}>{startTime.toFixed(1)}s</Text>
                <Text style={styles.timestamp}>{endTime.toFixed(1)}s</Text>
              </View>
            </View>

            <Button title="Confirm Trim" onPress={handleConfirmTrim} color={colors.primary} />
          </View>
        )}

        {step === 3 && startFrameUri && (
          <View style={styles.annotationContainer}>
            <Text style={styles.title}>Select Barbell Area</Text>

            <View style={styles.imageContainer}>
              <Image
                source={{ uri: startFrameUri }}
                style={styles.annotationImage}
                resizeMode="contain"
              />

              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPressIn={handleTouchStart}
                onPressOut={handleTouchEnd}
              >
                {rectCoords && (
                  <Svg
                    height="100%"
                    width="100%"
                    style={styles.annotationSvg}
                  >
                    <Rect
                      x={rectCoords.x}
                      y={rectCoords.y}
                      width={rectCoords.width}
                      height={rectCoords.height}
                      fill="rgba(255,255,0,0.3)"
                      stroke="yellow"
                      strokeWidth="2"
                    />
                  </Svg>
                )}
              </TouchableOpacity>
            </View>

            <Button title="Confirm Selection" onPress={handleSendData} color={colors.primary} />
          </View>
        )}

        {step === 4 && (
          <View style={styles.successContainer}>
            <Text style={styles.title}>Data Sent Successfully!</Text>
            <Button title="Start Over" onPress={() => setStep(0)} color={colors.primary} />
          </View>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: screenWidth,
    height: screenHeight / 2,
  },
  tapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  timelineContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  timeline: {
    flexDirection: 'row',
    height: 60,
  },
  frame: {
    height: '100%',
  },
  handleContainer: {
    position: 'absolute',
    width: 40, // Larger hit area
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 2,
    height: '100%',
  },
  timestamps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  timestamp: {
    color: colors.text,
    fontSize: 14,
  },
  annotationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    width: (screenHeight /4)*3  / 0.5625,
    height: (screenHeight /4)*3 , // 16:9 aspect ratio
    marginVertical: 20,
  },
  annotationImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  annotationSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});