import { CartItem } from '../screens/EmployeePOS';

export type RootStackParamList = {
  Login: undefined;
  AdminDashboard: undefined;
  Reports: undefined;
  ProductDashboard: undefined;
  EmployeeDashboard: undefined;
  Orders: undefined;
  LogonSession: undefined;
  Notification: undefined;
  ShiftOverview: undefined;
  MainScreen: undefined;
  EmployeePOS: {
    selectedOrder?: {
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
    };
  };
  TotalCashPOS: {
    cart: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    orderId: number;
  };
  PrintReceiptPOS: {
    cart: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    cashAmount: string;
    orderId: number;
  };
  AddEmployeeDashboard: {
    user?: {
      user_id: number;
      full_name: string;
      email: string;
      role: string;
      hired_date: string;
      status: string;
      image_url: string;
    };
  };
  OrderStatus: {
    selectedOrder?: {
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
    };
  };
};