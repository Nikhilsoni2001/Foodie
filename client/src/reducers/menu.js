import { PRODUCTS_SUCCESS, PRODUCTS_FAILED } from '../actions/types';
const initialState = {
  products: null,
  error: null,
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: payload,
      };
    case PRODUCTS_FAILED:
      return {
        ...state,
        loading: false,
        error: payload,
        products: null,
      };
    default:
      return state;
  }
}
