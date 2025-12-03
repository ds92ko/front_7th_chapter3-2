import { Coupon } from '../../../types/coupons';

export const DISCOUNT_TYPES = {
  amount: 'amount',
  percentage: 'percentage'
} as const;

export const DISCOUNT_TYPE_LABELS = {
  [DISCOUNT_TYPES.amount]: '정액 할인',
  [DISCOUNT_TYPES.percentage]: '정률 할인'
} as const;

export const DISCOUNT_TYPE_PLACEHOLDERS = {
  [DISCOUNT_TYPES.amount]: '5000',
  [DISCOUNT_TYPES.percentage]: '10'
} as const;

export const DISCOUNT_VALUE_CONSTRAINTS = {
  [DISCOUNT_TYPES.amount]: {
    max: 100000,
    errorMessage: '할인 금액은 100,000원을 초과할 수 없습니다'
  },
  [DISCOUNT_TYPES.percentage]: {
    max: 100,
    errorMessage: '할인율은 100%를 초과할 수 없습니다'
  }
} as const;

export const initialForm: Coupon = {
  name: '',
  code: '',
  discountType: DISCOUNT_TYPES.amount,
  discountValue: 0
};
