import { Coupon } from '../types/coupons';
import { formatCurrency } from './format';

/**
 * 쿠폰 할인 정보를 표시용 문자열로 포맷팅합니다.
 */
export const formatCouponDiscount = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return `${formatCurrency(coupon.discountValue, { suffix: '원' })} 할인`;
  }
  return `${coupon.discountValue}% 할인`;
};

/**
 * 쿠폰 목록에서 코드로 쿠폰을 찾습니다.
 */
export const findCouponByCode = (coupons: Coupon[], code: string): Coupon | undefined => {
  return coupons.find(c => c.code === code);
};

/**
 * 쿠폰 목록을 Select 옵션으로 변환합니다.
 */
export const convertCouponsToOptions = (coupons: Coupon[]): Array<{ label: string; value: string }> => {
  return coupons.map(coupon => ({
    label: `${coupon.name} (${formatCouponDiscount(coupon)})`,
    value: coupon.code
  }));
};

