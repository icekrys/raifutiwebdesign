import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type Product = {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  status: string;
};

interface ItemCardProps {
  product: Product;
  includeSizeSelector: boolean;
  onAddToCart?: (product: Product, size: string, quantity: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ product, includeSizeSelector, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadImageUrl = async () => {
      if (product.image) {
        try {
          // Extract the file path from the URL if it's a full URL
          let filePath = product.image;
          
          // If it's a full URL from Supabase Storage, extract the path
          if (product.image.includes('/product-images/')) {
            const urlParts = product.image.split('/product-images/');
            if (urlParts.length > 1) {
              filePath = `product-images/${urlParts[1]}`;
            }
          }
          
          // Get public URL from Supabase Storage
          const { data } = supabase.storage
            .from('items')
            .getPublicUrl(filePath);

          if (data?.publicUrl) {
            setImageUrl(data.publicUrl);
          } else {
            throw new Error('Failed to get public URL');
          }
        } catch (error) {
          console.error('Error loading image URL:', error);
          setImageError(true);
        } finally {
          setImageLoading(false);
        }
      } else {
        setImageLoading(false);
      }
    };

    loadImageUrl();
  }, [product.image]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedSize, quantity);
    }
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  return (
    <View style={styles.card}>
      {/* Upper Part */}
      <View style={styles.upperPart}>
        {/* Left side - Image */}
        <View style={styles.imageContainer}>
          {imageLoading ? (
            <View style={styles.placeholder}>
              <ActivityIndicator size="small" color="#A67B5B" />
            </View>
          ) : imageUrl && !imageError ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              onError={() => setImageError(true)}
              onLoad={() => setImageLoading(false)}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>
        
        {/* Right side - Product info */}
        <View style={styles.productInfo}>
          <View style={styles.detailsWrapper}>
            <View style={styles.details}>
              <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
              <Text style={styles.description} numberOfLines={4}>
                {product.description}
              </Text>
            </View>
            <View style={[styles.sizeWrapper, { outlineWidth: 0 }]}>
              {['S', 'M', 'L'].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonSelected
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextSelected
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
      
      {/* Lower Part */}
      <View style={styles.lowerPart}>
        {/* Left side - Quantity selector */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.squareButton, { outlineWidth: 0 }]} 
            onPress={() => handleQuantityChange(-1)}
          >
            <FontAwesomeIcon style={{ outlineWidth: 0}} icon={faMinus as IconProp} size={10} />
          </TouchableOpacity>
          <Text style={styles.quantityNumber}>{quantity}</Text>
          <TouchableOpacity 
            style={[styles.squareButton, { outlineWidth: 0 }]} 
            onPress={() => handleQuantityChange(1)}
          >
            <FontAwesomeIcon style={{ outlineWidth: 0}} icon={faPlus as IconProp} size={10} />
          </TouchableOpacity>
        </View>
        
        {/* Right side - Price and Add to Cart */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₱{product.price.toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Set a fixed width for the card
const CARD_WIDTH = 230;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    margin: 5,
    width: CARD_WIDTH,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  upperPart: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageContainer: {
    width: 75,
    height: 75,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#999',
    fontSize: 10,
  },
  productInfo: {
    flex: 1,
  },
  detailsWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  details: {
    marginBottom: 1,
  },
  sizeWrapper: {
    gap: 2,
    flexDirection: 'row',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
    color: '#333',
    lineHeight: 12,
  },
  description: {
    color: '#666',
    fontSize: 6,
    lineHeight: 6,
  },
  sizeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12.5,
    width: 30,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginRight: 5,
  },
  sizeButtonSelected: {
    backgroundColor: '#A67B5B',
    borderColor: '#A67B5B',
  },
  sizeText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sizeTextSelected: {
    color: 'white',
  },
  lowerPart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  quantityContainer: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  priceContainer: {
    flex: 1.2,
    alignItems: 'flex-start',
  },
  squareButton: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
  quantityNumber: {
    fontSize: 25,
    marginTop: -4,
  },
  price: {
    fontSize: 14,
    marginBottom: 4,
  },
  addToCartButton: {
    backgroundColor: '#A67B5B',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  addToCartText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default ItemCard;