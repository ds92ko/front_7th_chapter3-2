import { Coupon } from '../types/coupons';

const PERCENTAGE_COUPON_MIN_AMOUNT = 10000;

/**
 * 쿠폰 적용 가능 여부를 검증합니다.
 * @param coupon 적용하려는 쿠폰
 * @param totalAmount 현재 결제 예정 금액
 * @returns 검증 결과 { isValid: boolean, errorMessage?: string }
 */
export const validateCouponApplicability = (coupon: Coupon, totalAmount: number): { isValid: boolean; errorMessage?: string } => {
  if (totalAmount < PERCENTAGE_COUPON_MIN_AMOUNT && coupon.discountType === 'percentage') {
    return {
      isValid: false,
      errorMessage: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.'
    };
  }

  return { isValid: true };
};
