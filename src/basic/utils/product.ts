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

