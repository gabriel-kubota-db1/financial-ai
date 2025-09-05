import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

const fetchTransactions = async () => {
  const { data } = await api.get('/transactions');
  return data;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const TransactionItem = ({ item }: { item: any }) => {
  const isIncome = item.amount > 0;
  return (
    <View style={styles.itemContainer}>
      <View style={[styles.iconContainer, { backgroundColor: isIncome ? COLORS.green + '20' : COLORS.red + '20' }]}>
        {isIncome ? <ArrowUpRight color={COLORS.green} size={24} /> : <ArrowDownLeft color={COLORS.red} size={24} />}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemCategory}>{item.category.name}</Text>
      </View>
      <View style={styles.itemAmountContainer}>
        <Text style={[styles.itemAmount, { color: isIncome ? COLORS.green : COLORS.red }]}>
          {formatCurrency(item.amount)}
        </Text>
        <Text style={styles.itemDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );
};

export default function HistoryScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.tertiary} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Failed to load transaction history.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.tertiary} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
  },
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
  list: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 25,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemDescription: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  itemCategory: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  itemAmountContainer: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.medium,
  },
  itemDate: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  errorText: {
    fontFamily: FONT.regular,
    color: COLORS.red,
  },
  emptyText: {
    fontFamily: FONT.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 50,
  },
});
