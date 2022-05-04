import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Product from './Product';
import { getAllProducts } from '../../../actions/menu';
import { connect } from 'react-redux';

const Menu = ({ getAllProducts, menu: { products } }) => {
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div className="menu">
      {products ? (
        products.products.map((product) => <Product product={product} />)
      ) : (
        <p>No Products</p>
      )}
    </div>
  );
};

Menu.propTypes = {
  getAllProducts: PropTypes.func.isRequired,
  menu: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  menu: state.menu,
});

export default connect(mapStateToProps, { getAllProducts })(Menu);
