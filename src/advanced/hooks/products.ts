import { useCallback } from 'react';
import { initialProducts } from '../constants/products';
import { notificationsActions } from '../stores/notifications';
import { ProductWithUI } from '../types/products';
import useLocalStorage from './local-storage';

interface UseProductsReturn {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
}

const useProducts = (): UseProductsReturn => {
  const { addNotification } = notificationsActions();
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`
      };
      setProducts(prev => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts(prev => prev.map(product => (product.id === productId ? { ...product, ...updates } : product)));
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

export default useProducts;
