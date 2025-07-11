import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, typography, spacing } from '../constants/theme';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  displayDate: string;
}

interface ProgressScreenProps {
  onGoBack: () => void;
  initialWeight?: number;
  userName?: string;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ 
  onGoBack, 
  initialWeight = 75,
  userName = 'Usuario'
}) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Inicializar sin registros por defecto
  useEffect(() => {
    // No inicializamos automáticamente, dejamos que el usuario agregue su primer peso
    setWeightEntries([]);
  }, []);

  const addWeightEntry = () => {
    if (!newWeight || isNaN(Number(newWeight))) {
      Alert.alert('Error', 'Por favor ingresa un peso válido');
      return;
    }

    const weight = parseFloat(newWeight);
    if (weight < 20 || weight > 300) {
      Alert.alert('Error', 'El peso debe estar entre 20 y 300 kg');
      return;
    }

    // Crear la fecha en formato local para evitar problemas de zona horaria
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight: weight,
      date: dateString,
      displayDate: selectedDate.toLocaleDateString('es-ES')
    };

    setWeightEntries(prev => [...prev, newEntry].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));

    setNewWeight('');
    setSelectedDate(new Date());
    setShowAddModal(false);
  };

  const deleteEntry = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => setWeightEntries(prev => prev.filter(entry => entry.id !== id))
        }
      ]
    );
  };

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES');
  };

  const getChartData = () => {
    if (weightEntries.length === 0) {
      // Datos de ejemplo cuando no hay registros
      return {
        labels: ['Sin datos'],
        datasets: [{
          data: [0],
          strokeWidth: 2,
          color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`, // Color dorado
        }]
      };
    }

    const sortedEntries = [...weightEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedEntries.map(entry => {
        // Crear la fecha desde el string guardado para evitar problemas de zona horaria
        const dateParts = entry.date.split('-');
        const day = dateParts[2];
        const month = dateParts[1];
        return `${day}/${month}`;
      }),
      datasets: [{
        data: sortedEntries.map(entry => entry.weight),
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`, // Color dorado
      }]
    };
  };

  const getWeightDifference = () => {
    if (weightEntries.length < 2) return null;
    
    const sortedEntries = [...weightEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const first = sortedEntries[0].weight;
    const last = sortedEntries[sortedEntries.length - 1].weight;
    const difference = last - first;
    
    return {
      value: Math.abs(difference),
      isPositive: difference > 0,
      isNeutral: difference === 0
    };
  };

  const chartData = getChartData();
  const weightDiff = getWeightDifference();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Progreso</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estadísticas generales */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {weightEntries.length > 0 ? 
                weightEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight 
                : '--'} {weightEntries.length > 0 ? 'kg' : ''}
            </Text>
            <Text style={styles.statLabel}>Peso Actual</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{weightEntries.length}</Text>
            <Text style={styles.statLabel}>Registros</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={[
              styles.statValue,
              weightDiff ? 
                (weightDiff.isPositive ? styles.positiveChange : 
                 weightDiff.isNeutral ? styles.neutralChange : styles.negativeChange)
                : styles.neutralChange
            ]}>
              {weightDiff ? 
                (weightDiff.isNeutral ? '0 kg' : 
                 (weightDiff.isPositive ? '+' : '-') + weightDiff.value.toFixed(1) + ' kg')
                : '--'
              }
            </Text>
            <Text style={styles.statLabel}>Cambio Total</Text>
          </View>
        </View>

        {/* Gráfica */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>
            {weightEntries.length === 0 ? 'Evolución del Peso (Sin datos)' : 'Evolución del Peso'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={chartData}
              width={Math.max(screenWidth - 40, chartData.labels.length * 80)}
              height={220}
              yAxisSuffix=" kg"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`, // Color dorado
                labelColor: (opacity = 1) => `rgba(160, 160, 160, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: colors.primary,
                  fill: colors.primary
                },
                propsForBackgroundLines: {
                  strokeDasharray: '', // solid background lines
                  stroke: 'rgba(160, 160, 160, 0.2)',
                  strokeWidth: 1
                }
              }}
              bezier
              style={styles.chart}
              fromZero={false}
            />
          </ScrollView>
          {weightEntries.length === 0 && (
            <Text style={styles.emptyChartText}>
              Agrega tu primer registro de peso para ver la gráfica
            </Text>
          )}
        </View>

        {/* Lista de registros */}
        <View style={styles.recordsContainer}>
          <Text style={styles.sectionTitle}>Historial de Peso</Text>
          
          {weightEntries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((entry, index) => (
            <View key={entry.id} style={styles.recordItem}>
              <View style={styles.recordInfo}>
                <Text style={styles.recordWeight}>{entry.weight} kg</Text>
                <Text style={styles.recordDate}>{entry.displayDate}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteEntry(entry.id)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          
          {weightEntries.length === 0 && (
            <View style={styles.emptyRecords}>
              <Ionicons name="analytics-outline" size={48} color={colors.text.secondary} />
              <Text style={styles.emptyRecordsText}>No hay registros de peso</Text>
              <Text style={styles.emptyRecordsSubtext}>
                Toca el botón "+" para agregar tu primer registro
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal para agregar peso */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Peso</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                value={newWeight}
                onChangeText={setNewWeight}
                placeholder="Ej: 75.5"
                placeholderTextColor={colors.text.secondary}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Fecha</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            )}

            {Platform.OS === 'ios' && showDatePicker && (
              <View style={styles.datePickerButtons}>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerButtonText}>Listo</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={addWeightEntry}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  positiveChange: {
    color: colors.success,
  },
  negativeChange: {
    color: colors.error,
  },
  neutralChange: {
    color: colors.text.secondary,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: 16,
  },
  emptyChartText: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  recordsContainer: {
    marginBottom: spacing.xl,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  recordInfo: {
    flex: 1,
  },
  recordWeight: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recordDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  emptyRecords: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  emptyRecordsText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyRecordsSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: typography.sizes.base,
    color: colors.text.primary,
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  datePickerButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  datePickerButtonText: {
    color: colors.background,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    marginLeft: spacing.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.background,
  },
});
