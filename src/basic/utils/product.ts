import { ProductWithUI } from '../types/products';

/**
 * 상품 목록을 검색어로 필터링합니다.
 */
export const filterProductsBySearchTerm = (products: ProductWithUI[], searchTerm: string): ProductWithUI[] => {
  if (!searchTerm) return products;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerSearchTerm))
  );
};

/**
 * 재고 상태에 따른 스타일 클래스를 반환합니다.
 */
export const getStockStatusStyle = (stock: number): string => {
  if (stock > 10) return 'bg-green-100 text-green-800';
  if (stock > 0) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

/**
 * 재고 상태에 따른 표시 텍스트를 반환합니다.
 */
export const getStockStatusText = (remainingStock: number): { text: string; className: string } | null => {
  if (remainingStock <= 5 && remainingStock > 0) {
    return { text: `품절임박! ${remainingStock}개 남음`, className: 'text-xs text-red-600 font-medium' };
  }
  if (remainingStock > 5) {
    return { text: `재고 ${remainingStock}개`, className: 'text-xs text-gray-500' };
  }
  return null;
};

/**
 * 장바구니 버튼 텍스트를 반환합니다.
 */
export const getCartButtonText = (remainingStock: number): string => {
  return remainingStock <= 0 ? '품절' : '장바구니 담기';
};

