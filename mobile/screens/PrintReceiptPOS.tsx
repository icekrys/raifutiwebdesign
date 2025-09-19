import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import SideBar from '../components/SideBar';
import EmployeeHeaderBar from '../components/EmployeeHeaderBar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMoneyBillWave, faCreditCard, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import RenderHTML from "react-native-render-html";
import ViewShot from "react-native-view-shot"; 
import { supabase } from '../lib/supabase';

type PrintReceiptPOSRouteProp = RouteProp<RootStackParamList, 'PrintReceiptPOS'>;

const PrintReceiptPOS = () => {
  const route = useRoute<PrintReceiptPOSRouteProp>();
  const { cart, subtotal, discount, total, paymentMethod: initialPaymentMethod, cashAmount } = route.params;
  const [paymentMethod] = useState(initialPaymentMethod);
  const [modalVisible, setModalVisible] = useState(false);
  const [cashierName, setCashierName] = useState('Unknown');

  const change = parseFloat(cashAmount) - total;

  // ✅ Ref for ViewShot with proper typing
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    const fetchCashierName = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { data: user, error } = await supabase
          .from('users')
          .select('full_name')
          .eq('auth_uuid', session.session.user.id)
          .maybeSingle();

        if (!error && user) {
          setCashierName(user.full_name);
        }
      }
    };

    fetchCashierName();
  }, []);

  // ✅ generate receipt HTML (for preview in RenderHTML)
  const generateHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en"> 
      <head>
        <meta charset="UTF-8" />
        <title>Receipt</title>
      </head>
      <body style="background-color:#f5f5f5;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px;margin:0;font-family:Arial,Helvetica,sans-serif;">
        <div style="background-color:white;padding:10px 15px;width:250px;box-sizing:border-box;font-size:12px;line-height:1.2;">
          
          <!-- Store Info -->
          <div style="text-align:center;font-weight:bold;font-size:14px;margin-bottom:5px;">
            Ralfuti's Cafe Online Shop
          </div>
          
          <div style="font-size:10px;line-height:1.2;text-align:center;">
            18 De julio Street, Polo, Ward II, Mingianilla,<br>
            Philippines, 6046
          </div>
          
          <div style="font-size:10px;margin-bottom:10px;text-align:center;">
            Cebu City (032) 383 0855
          </div>

          <!-- Header -->
          <div style="text-align:center;font-weight:bold;margin-bottom:10px;">
            SALES INVOICE
          </div>

          <div style="margin-bottom:10px;">
            <div>Cashier: ${cashierName}</div>
            <div>POS: Tablet</div>
          </div>

          <div>-------------------------------------------------------</div>
          
          <!-- Items -->
          <div style="margin:8px 0;">
            ${cart.map(item => `
              <div style="display:flex;justify-content:space-between;">
                <div>${item.product.name} (${item.size})</div> <div>₱${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#666;">
                <div>${item.quantity} × ₱${item.product.price.toFixed(2)}</div>
              </div>
            `).join("")}
          </div>

          <div>-------------------------------------------------------</div>

          <!-- Payment Method -->
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <div style="font-weight:bold;">PAYMENT METHOD</div> <div>${paymentMethod}</div>
          </div>

          <!-- Subtotal & Discount -->
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <div>SUBTOTAL</div> <div> ₱${subtotal.toFixed(2)}</div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <div>DISCOUNT</div> <div>₱${discount.toFixed(2)}</div>
          </div>

          <div>-------------------------------------------------------</div>

          <!-- Total Amount -->
          <div style="display:flex;justify-content:space-between;font-weight:bold;margin-top:10px;margin-bottom:5px;">
            <div>TOTAL AMOUNT</div> <div>₱${total.toFixed(2)}</div>
          </div>

          <!-- Cash & Change -->
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <div>CASH</div> <div>₱${parseFloat(cashAmount).toFixed(2)}</div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
            <div>CHANGE</div> <div>₱${change.toFixed(2)}</div>
          </div>

          <div style="border-top:1px dashed #000;margin:8px 0;"></div>
          
          <!-- Footer -->
          <div style="text-align:center;margin-top:10px;">
            <div style="margin-bottom:8px;">Thank you for buying!</div>
            <div style="display:flex;justify-content:space-between;font-size:10px;">
              <div>${new Date().toLocaleString()}</div> <div>#TBN5</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };


  // ✅ Capture ViewShot -> PDF
  const captureAndExportPDF = async () => {
    try {
      // Step 1: use your generateHTML() directly
      const html = generateHTML();
  
      // Step 2: generate PDF from HTML
      const { uri: pdfUri } = await Print.printToFileAsync({ html });
  
      // Step 3: share or download
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        console.log("PDF generated at:", pdfUri);
        alert("PDF generated. Check your Downloads folder.");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  return (
    <View style={styles.container}>
      <SideBar activeItem="EmployeePOS" />
      <View style={styles.content}>
        <EmployeeHeaderBar />
        <View style={styles.mainContent}>
          <View style={styles.leftPanel}>
            <View style={styles.paymentSummary}>
              <View style={styles.priceWrapper}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceValue}>₱{total.toFixed(2)}</Text>
                  <Text style={styles.priceLabel}>Total Paid</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceValue}>₱{parseFloat(cashAmount).toFixed(2)}</Text>
                  <Text style={styles.priceLabel}>Total Receive</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceValue}>₱{change.toFixed(2)}</Text>
                  <Text style={styles.priceLabel}>Change</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.continueButtonText}>PRINT RECEIPT</Text>
              </TouchableOpacity>
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
                  {paymentMethod === 'Cash' && (
                    <TouchableOpacity style={[styles.paymentButton]} disabled={true}>
                      <FontAwesomeIcon icon={faMoneyBillWave as IconProp} size={20} color="white" />
                      <Text style={[styles.paymentText]}>Cash</Text>
                    </TouchableOpacity>
                  )}
                  {paymentMethod === 'Card' && (
                    <TouchableOpacity style={[styles.paymentButton]} disabled={true}>
                      <FontAwesomeIcon icon={faCreditCard as IconProp} size={20} color="white" />
                      <Text style={[styles.paymentText]}>Card</Text>
                    </TouchableOpacity>
                  )}
                  {paymentMethod === 'E-wallet' && (
                    <TouchableOpacity style={[styles.paymentButton]} disabled={true}>
                      <FontAwesomeIcon icon={faQrcode as IconProp} size={20} color="white" />
                      <Text style={[styles.paymentText]}>E-Wallet</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.tableFoot}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₱{total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* ✅ Modal with ViewShot preview */}
          <Modal visible={modalVisible} animationType="slide">
            <ScrollView style={{ flex: 1, padding: 10 }}>
              {/* Just render HTML preview */}
              <RenderHTML contentWidth={150} source={{ html: generateHTML() }}/>
            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 20 }}>
              <TouchableOpacity
                style={[styles.continueButton, { flex: 1, marginRight: 10 }]}
                onPress={captureAndExportPDF}
              >
                <Text style={styles.continueButtonText}>Export as PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.continueButton, { flex: 1, backgroundColor: "gray" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.continueButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ⚡️ styles unchanged from your file
  container: { flex: 1, backgroundColor: '#f5f5f5', flexDirection: 'row' },
  content: { flex: 1, flexDirection: 'column' },
  mainContent: { flex: 1, flexDirection: 'row', padding: 30 },
  leftPanel: { flex: 2.2, marginRight: 10 },
  rightPanel: { flex: 1, justifyContent: 'space-between', overflow: 'hidden' },
  receipt: { flex: 1, backgroundColor: 'white', overflow: 'hidden', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.3)' },
  checkoutHeader: { backgroundColor: 'white', padding: 15, alignItems: 'center' },
  checkoutText: { fontWeight: 'bold', fontSize: 18 },
  tableHead: { flexDirection: 'row', backgroundColor: '#D9D9D9', padding: 10 },
  headText: { fontWeight: 'bold', textAlign: 'center' },
  tableBody: { flex: 1, maxHeight: 310 },
  tableRow: { flexDirection: 'row', padding: 10, alignItems: 'center', height: 20 },
  bodyText: { fontSize: 14 },
  emptyCart: { padding: 20, alignItems: 'center', justifyContent: 'center' },
  emptyCartText: { color: '#999', fontSize: 16 },
  tableLeg: { padding: 15, backgroundColor: 'rgba(217, 217, 217, 0.6)' },
  legRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  legLabel: { fontWeight: 'bold', fontSize: 14 },
  legValue: { fontSize: 14 },
  paymentMethods: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  paymentButton: { backgroundColor: '#744E31', paddingVertical: 10, paddingHorizontal: 75, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1, marginHorizontal: 5 },
  paymentText: { fontSize: 12, fontWeight: 'bold', color: 'white' },
  tableFoot: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#f9f9f9' },
  totalLabel: { fontWeight: 'bold', fontSize: 16 },
  totalValue: { fontWeight: 'bold', fontSize: 16 },
  paymentSummary: { backgroundColor: 'white', padding: 20, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.3)', height: '97.5%', width: '100%', justifyContent: 'center' },
  priceWrapper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  priceContainer: { alignItems: 'center', flex: 1 },
  priceValue: { fontSize: 24, fontWeight: 'bold' },
  priceLabel: { fontSize: 14, color: '#999' },
  continueButton: { backgroundColor: '#A67B5B', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  continueButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default PrintReceiptPOS;