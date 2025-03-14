import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TemplateCardProps {
  name: string;
  exercises: string[];
  date: string;
  style?: any; // Add style prop
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  name, 
  exercises, 
  date,
  style 
}) => {
  return (
    <View style={[styles.card, style, styles.innerBorder]}>
        <Text style={styles.name}>{name}</Text>
        {exercises.map((exercise, index) => (
          <Text key={index} style={styles.exercise}>
            {exercise}
          </Text>
        ))}
        <Text style={styles.more}>More...</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{date}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
scrollView: {
    flex: 1, // Add this
    backgroundColor: '#0A0A0A',
  },
  container: {
    flexGrow: 1, // Change from flex: 1 to flexGrow: 1
    backgroundColor: '#0A0A0A',
    padding: 20,
    paddingBottom: 40, // Add extra padding at bottom
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
    padding: 4, // Padding to create space for the inner border
  },
  innerBorder: {
    backgroundColor: '#1A1A1A', // Same background color as the outer card
    padding: 8, // Original padding moved here
    borderWidth: 1.5, // Inner border width
    borderColor: '#393939', // Lighter border color
    borderStyle: 'solid', // Border style
    borderRadius: 8, // Slightly smaller radius to fit within the outer card
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    alignSelf: 'center',
  },
  exercise: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 4,
  },
  more: {
    color: '#888888',
    fontSize: 14,
    marginTop: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  date: {
    color: '#888888',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default TemplateCard;