import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import SideBar from '../components/SideBar';
import EmployeeHeaderBar from '../components/EmployeeHeaderBar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMoneyBillWave, faCreditCard, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { supabase } from '../lib/supabase';

type TotalCashPOSRouteProp = RouteProp<RootStackParamList, 'TotalCashPOS'>;

const TotalCashPOS = () => {
  const route = useRoute<TotalCashPOSRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { cart, subtotal, discount, total, paymentMethod: initialPaymentMethod, orderId } = route.params;
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [cashAmount, setCashAmount] = useState('');
  
  const Continue = async () => {
    try {
      // Get the current timestamp in ISO format for PostgreSQL
      const currentTimestamp = new Date().toISOString();
      
      // Update the necessary fields including created_at to satisfy the constraint
      const { error } = await supabase
        .from('orders')
        .update({
          cash_in_hand: parseFloat(cashAmount),
          status: 'Completed',
          payment_method: paymentMethod,
          created_at: currentTimestamp // Add this to satisfy the check constraint
        })
        .eq('order_id', orderId);
  
      if (error) {
        console.error("Error updating order:", error);
        return;
      }
  
      // Navigate to receipt screen
      navigation.navigate('PrintReceiptPOS', {
        cart,
        subtotal,
        discount,
        total,
        paymentMethod,
        cashAmount,
        orderId,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const addCashAmount = (amount: number) => {
    setCashAmount((prev) => (parseInt(prev || '0') + amount).toString());
  };

  return (
    <View style={styles.container}>
      <SideBar activeItem="EmployeePOS" />
      <View style={styles.content}>
        <EmployeeHeaderBar />
        <View style={styles.mainContent}>
          <View style={styles.leftPanel}>
            <View style={styles.paymentSummary}>
              <View style={styles.amountDueContainer}>
                <Text style={styles.amountDueText}>₱{total.toFixed(2)}</Text>
                <Text style={styles.amountDueLabel}>Total amount due</Text>
              </View>
              <View style={styles.cashReceivedContainer}>
                <Text style={styles.cashReceivedLabel}>Cash received</Text>
                <View style={styles.inputRow}>
                  {paymentMethod === 'Cash' && (
                    <FontAwesomeIcon icon={faMoneyBillWave as IconProp} size={20} style={[styles.cashIcon, { outlineWidth: 0 }]} />
                  )}
                  {paymentMethod === 'Card' && (
                    <FontAwesomeIcon icon={faCreditCard as IconProp} size={20} style={[styles.cashIcon, { outlineWidth: 0 }]} />
                  )}
                  {paymentMethod === 'E-wallet' && (
                    <FontAwesomeIcon icon={faQrcode as IconProp} size={20} style={[styles.cashIcon, { outlineWidth: 0 }]} />
                  )}
                  <View style={styles.cashInputWrapper}>
                    <TextInput
                      style={[styles.cashInput, { outlineWidth: 0 }]}
                      placeholder="Enter cash amount"
                      placeholderTextColor="#A9A9A9"
                      keyboardType="numeric"
                      value={cashAmount}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                        setCashAmount(numericValue);
                      }}
                    />
                  </View>
                  <TouchableOpacity 
                    disabled={
                      cashAmount.trim() === '' || 
                      parseFloat(cashAmount) < total // Disable if input is empty or less than total
                    }
                    onPress={Continue}
                    style={[
                      styles.editButton, 
                      (cart.length === 0 || cashAmount.trim() === '' || parseFloat(cashAmount) < total) && styles.disabledButton
                    ]}
                  >
                    <Text style={styles.continueButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.quickCashButtons}>
                  {[100, 500, 1000, 2000].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={styles.quickCashButton}
                      onPress={() => addCashAmount(amount)}
                    >
                      <Text style={styles.quickCashButtonText}>₱{amount}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Clear Button */}
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={() => setCashAmount('')}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.rightPanel}>
            <View style={styles.receipt}>
              <View style={styles.checkoutHeader}>
                <Text style={styles.checkoutText}>Checkout</Text>
              </View>
              <View style={styles.tableHead}>
                <Text style={[styles.headText, { flex: 1.4 }]}>Name</Text>
                <Text style={[styles.headText, { flex: 1.5 }]}></Text>
                <Text style={[styles.headText, { flex: 0.8 }]}>QTY</Text>
                <Text style={[styles.headText, { flex: 1 }]}>Price</Text>
              </View>
              <ScrollView style={styles.tableBody}>
                {cart && cart.length > 0 ? (
                  cart.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.bodyText, { flex: 2.2 }]}>
                        {item.product.name} ({item.size})
                      </Text>
                      <Text style={[styles.bodyText, { flex: 0.2, textAlign: 'center' }]}>
                        {item.quantity}
                      </Text>
                      <Text style={[styles.bodyText, { flex: 0.8, textAlign: 'right' }]}>
                        ₱{(item.product.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyCart}>
                    <Text style={styles.emptyCartText}>No items added</Text>
                  </View>
                )}
              </ScrollView>
              <View style={styles.tableLeg}>
                <View style={styles.legRow}>
                  <Text style={styles.legLabel}>Subtotal</Text>
                  <Text style={styles.legValue}>₱{subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.legRow}>
                  <Text style={styles.legLabel}>Discounts</Text>
                  <Text style={styles.legValue}>-₱{discount.toFixed(2)}</Text>
                </View>
                <View style={styles.legRow}>
                  <Text style={styles.legLabel}>Payment Method</Text>
                </View>
                <View style={styles.paymentMethods}>
                  <TouchableOpacity 
                    style={[styles.paymentButton, paymentMethod === 'Cash' && styles.activePayment]}
                    onPress={() => setPaymentMethod('Cash')}
                  >
                    <FontAwesomeIcon style={{ outlineWidth: 0 }} icon={faMoneyBillWave as IconProp} size={20} color={paymentMethod === 'Cash' ? 'white' : '#744E31'} />
                    <Text style={[styles.paymentText, { color: paymentMethod === 'Cash' ? 'white' : '#744E31' }]}>Cash</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.paymentButton, paymentMethod === 'Card' && styles.activePayment]}
                    onPress={() => setPaymentMethod('Card')}
                  >
                    <FontAwesomeIcon style={{ outlineWidth: 0 }} icon={faCreditCard as IconProp} size={20} color={paymentMethod === 'Card' ? 'white' : '#744E31'} />
                    <Text style={[styles.paymentText, { color: paymentMethod === 'Card' ? 'white' : '#744E31' }]}>Card</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.paymentButton, paymentMethod === 'E-wallet' && styles.activePayment]}
                    onPress={() => setPaymentMethod('E-wallet')}
                  >
                    <FontAwesomeIcon style={{ outlineWidth: 0 }} icon={faQrcode as IconProp} size={20} color={paymentMethod === 'E-wallet' ? 'white' : '#744E31'} />
                    <Text style={[styles.paymentText, { color: paymentMethod === 'E-wallet' ? 'white' : '#744E31' }]}>E-Wallet</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.tableFoot}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₱{total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 30,
  },
  leftPanel: {
    flex: 2.2,
    marginRight: 10,
  },
  rightPanel: {
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  receipt: {
    flex: 1,
    backgroundColor: 'white',
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  checkoutHeader: {
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
  },
  checkoutText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    padding: 10,
  },
  headText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableBody: {
    flex: 1,
    maxHeight: 240,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    height: 20,
  },
  bodyText: {
    fontSize: 14,
  },
  emptyCart: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    color: '#999',
    fontSize: 16,
  },
  tableLeg: {
    padding: 15,
    backgroundColor: 'rgba(217, 217, 217, 0.6)',
  },
  legRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  legLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  legValue: {
    fontSize: 14,
  },
  tableFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentSummary: {
    backgroundColor: 'white',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    height: '97.5%', 
    width: '100%', 
    justifyContent: 'center'
  },
  amountDueContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountDueText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  amountDueLabel: {
    fontSize: 16,
    color: '#999',
  },
  cashReceivedContainer: {
    marginTop: 10,
  },
  cashReceivedLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cashIcon: {
    marginRight: 10,
    color: '#744E31',
  },
  cashInputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  cashInput: {
    fontSize: 16,
    color: '#696969',
    height: 50,
  },
  continueButton: {
    backgroundColor: '#744E31',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 5,
    color: '#744E31',
  },
  gradientBackground: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  placeOrderButton: {
    justifyContent: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#A67B5B',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  quickCashButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickCashButton: {
    backgroundColor: '#A67B5B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  quickCashButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#A67B5B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    alignSelf: 'center', 
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  paymentButton: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  activePayment: {
    backgroundColor: '#744E31',
  },
  paymentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TotalCashPOS;