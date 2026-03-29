import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';

// Mock workers for initial implementation
const mockWorkers = [
  { id: '1', name: 'John Doe', role: 'Manager', status: 'Active', contact: '9876543210' },
  { id: '2', name: 'Jane Smith', role: 'Milker', status: 'Active', contact: '9876543211' },
  { id: '3', name: 'Mike Ross', role: 'Vet Assistant', status: 'On Leave', contact: '9876543212' },
];

const WorkerCard = React.memo(({ item }: any) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.workerName}>{item.name}</Text>
        <View style={[styles.statusBadge, item.status === 'Active' ? styles.statusGreen : styles.statusGray]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{item.role}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{item.contact}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
});

WorkerCard.displayName = 'WorkerCard';

export default function WorkersScreen() {
  const [search, setSearch] = useState('');

  const filteredWorkers = useMemo(() => {
    return mockWorkers.filter(worker =>
      worker.name.toLowerCase().includes(search.toLowerCase()) ||
      worker.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const renderWorkerCard = useCallback(({ item }: any) => (
    <WorkerCard item={item} />
  ), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workers</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search workers..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredWorkers}
        renderItem={renderWorkerCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2e7d32',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusGreen: { backgroundColor: '#4caf50' },
  statusGray: { backgroundColor: '#9e9e9e' },
  statusText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  viewButton: {
    borderWidth: 1,
    borderColor: '#2e7d32',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
