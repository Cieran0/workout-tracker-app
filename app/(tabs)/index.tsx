// (tabs)/index.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';
import TemplateCard from '../components/TemplateCard';
import AddTemplateButton from '../components/AddTemplateButton';
import { templates } from '../templateData';
import { buttons, colors } from '../shared/theme';

const Index: React.FC = () => {
  const router = useRouter();

  const handleStartEmptyWorkout = () => {
    router.push('/workout/WorkoutScreen');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <ScrollView 
      contentContainerStyle={styles.container} 
      style={styles.scrollView}
    >
      <View style={styles.quickStartSection}>
        <Text style={styles.title}>Quick Start</Text>
        <PrimaryButton
          variant="primary"
          onPress={handleStartEmptyWorkout}
          buttonStyle={[buttons.primary, buttons.fullWidth]}
        >
          Start An Empty Workout
        </PrimaryButton>
      </View>

      <View style={styles.templatesHeader}>
        <Text style={styles.subtitle}>Templates</Text>
        <AddTemplateButton onPress={() => console.log('Add Template')} />
      </View>

      <View style={styles.templatesContainer}>
        {templates.map((template, index) => (
          <TemplateCard
            key={index}
            name={template.name}
            exercises={template.exercises}
            date={template.date}
            style={styles.templateCard}
          />
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#0A0A0A', // Match app background color
  },
  container: {
    flexGrow: 1, // Ensure content expands properly
    backgroundColor: '#0A0A0A',
    padding: 20,
    paddingBottom: 0, // Extra padding at the bottom for scroll behavior
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  quickStartSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  templatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
  },
  templatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0, // Remove extra padding to align with edges
    gap: 5, // Gap between cards
  },
  templateCard: {
    width: '47.5%', // Two cards per row with 5% total gap
    marginBottom: 15,
  },
});

export default Index;