import { Discount } from '../types/products';

/**
 * 할인 정책 목록에서 특정 인덱스의 할인을 제거합니다.
 */
export const removeDiscount = (discounts: Discount[], index: number): Discount[] => {
  return discounts.filter((_, i) => i !== index);
};

/**
 * 할인 정책 목록에 기본 할인을 추가합니다.
 */
export const addDefaultDiscount = (discounts: Discount[]): Discount[] => {
  return [...discounts, { quantity: 10, rate: 0.1 }];
};

