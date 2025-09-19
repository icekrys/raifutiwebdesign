import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import SideBar from '../components/SideBar';
import EmployeeHeaderBar from '../components/EmployeeHeaderBar';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Define types based on your database schema
type OrderItem = {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  customizations: string | null;
  unit_price: number;
  discount_id: number | null;
  created_at: string;
  products: {
    name: string;
  } | null;
};

type Order = {
  order_id: number;
  status: string;
  total_amount: number;
  order_time: string;
  cash_in_hand: number | null;
  order_items: OrderItem[];
};

// Define the type expected by the navigation
type NavigationOrder = {
  order_id: number;
  status: string;
  total_amount: number;
  order_time: string;
  cash_in_hand?: number;
  order_items: {
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    customizations?: string;
  }[];
  fromOrderStatus: boolean; // Add this property
};

const OrderStatus = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null); 
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // First, fetch all pending orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('status', 'Pending')
          .order('order_time', { ascending: true });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          return;
        }

        if (!ordersData || ordersData.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // Get all order IDs
        const orderIds = ordersData.map(order => order.order_id);

        // Fetch order items with product information
        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              name
            )
          `)
          .in('order_id', orderIds);

        if (orderItemsError) {
          console.error('Error fetching order items:', orderItemsError);
          return;
        }

        // Group order items by order_id
        const orderItemsByOrderId: Record<number, OrderItem[]> = {};
        
        orderItemsData?.forEach(item => {
          if (!orderItemsByOrderId[item.order_id]) {
            orderItemsByOrderId[item.order_id] = [];
          }
          
          orderItemsByOrderId[item.order_id].push({
            order_item_id: item.order_item_id,
            order_id: item.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            customizations: item.customizations,
            unit_price: item.unit_price,
            discount_id: item.discount_id,
            created_at: item.created_at,
            products: item.products ? { name: item.products.name } : null
          });
        });

        // Combine orders with their items
        const formattedOrders: Order[] = ordersData.map(order => ({
          order_id: order.order_id,
          status: order.status,
          total_amount: order.total_amount,
          order_time: order.order_time,
          cash_in_hand: order.cash_in_hand,
          order_items: orderItemsByOrderId[order.order_id] || []
        }));

        console.log('Fetched orders:', formattedOrders);
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Unexpected error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time subscription for order updates
    const subscription = supabase
      .channel('orders_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'orders' }, 
        fetchOrders
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'orders' }, 
        fetchOrders
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleProceed = () => {
    if (selectedOrder !== null) {
      const orderData = orders.find(order => order.order_id === selectedOrder);
      if (orderData) {
        const navigationOrder = {
          order_id: orderData.order_id,
          status: orderData.status,
          total_amount: orderData.total_amount,
          order_time: orderData.order_time,
          cash_in_hand: orderData.cash_in_hand || undefined,
          order_items: orderData.order_items.map(item => ({
            product_id: item.product_id,
            product_name: item.products?.name || `Product ${item.product_id}`,
            quantity: item.quantity,
            unit_price: item.unit_price,
            customizations: item.customizations || undefined
          })),
          fromOrderStatus: true, // This is the crucial property
        };
  
        navigation.navigate('EmployeePOS', { selectedOrder: navigationOrder });
      }
    }
  };

  return (
    <View style={styles.container}>
      <SideBar activeItem="OrderStatus" />
      <View style={styles.content}>
        <EmployeeHeaderBar />
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Pending Orders</Text>
            <TouchableOpacity
              style={[styles.proceedButton, !selectedOrder && styles.disabledButton]}
              onPress={handleProceed}
              disabled={!selectedOrder}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#A67B5B" />
          ) : orders.length === 0 ? (
            <View style={styles.noOrdersContainer}>
              <Text style={styles.noOrdersText}>No pending orders available.</Text>
            </View>
          ) : (
            <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
              {orders.map((order) => (
                <TouchableOpacity
                  key={order.order_id}
                  style={[
                    styles.receiptContainer,
                    selectedOrder === order.order_id && styles.selectedReceipt,
                  ]}
                  onPress={() => setSelectedOrder(
                    selectedOrder === order.order_id ? null : order.order_id
                  )} // Select or deselect the order
                >
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>Order #{order.order_id}</Text>
                    <TouchableOpacity
                      style={styles.touchableSquare}
                      onPress={(e) => {
                        e.stopPropagation(); // Prevent triggering the receipt press
                        setSelectedOrder(
                          selectedOrder === order.order_id ? null : order.order_id
                        ); // Toggle selection
                      }}
                    >
                      {selectedOrder === order.order_id && (
                        <Ionicons name="close-outline" size={24} />
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.receiptTitleContainer}>
                    <View style={styles.dashedBorder} />
                    <Text style={styles.receiptTitle}>RECEIPT</Text>
                    <View style={styles.dashedBorder} />
                  </View>

                  <View style={styles.receiptBody}>
                    {order.order_items.map((orderItem) => (
                      <View key={orderItem.order_item_id} style={styles.orderItem}>
                        <Text>{orderItem.quantity}x</Text>
                        <Text style={styles.itemName}>
                          {orderItem.products?.name || `Product ${orderItem.product_id}`}
                        </Text>
                        <Text>₱{orderItem.unit_price.toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.totalAmountRow}>
                    <View style={styles.dashedBorder} />
                    <View style={styles.totalContainer}>
                      <Text>TOTAL AMOUNT:</Text>
                      <Text>₱{order.total_amount.toFixed(2)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#A67B5B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  proceedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersText: {
    fontSize: 18,
    color: '#999',
  },
  scrollContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  receiptContainer: {
    borderWidth: 1,
    width: 300,
    borderColor: '#000',
    padding: 15,
    backgroundColor: '#fff',
  },
  selectedReceipt: {
    borderColor: '#A67B5B',
    borderWidth: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  touchableSquare: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  receiptTitleContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  dashedBorder: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: '#000',
    width: '100%',
    marginVertical: 5,
  },
  receiptBody: {
    marginVertical: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  itemName: {
    flex: 1,
    marginHorizontal: 10,
  },
  totalAmountRow: {
    marginVertical: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default OrderStatus;