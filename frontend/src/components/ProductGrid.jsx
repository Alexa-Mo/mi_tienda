import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, onAddToCart, onToggleFavorite, onOpenDetail, loading }) => {
  if (loading) {
    return (
      <div className="product-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="product-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <h3>No se encontraron productos</h3>
        <p>Intenta con otros términos de búsqueda o categorías</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          onOpenDetail={onOpenDetail} // <-- PASAMOS LA FUNCIÓN
        />
      ))}
    </div>
  );
};

export default ProductGrid;
