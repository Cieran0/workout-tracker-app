import React, { useState } from 'react';
import { View, Button, Alert, SafeAreaView, Text } from 'react-native';
import { colors } from '../shared/theme';
import VideoTrim from '../components/VideoTrim';
import AnnotationSelector from '../components/AnnotationSelector';
import { uploadVideo, uploadMetadata } from '../services/uploadService';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function FormChecker() {
  const [step, setStep] = useState(0);
  const [exercise, setExercise] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [trimData, setTrimData] = useState<{
    startTime: number;
    endTime: number;
    videoDuration: number;
    frames: any[];
    startFrameUri: string | null;
  } | null>(null);

  // Step 0: Exercise Selection  
  const renderExerciseSelection = () => (
    <View>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
        Select Exercise
      </Text>
      <Button title="Bench Press" onPress={() => { setExercise('bench'); setStep(1); }} color={colors.primary} />
      <Button title="Squat" onPress={() => { setExercise('squat'); setStep(1); }} color={colors.primary} />
    </View>
  );

  // Step 1: Pick Video  
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

  // Called by the VideoTrim component when trim is confirmed  
  const handleTrimConfirmed = (startFrameUri: string, trimInfo: any) => {
    setTrimData({ ...trimInfo, startFrameUri });
    setStep(3);
  };

  // Called by the AnnotationSelector when the barbell area is chosen  
  const handleAnnotationConfirmed = async (selectedRect: any) => {
    console.log(selectedRect);

    if (!videoUri || !trimData) return;

    try {
      const videoUrl = await uploadVideo(videoUri);
      if (videoUrl) {
        const metadata = {
          exercise,
          startTime: trimData.startTime,
          endTime: trimData.endTime,
          barbellArea: selectedRect,
          videoUrl,
        };
        await uploadMetadata(metadata);
        Alert.alert('Success', 'Data sent to backend');
        setStep(4);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send data');
    }
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return renderExerciseSelection();
      case 1:
        return <Button title="Pick a Video" onPress={pickVideo} color={colors.primary} />;
      case 2:
        return videoUri ? (
          <VideoTrim videoUri={videoUri} onTrimConfirmed={handleTrimConfirmed} />
        ) : null;
      case 3:
        return trimData && trimData.startFrameUri ? (
          <AnnotationSelector imageUri={trimData.startFrameUri} onConfirm={handleAnnotationConfirmed} />
        ) : null;
      case 4:
        return (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
              Data Sent Successfully!
            </Text>
            <Button title="Start Over" onPress={() => setStep(0)} color={colors.primary} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {renderContent()}
    </SafeAreaView>
  );
}
