import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import SideBar from '../components/SideBar';
import EmployeeHeaderBar from '../components/EmployeeHeaderBar';
import ItemCard from '../components/ItemCard';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCakeCandles, faMugHot, faGlassWater, faMoneyBillWave, faCreditCard, faQrcode, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Product = {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  status: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
};

  const EmployeePOS = ({ route }: { route: { params?: { selectedOrder?: {
    fromOrderStatus: boolean;
    order_id?: number;
    status?: string;
    total_amount?: number;
    order_time?: string;
    cash_in_hand?: number;
    order_items?: Array<{ 
      product_id: number;
      product_name: string;
      quantity: number;
      unit_price: number;
      customizations?: string;
    }>;
  } } } }) => {  
  const [selectedOrder, setSelectedOrder] = useState(route.params?.selectedOrder || null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (selectedOrder) {
      console.log('Navigated with selected order:', selectedOrder);
      // Handle the `fromOrderStatus` flag if needed
      if (selectedOrder.fromOrderStatus) {
        console.log('Order originated from OrderStatus.');
      }
      // Pre-fill cart with order items if `selectedOrder` is provided
      if (selectedOrder.order_items) {
        const prefilledCart = selectedOrder.order_items.map(item => ({
          product: {
            product_id: item.product_id,
            name: item.product_name,
            price: item.unit_price,
            description: '',
            category: '',
            status: 'Active',
          },
          quantity: item.quantity,
          size: item.customizations || 'M', // Default to 'M' if no customizations
        }));
        setCart(prefilledCart);
      }
    } else {
      console.log('Navigated without selected order');
    }
  }, [selectedOrder]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const createOrder = async (status: 'Preparing' | 'Pending') => {
    try {
      // Check if the order is from OrderStatus to avoid duplication
      if (selectedOrder?.fromOrderStatus) {
        console.log('Order is from OrderStatus, skipping duplication.');
        return selectedOrder.order_id; // Return the existing order ID
      }

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert("Error", "No user session found");
        return null;
      }
  
      // Get the employee's integer ID from your employees table using their auth UUID
      const { data: employeeData, error: employeeError } = await supabase
        .from('users')
        .select('user_id')  // Assuming this is the integer ID column
        .eq('auth_uuid', session.user.id)  // Assuming you have a column that stores the auth UUID
        .single();
  
      if (employeeError || !employeeData) {
        console.error("Error finding employee:", employeeError);
        Alert.alert("Error", "Employee record not found");
        return null;
      }
  
      // Insert into orders table using the integer employee_id
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          employee_id: employeeData.user_id,  // Use the integer ID from employees table
          method: 'Manual',
          status: status,
          total_amount: total,
          order_time: new Date().toISOString(),
          payment_method: paymentMethod,
          // cash_in_hand will be updated later in TotalCashPOS
        })
        .select()
        .single();
  
      if (orderError) {
        console.error("Error creating order:", orderError);
        Alert.alert("Error", "Failed to create order");
        return null;
      }
  
      // Insert into order_items table
      const orderItems = cart.map(item => ({
        order_id: orderData.order_id,
        product_id: item.product.product_id,
        quantity: item.quantity,
        customizations: item.size, // S, M, L
        unit_price: item.product.price * item.quantity,
        // discount_id can be null if no discount
      }));
  
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
  
      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        Alert.alert("Error", "Failed to add items to order");
        
        // Delete the order if items failed
        await supabase
          .from('orders')
          .delete()
          .eq('order_id', orderData.order_id);
        
        return null;
      }
  
      return orderData.order_id;
    } catch (error) {
      console.error("Unexpected error creating order:", error);
      Alert.alert("Error", "An unexpected error occurred");
      return null;
    }
  };

  // Add a function for place order
  const placeOrder = async () => {
    const orderId = await createOrder('Preparing');
    if (orderId) {
      navigation.navigate('TotalCashPOS', {
        cart,
        subtotal,
        discount,
        total,
        paymentMethod,
        orderId, 
      });
    }
  };

  // Add a function for hold order
  const holdOrder = async () => {
    const orderId = await createOrder('Pending');
    if (orderId) {
      navigation.navigate('OrderStatus', {
        selectedOrder: { ...selectedOrder, fromOrderStatus: true }, // Mark as from OrderStatus
      });
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("product_id, name, description, price, category, image, status")
        .eq("status", "Active"); 

      if (error) {
        console.error("Error fetching products:", error);
        Alert.alert("Error", "Failed to load products");
        return;
      }

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.product_id === product.product_id && item.size === size
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { product, quantity, size }];
      }
    });
  };

  const updateQuantity = (productId: number, size: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.product_id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.product.product_id === productId && item.size === size)
      )
    );
  };

  const clearCart = async () => {
    console.log('clearCart called, current cart:', cart);
  
    if (selectedOrder && selectedOrder.status === 'Pending') {
      try {
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'Cancelled',
            cash_in_hand: 0,
            created_at: new Date().toISOString(),
          })
          .eq('order_id', selectedOrder.order_id);
  
        if (error) {
          console.error('Error updating order status to Cancelled:', error);
          Alert.alert('Error', 'Failed to cancel the order.');
          return;
        }
  
        console.log(`Order ${selectedOrder.order_id} status updated to Cancelled.`);
        Alert.alert('Order Cancelled', `Order ${selectedOrder.order_id} has been cancelled.`);
      } catch (error) {
        console.error('Unexpected error while cancelling the order:', error);
        Alert.alert('Error', 'An unexpected error occurred while cancelling the order.');
        return;
      }
    }
  
    setCart([]);
    console.log('Cart should be empty now');
  };
  

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const discount = 0; // Placeholder for discount functionality
  const total = subtotal - discount;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View>
        <SideBar activeItem="EmployeePOS" />
      </View>
      <View style={styles.content}>
        <EmployeeHeaderBar />
        <View style={styles.mainContent}>
          <View style={styles.posContainer}>
            {/* Left Panel */}
            <View style={styles.leftPanel}>
              <View style={styles.mainItemsWrapper}>
                {/* Main Items Header */}
                <View style={styles.mainItemsHeader}>
                  <TouchableOpacity
                    style={{ outlineWidth: 0 }}
                    onPress={clearCart}
                  >
                    <Text style={styles.addItemText}>+ ADD NEW ITEM</Text>
                  </TouchableOpacity>
                  <View style={styles.searchContainer}>
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass as IconProp}
                      size={16}
                      style={[styles.searchIcon, { outlineWidth: 0 }]}
                    />
                    <TextInput
                      style={[styles.searchInput, { outlineWidth: 0 }]}
                      placeholder="Search Items Here"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                </View>

                {/* Products Grid */}
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#A67B5B" />
                    <Text style={{ marginTop: 10 }}>Loading products...</Text>
                  </View>
                ) : (
                  <ScrollView style={styles.productsScrollView}>
                    <View style={styles.gridContainer}>
                      {filteredProducts.map((product) => (
                        <View key={product.product_id} style={styles.gridItem}>
                          <ItemCard 
                            product={product} 
                            onAddToCart={addToCart} 
                            includeSizeSelector={true} 
                          />
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>
              {/* Categories */}
              <View style={styles.categories}>
                <TouchableOpacity 
                  style={[styles.categoryButton, activeCategory === 'All' && styles.activeCategory]}
                  onPress={() => setActiveCategory('All')}
                >
                  <Text style={[styles.categoryText, activeCategory === 'All' && styles.activeCategoryText]}>
                    {activeCategory === 'All' ? 'All' : 'All'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.categoryButton, activeCategory === 'Desserts' && styles.activeCategory]}
                  onPress={() => setActiveCategory('Desserts')}
                >
                  <FontAwesomeIcon style={{ outlineWidth: 0 }}  icon={faCakeCandles as IconProp} size={30} color={activeCategory === 'Desserts' ? 'white' : '#744E31'} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.categoryButton, activeCategory === 'Coffee' && styles.activeCategory]}
                  onPress={() => setActiveCategory('Coffee')}
                >
                  <FontAwesomeIcon style={{ outlineWidth: 0 }}  icon={faMugHot as IconProp} size={30} color={activeCategory === 'Coffee' ? 'white' : '#744E31'} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.categoryButton, activeCategory === 'Milktea' && styles.activeCategory]}
                  onPress={() => setActiveCategory('Milktea')}
                >
                  <FontAwesomeIcon style={{ outlineWidth: 0 }}  icon={faGlassWater as IconProp} size={30} color={activeCategory === 'Milktea' ? 'white' : '#744E31'} />
                </TouchableOpacity>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    cart.length === 0 && styles.disabledButton, // Style for disabled button
                  ]}
                  onPress={clearCart}
                  disabled={cart.length === 0} // Disable if cart is empty
                >
                  <Text style={styles.buttonText}>Cancel Order</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.holdButton,
                    cart.length === 0 && styles.disabledButton, // Style for disabled button
                  ]}
                  onPress={holdOrder}
                  disabled={cart.length === 0} // Disable if cart is empty
                >
                  <Text style={styles.buttonText}>Hold Order</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Right Panel */}
            <View style={styles.rightPanel}>
              {/* Receipt */}
              <View style={styles.receipt}>
                {/* Checkout Header */}
                <View style={styles.checkoutHeader}>
                  <Text style={styles.checkoutText}>Checkout</Text>
                </View>
                
                {/* Table Head */}
                <View style={styles.tableHead}>
                  <Text style={[styles.headText, {flex: 1.4}]}>Name</Text>
                  <Text style={[styles.headText, {flex: 1.5}]}></Text>
                  <Text style={[styles.headText, {flex: .8}]}>QTY</Text>
                  <Text style={[styles.headText, {flex: 1}]}>Price</Text>
                </View>
                
                {/* Table Body */}
                <ScrollView style={styles.tableBody}>
                  {cart.length === 0 ? (
                    <View style={styles.emptyCart}>
                      <Text style={styles.emptyCartText}>No items added</Text>
                    </View>
                  ) : (
                    cart.map((cartItem, index) => (
                      <View key={index} style={styles.tableRow}>
                        <Text style={[styles.bodyText, {flex: 2.2}]}>{cartItem.product.name} ({cartItem.size})</Text>
                        <TouchableOpacity 
                          onPress={() => updateQuantity(cartItem.product.product_id, cartItem.size, cartItem.quantity - 1)} 
                          style={styles.decrementButton}
                        >
                          <Text style={styles.decrementButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={[styles.bodyText, {flex: .2, textAlign: 'center'}]}>{cartItem.quantity}</Text>
                        <Text style={[styles.bodyText, {flex: .8, textAlign: 'right'}]}>₱{(cartItem.product.price * cartItem.quantity).toFixed(2)}</Text>
                      </View>
                    ))
                  )}
                </ScrollView>
                
                {/* Table Leg */}
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
                      <FontAwesomeIcon style={{ outlineWidth: 0 }}  icon={faMoneyBillWave as IconProp} size={20} color={paymentMethod === 'Cash' ? 'white' : '#744E31'} />
                      <Text style={[styles.paymentText, {color: paymentMethod === 'Cash' ? 'white' : '#744E31'}]}>Cash</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.paymentButton, paymentMethod === 'Card' && styles.activePayment]}
                      onPress={() => setPaymentMethod('Card')}
                    >
                      <FontAwesomeIcon style={{ outlineWidth: 0 }}  icon={faCreditCard as IconProp} size={20} color={paymentMethod === 'Card' ? 'white' : '#744E31'} />
                      <Text style={[styles.paymentText, {color: paymentMethod === 'Card' ? 'white' : '#744E31'}]}>Card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.paymentButton, paymentMethod === 'E-wallet' && styles.activePayment]}
                      onPress={() => setPaymentMethod('E-wallet')}
                    >
                      <FontAwesomeIcon style={{ outlineWidth: 0 }}  icon={faQrcode as IconProp} size={20} color={paymentMethod === 'E-wallet' ? 'white' : '#744E31'} />
                      <Text style={[styles.paymentText, {color: paymentMethod === 'E-wallet' ? 'white' : '#744E31'}]}>E-Wallet</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Table Foot */}
                <View style={styles.tableFoot}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>₱{total.toFixed(2)}</Text>
                </View>
              </View>
              
              {/* Place Order Button */}
              <TouchableOpacity 
                disabled={cart.length === 0}
                onPress={placeOrder}
              >
                <LinearGradient
                  colors={['#402F23', '#594231', '#A67B5B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  locations={[0, 0.47, 1]}
                  style={[styles.gradientBackground, styles.placeOrderButton]}
                >
                  <Text style={styles.placeOrderText}>Place Order</Text>
                </LinearGradient>
              </TouchableOpacity>
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
    padding: 30,
  },
  posContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between', 
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
  mainItemsWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  mainItemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 20 ,
  },
  addItemText: {
    color: '#744E31',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 13,
    paddingVertical: 8,
    backgroundColor: '#EFEFEF',
    width: '40%',
  },
  searchInput: {
    flex: 1,
    color: '#696969',
    fontSize: 14,
  },
  searchIcon: {
    marginRight: 10,
    color: '#744E31',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productsScrollView: {
    flex: 1,
    marginBottom: 5,
  },
  gridContainer: {
    width: 720,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '33.3%',
    marginBottom: 0.3,
    paddingHorizontal: 1,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 15,
    gap: 10,
  },
  categoryButton: {
    padding: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  activeCategory: {
    backgroundColor: '#744E31',
  },
  categoryText: {
    fontSize: 12,
    color: '#744E31',
    fontWeight: 'bold',
  },
  activeCategoryText: {
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#A67B5B',
    padding: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  holdButton: {
    borderWidth: 1,
    borderColor: '#A67B5B',
    padding: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#A67B5B',
    fontWeight: 'bold',
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
    maxHeight: 200,
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
  decrementButton: {
    borderWidth: 1,
    borderColor: '#5eabec',
    borderRadius: 7,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButtonText: {
    marginTop: -4,
    color: '#5eabec',
    fontSize: 14,
    fontWeight: 'bold',
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
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  paymentButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginHorizontal: 5,
  },
  activePayment: {
    backgroundColor: '#744E31',
  },
  paymentText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
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
  placeOrderButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50, // Ensure consistent height
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EmployeePOS;