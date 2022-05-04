import React from 'react';
import veg from '../../../img/veg.png';

const Product = ({ product }) => {
  console.log(product);

  return (
    <div className="product">
      <div className="product_img">
        <img src={product.url} alt="Product" />
      </div>
      <p className="lead">{product.name}</p>
      <div className="product_pricing">
        <img src={veg} alt="veg" className="product_veg" />
        <p>₹{product.price}</p>
      </div>

      <div className="product_button">
        <button>Add To Cart</button>
      </div>
    </div>
  );
};

export default Product;
