import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function AddMilkScreen() {
  const [animalId, setAnimalId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shift, setShift] = useState('morning');

  const handleSubmit = () => {
    if (!animalId || !quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Milk entry added successfully');
    // Reset form
    setAnimalId('');
    setQuantity('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Milk Entry</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Animal ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. A001"
            value={animalId}
            onChangeText={setAnimalId}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quantity (Liters) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 18.5"
            keyboardType="decimal-pad"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Shift *</Text>
          <View style={styles.shiftButtons}>
            <TouchableOpacity
              style={[styles.shiftButton, shift === 'morning' && styles.shiftButtonActive]}
              onPress={() => setShift('morning')}
            >
              <Text style={[styles.shiftButtonText, shift === 'morning' && styles.shiftButtonTextActive]}>
                Morning
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shiftButton, shift === 'evening' && styles.shiftButtonActive]}
              onPress={() => setShift('evening')}
            >
              <Text style={[styles.shiftButtonText, shift === 'evening' && styles.shiftButtonTextActive]}>
                Evening
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quality Grade</Text>
          <View style={styles.qualityButtons}>
            <TouchableOpacity style={[styles.qualityButton, styles.qualityA]}>
              <Text style={styles.qualityText}>A</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.qualityButton, styles.qualityB]}>
              <Text style={styles.qualityText}>B</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.qualityButton, styles.qualityC]}>
              <Text style={styles.qualityText}>C</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any additional notes..."
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Milk Entry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  shiftButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shiftButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  shiftButtonActive: {
    borderColor: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
  shiftButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  shiftButtonTextActive: {
    color: '#2e7d32',
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  qualityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  qualityA: {
    backgroundColor: '#4caf50',
  },
  qualityB: {
    backgroundColor: '#ff9800',
  },
  qualityC: {
    backgroundColor: '#9e9e9e',
  },
  qualityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
