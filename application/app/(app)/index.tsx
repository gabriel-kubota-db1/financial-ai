import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react-native';

const fetchDashboardData = async () => {
  const { data } = await api.get('/dashboard');
  return data;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function DashboardScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
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
        <Text style={styles.errorText}>Failed to load dashboard data.</Text>
      </SafeAreaView>
    );
  }

  const { totalBalance, totalIncome, totalExpense, balanceByCategory } = data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.tertiary} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
          <View style={styles.incomeExpenseContainer}>
            <View style={styles.incomeExpenseBox}>
              <TrendingUp color={COLORS.green} size={24} />
              <View>
                <Text style={styles.incomeExpenseLabel}>Income</Text>
                <Text style={[styles.incomeExpenseAmount, { color: COLORS.green }]}>{formatCurrency(totalIncome)}</Text>
              </View>
            </View>
            <View style={styles.incomeExpenseBox}>
              <TrendingDown color={COLORS.red} size={24} />
              <View>
                <Text style={styles.incomeExpenseLabel}>Expense</Text>
                <Text style={[styles.incomeExpenseAmount, { color: COLORS.red }]}>{formatCurrency(totalExpense)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Balance by Category</Text>
          {balanceByCategory.length > 0 ? (
            balanceByCategory.map((item: any) => (
              <View key={item.categoryId} style={styles.categoryCard}>
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryIcon}>
                    <DollarSign size={20} color={COLORS.tertiary} />
                  </View>
                  <Text style={styles.categoryName}>{item.categoryName}</Text>
                </View>
                <Text style={[styles.categoryAmount, item.balance >= 0 ? styles.positive : styles.negative]}>
                  {formatCurrency(item.balance)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No transactions yet.</Text>
          )}
        </View>
      </ScrollView>
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
  scrollView: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    color: COLORS.primary,
  },
  balanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  balanceAmount: {
    fontFamily: FONT.bold,
    fontSize: 36,
    color: COLORS.primary,
    marginVertical: 10,
  },
  incomeExpenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray2,
    paddingTop: 15,
  },
  incomeExpenseBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  incomeExpenseLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  incomeExpenseAmount: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.medium,
  },
  categorySection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    backgroundColor: COLORS.secondary,
    padding: 8,
    borderRadius: 20,
  },
  categoryName: {
    fontFamily: FONT.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  categoryAmount: {
    fontFamily: FONT.semiBold,
    fontSize: SIZES.medium,
  },
  positive: {
    color: COLORS.green,
  },
  negative: {
    color: COLORS.red,
  },
  errorText: {
    fontFamily: FONT.regular,
    color: COLORS.red,
  },
  emptyText: {
    fontFamily: FONT.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 20,
  },
});
