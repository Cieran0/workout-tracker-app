import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import HistoryCard from '../components/HistoryCard';
import { historyData } from '../historyData';
import { typography, colors } from '../shared/theme';

const History: React.FC = () => {
  // Sort sessions by date (newest first)
  const sortedHistory = React.useMemo(() => {
    return [...historyData].sort((a, b) => b.dateEpoch - a.dateEpoch);
  }, []);

  // Group sessions by month/year
  const getSectionData = React.useMemo(() => {
    const grouped = sortedHistory.reduce((acc, session) => {
      const date = new Date(session.dateEpoch * 1000);
      const monthYear = date.toLocaleString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(session);
      return acc;
    }, {} as { [key: string]: typeof historyData });

    return Object.keys(grouped)
      .sort((a, b) => {
        // Sort sections by most recent first
        const firstA = grouped[a][0].dateEpoch;
        const firstB = grouped[b][0].dateEpoch;
        return firstB - firstA;
      })
      .map(key => ({
        title: key,
        data: grouped[key]
      }));
  }, [sortedHistory]);

  return (
    <SectionList
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      sections={getSectionData}
      keyExtractor={(session) => session.dateEpoch.toString()}
      renderItem={({ item }) => <HistoryCard session={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{title}</Text>
          <View style={styles.sectionDivider} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={true}
      SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
    />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingTop: 10,
    paddingBottom: 4,
  },
  sectionHeaderText: {
    ...typography.title,
    fontSize: 20,
    color: colors.text,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.muted,
    marginVertical: 8,
  },
  sectionSeparator: {
    height: 16,
  },
});

export default History;