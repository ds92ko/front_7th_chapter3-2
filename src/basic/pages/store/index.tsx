import { useCallback } from 'react';
import Button from '../../components/button';
import { ShoppingBagIcon, XIcon } from '../../components/icons';
import Select from '../../components/select';
import { AddNotification } from '../../hooks/notifications';
import { CartItem } from '../../types/carts';
import { Coupon } from '../../types/coupons';
import { ProductWithUI } from '../../types/products';
import ProductSection from './components/product-section';

interface StorePageProps {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  addNotification: AddNotification;
}

const StorePage = ({ products, debouncedSearchTerm, cart, setCart, coupons, selectedCoupon, setSelectedCoupon, addNotification }: StorePageProps) => {
  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  };
  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };
  const calculateCartTotal = (): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach(item => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
    });

    if (selectedCoupon) {
      if (selectedCoupon.discountType === 'amount') {
        totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
      } else {
        totalAfterDiscount = Math.round(totalAfterDiscount * (1 - selectedCoupon.discountValue / 100));
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount)
    };
  };

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find(p => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart(prevCart => prevCart.map(item => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)));
    },
    [products, removeFromCart, addNotification]
  );
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal().totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, calculateCartTotal]
  );
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const totals = calculateCartTotal();

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductSection
          products={products}
          debouncedSearchTerm={debouncedSearchTerm}
          addNotification={addNotification}
          cart={cart}
          setCart={setCart}
        />
      </div>

      <div className='lg:col-span-1'>
        <div className='sticky top-24 space-y-4'>
          <section className='bg-white rounded-lg border border-gray-200 p-4'>
            <h2 className='text-lg font-semibold mb-4 flex items-center'>
              <ShoppingBagIcon className='mr-2' />
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className='text-center py-8'>
                <ShoppingBagIcon size={64} strokeWidth={1} className='text-gray-300 mx-auto mb-4' />
                <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {cart.map(item => {
                  const itemTotal = calculateItemTotal(item);
                  const originalPrice = item.product.price * item.quantity;
                  const hasDiscount = itemTotal < originalPrice;
                  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

                  return (
                    <div key={item.product.id} className='border-b pb-3 last:border-b-0'>
                      <div className='flex justify-between items-start mb-2'>
                        <h4 className='text-sm font-medium text-gray-900 flex-1'>{item.product.name}</h4>
                        <Button variant='delete' onClick={() => removeFromCart(item.product.id)} className='ml-2'>
                          <XIcon />
                        </Button>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                          >
                            <span className='text-xs'>−</span>
                          </button>
                          <span className='mx-3 text-sm font-medium w-8 text-center'>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                          >
                            <span className='text-xs'>+</span>
                          </button>
                        </div>
                        <div className='text-right'>
                          {hasDiscount && <span className='text-xs text-red-500 font-medium block'>-{discountRate}%</span>}
                          <p className='text-sm font-medium text-gray-900'>{Math.round(itemTotal).toLocaleString()}원</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              <section className='bg-white rounded-lg border border-gray-200 p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
                </div>
                {coupons.length > 0 && (
                  <Select
                    value={selectedCoupon?.code || ''}
                    onChange={e => {
                      const coupon = coupons.find(c => c.code === e.target.value);
                      if (coupon) applyCoupon(coupon);
                      else setSelectedCoupon(null);
                    }}
                    options={[
                      { label: '쿠폰 선택', value: '' },
                      ...coupons.map(coupon => ({
                        label: `${coupon.name} (${
                          coupon.discountType === 'amount' ? `${coupon.discountValue.toLocaleString()}원` : `${coupon.discountValue}%`
                        })`,
                        value: coupon.code
                      }))
                    ]}
                  />
                )}
              </section>

              <section className='bg-white rounded-lg border border-gray-200 p-4'>
                <h3 className='text-lg font-semibold mb-4'>결제 정보</h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>상품 금액</span>
                    <span className='font-medium'>{totals.totalBeforeDiscount.toLocaleString()}원</span>
                  </div>
                  {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                    <div className='flex justify-between text-red-500'>
                      <span>할인 금액</span>
                      <span>-{(totals.totalBeforeDiscount - totals.totalAfterDiscount).toLocaleString()}원</span>
                    </div>
                  )}
                  <div className='flex justify-between py-2 border-t border-gray-200'>
                    <span className='font-semibold'>결제 예정 금액</span>
                    <span className='font-bold text-lg text-gray-900'>{totals.totalAfterDiscount.toLocaleString()}원</span>
                  </div>
                </div>

                <Button size='xl' variant='accent' onClick={completeOrder} className='w-full mt-4'>
                  {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                </Button>

                <div className='mt-3 text-xs text-gray-500 text-center'>
                  <p>* 실제 결제는 이루어지지 않습니다</p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
