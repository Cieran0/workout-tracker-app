import React from 'react';
import { TouchableOpacity, View, TextInput, StyleSheet, SectionList, Text } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';
import { useExercises } from '../hooks/useExercises';
import { typography, colors, inputs } from '../shared/theme';

const Exercises: React.FC = () => {
  const router = useRouter();
  const { exercises, searchQuery, setSearchQuery, isLoading } = useExercises();

  const getSectionData = () => {
    if (searchQuery) {
      return [{ title: '', data: exercises }];
    }

    const grouped = exercises.reduce((acc, exercise) => {
      const key = exercise.name[0].toUpperCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(exercise);
      return acc;
    }, {} as { [key: string]: typeof exercises });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([title, data]) => ({ title, data }));
  };

  const renderSectionHeader = ({ section: { title } }: any) => {
    if (!title) return null;

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
        <View style={styles.sectionDivider} />
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => console.log(`Selected: ${item.name}`)}
    >
      <Text style={typography.exerciseName}>{item.name}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.bodyPart}>{item.body_part}</Text>
        <Text style={styles.weightText}>50kg</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TextInput
          style={[inputs.search, styles.searchBar]}
          placeholder="Search Exercises"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <PrimaryButton
          variant="primary"
          onPress={() => router.push('/')}
          buttonStyle={styles.addButton}
          textStyle={styles.addButtonText}
        >
          +
        </PrimaryButton>
      </View>

      <SectionList
        sections={getSectionData()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles.listFooter} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled={!searchQuery} // Disable sticky headers during search
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: '75%',
    fontSize: 20,
  },
  addButton: {
    width: '20%',
    paddingVertical: 12,
    alignItems: 'center',
    textAlign: 'center'
  },
  addButtonText: {
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 20,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  listFooter: {
  },
  sectionHeader: {
    backgroundColor: colors.background,
    marginTop: 0,
  },
  sectionHeaderText: {
    color: colors.text,
    fontSize: 24,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.muted,
    marginVertical: 8,
  },
  listItem: {
    paddingVertical: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyPart: {
    color: colors.muted,
    fontSize: 14,
  },
  weightText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#3A3A3A',
    marginVertical: 8,
  },
});

export default Exercises;