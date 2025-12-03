import { Dispatch, SetStateAction } from 'react';
import { AddNotification } from '../../../hooks/notifications';
import { CartItem } from '../../../types/carts';
import { ProductWithUI } from '../../../types/products';
import ProductList from './product-list';

interface ProductSectionProps {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  addNotification: AddNotification;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}

const ProductSection = ({ products, debouncedSearchTerm, addNotification, cart, setCart }: ProductSectionProps) => {
  return (
    <section>
      <div className='mb-6 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
        <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
      </div>
      <ProductList products={products} debouncedSearchTerm={debouncedSearchTerm} addNotification={addNotification} cart={cart} setCart={setCart} />
    </section>
  );
};

export default ProductSection;
