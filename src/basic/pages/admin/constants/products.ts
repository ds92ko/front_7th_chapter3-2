import { ProductForm } from '../../../types/products';

export const initialForm: ProductForm = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: []
} as const;
