import axios from 'axios';
import { PRODUCTS_SUCCESS, PRODUCTS_FAILED } from './types';

export const getAllProducts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/admin/items');
    dispatch({ type: PRODUCTS_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({
      type: PRODUCTS_FAILED,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
