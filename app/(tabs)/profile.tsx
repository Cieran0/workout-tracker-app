// (tabs)/profile.tsx
import React from 'react';
import { ScrollView, StyleSheet, Dimensions, SafeAreaView, View, Text } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { colors, typography, buttons, layout } from '../shared/theme';
import { AuthContext } from '../providers/AuthProvider';
import BarGraph from '../components/BarGraph';
import LineGraph from '../components/LineGraph';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const dummyData = {
  workoutsPerWeek: {
    labels: ['30/12', '6/1', '13/1', '20/1', '27/1', '3/2', '10/2', '17/2'],
    datasets: [
      {
        data: [2, 4, 4, 3, 6, 7, 5, 4],
        color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  },
  benchPressMax: {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        data: [95, 102.5, 105, 107.5, 110, 112.5, 115, 117.5],
        color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  },
};

const ProfileScreen: React.FC = () => {
  const { logout } = React.useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={typography.title}>Name</Text>
          <PrimaryButton
            variant="cancel"
            onPress={logout}
            buttonStyle={buttons.logout}
          >
            Logout
          </PrimaryButton>
        </View>

        {/* Workouts Per Week (Bar Chart) */}
        <View style={styles.chartContainer}>
        <BarGraph 
        data={dummyData.workoutsPerWeek} 
        barName='Workouts Per Week' 
        width={screenWidth - 100}/>
        </View>


        {/* 1 Rep Max - Bench Press (Line Chart) */}
        <View style={styles.chartContainer}>
          <LineGraph
            data={dummyData.benchPressMax}
            lineName='1 Rep Max - Bench Press (kg)' 
            width={screenWidth - 100}
          />
        </View>

        {/* Add More Widgets Button */}
        <PrimaryButton
          variant="primary"
          onPress={() => console.log('Add More Widgets')}
          buttonStyle={styles.addWidgetButton}
          textStyle={styles.addWidgetText}
        >
          Add More Widgets
        </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1.5, // Border width
    borderColor: '#393939', // Border color
  },
  chart: {
    borderRadius: 16,
  },
  addWidgetButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  addWidgetText: {
    alignSelf: 'center',
    fontSize: 18,
    color: colors.background,
  },
});

export default ProfileScreen;