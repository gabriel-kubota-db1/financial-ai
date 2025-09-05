import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';

const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

const addTransaction = async (transactionData: any) => {
  const { data } = await api.post('/transactions', transactionData);
  return data;
};

export default function AddTransactionScreen() {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const mutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      Alert.alert('Success', 'Transaction added successfully!');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      reset();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add transaction.');
    },
  });

  const onSubmit = (data: any) => {
    const amount = parseFloat(data.amount);
    const transactionData = {
      ...data,
      amount: type === 'expense' ? -amount : amount,
    };
    mutation.mutate(transactionData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Transaction</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.activeType]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeButtonText, type === 'expense' && styles.activeTypeText]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.activeType]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeButtonText, type === 'income' && styles.activeTypeText]}>Income</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Feather name="dollar-sign" size={20} color={COLORS.gray} style={styles.icon} />
          <Controller
            control={control}
            name="amount"
            rules={{ required: 'Amount is required', pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Invalid amount' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor={COLORS.gray}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            )}
          />
        </View>
        {errors.amount && <Text style={styles.errorText}>{errors.amount.message as string}</Text>}

        <View style={styles.inputContainer}>
          <Feather name="tag" size={20} color={COLORS.gray} style={styles.icon} />
          <Controller
            control={control}
            name="categoryId"
            rules={{ required: 'Category is required' }}
            render={({ field: { onChange, value } }) => (
              // In a real app, this would be a picker/dropdown
              <TextInput
                style={styles.input}
                placeholder="Category ID (e.g., 1, 2, 3)"
                placeholderTextColor={COLORS.gray}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            )}
          />
        </View>
        {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId.message as string}</Text>}
        {categoriesLoading ? <ActivityIndicator /> : (
          <View style={styles.categoryHelp}>
            <Text style={styles.categoryHelpText}>Available IDs: {categories?.map((c:any) => `${c.name} (${c.id})`).join(', ')}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Feather name="edit-2" size={20} color={COLORS.gray} style={styles.icon} />
          <Controller
            control={control}
            name="description"
            rules={{ required: 'Description is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor={COLORS.gray}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        {errors.description && <Text style={styles.errorText}>{errors.description.message as string}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={mutation.isPending}>
          {mutation.isPending ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Add Transaction</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.primary,
  },
  form: {
    paddingHorizontal: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray2,
    borderRadius: SIZES.small,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.small,
  },
  activeType: {
    backgroundColor: COLORS.tertiary,
  },
  typeButtonText: {
    fontFamily: FONT.semiBold,
    color: COLORS.gray,
  },
  activeTypeText: {
    color: COLORS.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.tertiary,
    paddingVertical: 15,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
  },
  categoryHelp: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  categoryHelpText: {
    fontFamily: FONT.regular,
    color: COLORS.gray,
    fontSize: SIZES.small,
  }
});
