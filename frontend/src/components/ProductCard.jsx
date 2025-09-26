import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite(product.id);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
        <div className="product-badges">
          {(() => {
            // Prioridad de badges: Nuevo > Promoción > Más Comprado > Más Recomendado
            if (product.isNew) {
              return <span className="new-badge">Nuevo</span>;
            }
            if (product.discount && product.discount > 15) {
              return <span className="discount-badge">Promoción</span>;
            }
            if (product.isBestSeller) {
              return <span className="bestseller-badge">Más Comprado</span>;
            }
            if (product.isRecommended) {
              return <span className="recommended-badge">Más Recomendado</span>;
            }
            return null;
          })()}
        </div>
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={handleFavorite}
        >
          <Heart size={20} />
        </button>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < product.rating ? 'filled' : 'empty'} 
              />
            ))}
          </div>
          <span className="rating-text">({product.reviews})</span>
        </div>
        
        <div className="product-price">
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice}</span>
          )}
          <span className="current-price">${product.price}</span>
        </div>
        
        <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
