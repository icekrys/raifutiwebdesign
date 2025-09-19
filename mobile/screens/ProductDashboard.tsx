import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, FlatList, Image } from "react-native";
import SideBar from "../components/SideBar";
import AdminHeaderBar from "../components/AdminHeaderBar";
import { supabase } from "../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import CategoriesOptionsMenu from "../components/CategoriesOptionsMenu"; // Import the component

type Product = {
  product_id: number; 
  name: string;
  category: string;
  price: number;
  status: string;
  description?: string;
  image?: string;
};

// Status mapping constants
const STATUS_MAPPING = {
  'Available': 'Active',
  'Unavailable': 'Inactive'
} as const;

const REVERSE_STATUS_MAPPING = {
  'Active': 'Available',
  'Inactive': 'Unavailable'
} as const;

type DisplayStatus = keyof typeof STATUS_MAPPING;
type DatabaseStatus = keyof typeof REVERSE_STATUS_MAPPING;

const ProductDashboard = () => {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    status: "" as DisplayStatus,
    description: "",
    image: null as string | null,
  });
  const [errors, setErrors] = useState({
    name: "",
    category: "",
    price: "",
    status: "",
  });
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const allCategories = ["All Categories", "Milk Tea", "Coffee", "Cake"];
  
  const allowedCategories = ["Coffee", "Desserts", "Milktea"];
  const allowedStatuses = ["Available", "Unavailable"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCounts();
      await fetchProducts();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editingProduct && editingProduct.image) {
      setSelectedImage(editingProduct.image);
    }
  }, [editingProduct]);

  useEffect(() => {
    // Filter products based on selected category
    if (selectedCategory === "All Categories") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchCounts = async () => {
    try {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      setProductCount(count);
    } catch (error) {
      console.error("Error fetching product count:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("product_id, name, category, price, status, description, image");

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const validateInput = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Product name is required";
        if (/\d/.test(value)) return "Product name should not contain numbers";
        return "";
      case "category":
        if (!value.trim()) return "Category is required";
        if (!allowedCategories.includes(value)) return `Category must be one of: ${allowedCategories.join(", ")}`;
        return "";
      case "price":
        if (!value.trim()) return "Price is required";
        if (!/^\d+$/.test(value)) return "Price must contain only numbers";
        if (parseFloat(value) <= 0) return "Price must be greater than 0";
        return "";
      case "status":
        if (!value.trim()) return "Status is required";
        if (!allowedStatuses.includes(value)) return `Status must be one of: ${allowedStatuses.join(", ")}`;
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // Validate input on change
    const error = validateInput(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const pickImage = async () => {
    setUploading(true);
    
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Sorry, we need camera roll permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const img = result.assets[0];
        setSelectedImage(img.uri);
        
        // Convert image to blob for upload
        const response = await fetch(img.uri);
        const blob = await response.blob();
        
        // Create unique file path
        const fileName = `${Math.random()}.jpg`;
        const filePath = `product-images/${fileName}`;

        // Upload to Supabase Storage (using 'items' bucket)
        const { error } = await supabase.storage
          .from('items')
          .upload(filePath, blob, { 
            contentType: 'image/jpeg',
            upsert: true
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('items')
          .getPublicUrl(filePath);

        // Update form data with image URL
        setFormData({
          ...formData,
          image: publicUrl
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setFormData({
      ...formData,
      image: null
    });
  };

  const handleSave = async () => {
    // Validate all fields
    const newErrors = {
      name: validateInput("name", formData.name),
      category: validateInput("category", formData.category),
      price: validateInput("price", formData.price),
      status: validateInput("status", formData.status),
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== "")) {
      console.log("Validation errors:", newErrors);
      return;
    }
  
    setLoading(true);
    try {
      // Convert display status to database status
      const databaseStatus = STATUS_MAPPING[formData.status as DisplayStatus] as DatabaseStatus;
      
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        status: databaseStatus,
        description: formData.description || null,
        image: formData.image,
      };
  
      console.log("Attempting to save product data:", productData);
  
      let { data, error } = editingProduct 
      ? await supabase
          .from("products")
          .update(productData)
          .eq("product_id", editingProduct.product_id)
          .select()
      : await supabase
          .from("products")
          .insert(productData) 
          .select();
  
      if (error) {
        console.error("❌ SUPABASE ERROR DETAILS:");
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error details:", error.details);
        console.error("Error hint:", error.hint);
        
        throw new Error(error.message || `Database operation failed: ${error.code}`);
      }
  
      if (!data) {
        console.error("❌ NO DATA RETURNED - Operation might have succeeded but no data returned");
        throw new Error("No data returned from operation");
      }
  
      console.log("✅ SUCCESS! Saved data:", data);
  
      // Reset form
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        status: "" as DisplayStatus,
        description: "",
        image: null,
      });
      setSelectedImage(null);
      
      // Refresh data
      await fetchProducts();
      await fetchCounts();
      
      Alert.alert("Success", editingProduct ? "Product updated successfully!" : "Product added successfully!");
      
    } catch (error: any) {
      console.error("❌ CATCH BLOCK ERROR:", error);
      Alert.alert(
        "Error", 
        error.message || "Failed to save product. Please check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    
    // Convert database status back to display status
    const displayStatus = REVERSE_STATUS_MAPPING[product.status as DatabaseStatus] as DisplayStatus;
    
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      status: displayStatus,
      description: product.description || "",
      image: product.image || null,
    });
    setSelectedImage(product.image || null);
  };
  
  const handleDelete = async (product_id: number) => { // Changed id to product_id
    try {
      setLoading(true); // Start loading
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("product_id", product_id); // Changed id to product_id
  
      if (error) {
        console.error("Error deleting product:", error);
        Alert.alert("Error", "Failed to delete product. Please try again.");
        return;
      }
  
      Alert.alert("Success", "Product deleted successfully!");
      await fetchProducts(); // Refresh the product list
      await fetchCounts(); // Refresh the product count
    } catch (error) {
      console.error("Unexpected error deleting product:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleToggleArchive = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Inactive" ? "Active" : "Inactive";
      const { error } = await supabase
        .from("products")
        .update({ status: newStatus })
        .eq("product_id", id);
      if (error) throw error;
      await fetchProducts();
      Alert.alert("Success", `Product status updated to ${newStatus === "Active" ? "Available" : "Unavailable"} successfully!`);
    } catch (error) {
      console.error("Error toggling product status:", error);
      Alert.alert("Error", "Failed to update product status");
    }
  };

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, category });
    setCategoryDropdownVisible(false);
  };

  const handleStatusSelect = (status: string) => {
    if (status === "Available" || status === "Unavailable") {
      setFormData({ ...formData, status });
    }
    setStatusDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <SideBar activeItem="ProductDashboard" />
      <View style={styles.content}>
        <AdminHeaderBar />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Add / Edit Product Form */}
          <View style={styles.cardProduct}>
            <View style={styles.formContainer}>
              {/* Left Side - Form Fields */}
              <View style={[styles.formFields, { flex: 2 }]}>
                {/* Title above the two columns */}
                <View>
                  <Text style={styles.sectionTitle}>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </Text>
                </View>
                
                {/* Form Fields - Two Columns */}
                <View style={styles.inputGroupRow}>
                  {/* First Column - Product Name and Price */}
                  <View style={[styles.inputGroupColumn, { marginRight: 15 }]}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Product Name</Text>
                      <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        placeholder="e.g., Americano"
                        value={formData.name}
                        onChangeText={(text) => handleInputChange("name", text)}
                      />
                      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Price</Text>
                      <TextInput
                        style={[styles.input, errors.price && styles.inputError]}
                        placeholder="e.g., ₱120"
                        value={formData.price}
                        onChangeText={(text) => handleInputChange("price", text)}
                        keyboardType="numeric"
                      />
                      {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
                    </View>
                  </View>

                  {/* Second Column - Category and Status */}
                  <View style={styles.inputGroupColumn}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Category</Text>
                      <TouchableOpacity
                        style={[styles.input, styles.touchableInput, errors.category && styles.inputError]}
                        onPress={() => setCategoryDropdownVisible(!categoryDropdownVisible)}
                      >
                        <Text>{formData.category || "e.g., Coffee"}</Text>
                      </TouchableOpacity>
                      {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
                      
                      {/* Categories Dropdown Menu */}
                      {categoryDropdownVisible && (
                        <View style={styles.CoptionsMenu}>
                          <CategoriesOptionsMenu
                            onMilkteaPress={() => handleCategorySelect("Milktea")}
                            onCoffeePress={() => handleCategorySelect("Coffee")}
                            onDessertsPress={() => handleCategorySelect("Desserts")}
                          />
                        </View>
                      )}
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Status</Text>
                      <TextInput
                        style={[styles.input, errors.status && styles.inputError]}
                        placeholder="e.g., Available"
                        value={formData.status}
                        onChangeText={(text) => handleInputChange("status", text)}
                      />
                      {errors.status ? <Text style={styles.errorText}>{errors.status}</Text> : null}
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Right Side - Image Box */}
              <View style={[styles.imageSection, { flex: 1 }]}>
                <View style={styles.imagePlaceholder}>
                  {selectedImage ? (
                    <Image 
                      source={{ uri: selectedImage }} 
                      style={styles.selectedImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.placeholderText}>+</Text>
                  )}
                </View>

                {/* Image Picker Button */}
                <TouchableOpacity 
                  style={styles.addImageButton} 
                  onPress={pickImage} 
                  disabled={uploading}
                >
                  <Text style={styles.addImageButtonText}>
                    {uploading ? 'Uploading...' : '+ Add Image'}
                  </Text>
                </TouchableOpacity>
                
                {selectedImage && (
                  <TouchableOpacity 
                    style={styles.removeImageButton} 
                    onPress={removeImage} 
                    disabled={uploading}
                  >
                    <Text style={styles.removeImageButtonText}>- Remove Image</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {/* Description - Outside the form container */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Brief description of the product"
                value={formData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                multiline
                numberOfLines={4}
              />
            </View>
            
            <TouchableOpacity style={styles.addBtn} onPress={handleSave} disabled={uploading}>
              <Text style={styles.addBtnText}>
                {uploading ? 'Uploading...' : (editingProduct ? "Update Product" : "Add Product")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Categories Selection */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.label}>Categories</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              {["All Categories", "Milktea", "Coffee", "Desserts"].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Product Table */}
          <View style={styles.cardTable}>
            <Text style={styles.sectionTitle}>Existing Products ({filteredProducts.length})</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderCell, {flex: 1.5}]}>Product Name</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Category</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Price</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Status</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, {flex: 1.2}]}>Actions</Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#A67B5B" style={styles.loader} />
            ) : (
              <FlatList
                data={filteredProducts}
                scrollEnabled={false}
                keyExtractor={(item) => item.product_id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, {flex: 1.5}]}>{item.name}</Text>
                    <Text style={styles.tableCell}>{item.category}</Text>
                    <Text style={styles.tableCell}>₱{item.price}</Text>
                    <Text style={styles.tableCell}>
                      {REVERSE_STATUS_MAPPING[item.status as DatabaseStatus]}
                    </Text>
                    <View style={[styles.actionRow, {flex: 1.2}]}>
                      <TouchableOpacity onPress={() => handleEdit(item)}>
                        <Text style={styles.actionText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleToggleArchive(item.product_id, item.status)}>
                        <Text style={[styles.actionText, styles.archiveText]}>
                          {item.status === "Inactive" ? "Unarchive" : "Archive"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.product_id)}>
                        <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    flexDirection: "row", 
    backgroundColor: "#f5f5f5" 
  },
  content: { 
    flex: 1 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  cardProduct: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 25,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  cardTable: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    color: "#333",
  },
  formContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  formFields: {
    flex: 2,
    marginRight: 20,
  },
  imageSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputGroupRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  inputGroupColumn: {
    flex: 1,
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative', // Added for positioning the dropdown
  },
  label: { 
    fontWeight: "bold", 
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    height: 50,
    backgroundColor: "#fff",
  },
  touchableInput: {
    justifyContent: "center",
    height: 50,
  },
  inputError: { 
    borderColor: "red" 
  },
  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: 4,
    marginBottom: -17,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: "#fff",
  },
  imagePlaceholder: {
    width: 350,
    height: 250,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  addImageButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
  },
  addImageButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  removeImageButton: {
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  removeImageButtonText: {
    fontSize: 14,
    color: '#ff4444',
  },
  addBtn: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 4,
    alignSelf: "flex-end",
    minWidth: 150,
    alignItems: 'center',
  },
  addBtnText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  dropdownMenu: {
    position: 'absolute',
    top: 100,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    minWidth: 150,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemActive: {
    backgroundColor: '#f0f0f0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "rgba(166, 123, 91, 0.2)",
    padding: 15,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ddd",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    flex: 1,
    color: "#333",
    fontSize: 16,
  },
  tableRow: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "rgba(166, 123, 91, 0.1)",
  },
  tableCell: { 
    flex: 1, 
    fontSize: 16,
    color: "#333",
  },
  actionRow: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    flex: 1,
  },
  actionText: {
    color: "#A67B5B",
    fontWeight: "500",
    fontSize: 16,
  },
  deleteText: {
    color: "#ff4444",
  },
  archiveText: {
    color: "#FFA500", // Orange color for archive button
  },
  loader: {
    marginVertical: 16,
  },
  CoptionsMenu: {
    position: 'absolute',
    top: 32,
    right: 13,
    zIndex: 1000,
  },
  categoryButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  categoryButtonActive: {
    backgroundColor: "#A67B5B",
    borderColor: "#A67B5B",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#333",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },
});

export default ProductDashboard;