import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import FloatingParticles from './FloatingParticles';
import { products, categories } from '../data/products';
import './Store.css';

const Store = ({ user, onLogout }) => {
  const [allProducts, setAllProducts] = useState(products);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  
  // Referencias para navegación
  const inicioRef = useRef(null);
  const ofertasRef = useRef(null);
  const nuevosRef = useRef(null);
  const masCompradoRef = useRef(null);
  const categoriasRef = useRef(null);
  
  // Referencias para categorías específicas
  const electronicosRef = useRef(null);
  const ropaRef = useRef(null);
  const hogarRef = useRef(null);
  const deportesRef = useRef(null);
  const librosRef = useRef(null);
  const juguetesRef = useRef(null);
  const bellezaRef = useRef(null);
  const automotrizRef = useRef(null);

  // Filtrar productos por categoría
  useEffect(() => {
    let filtered = allProducts;
    
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, allProducts]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    
    // Navegar inmediatamente a la sección específica de la categoría
    handleNavigateToSection(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory('Todos');
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleNavigateToSection = (section) => {
    const refs = {
      inicio: inicioRef,
      ofertas: ofertasRef,
      nuevos: nuevosRef,
      'mas-comprado': masCompradoRef,
      categorias: categoriasRef,
      'Electrónicos': electronicosRef,
      'Ropa': ropaRef,
      'Hogar': hogarRef,
      'Deportes': deportesRef,
      'Libros': librosRef,
      'Juguetes': juguetesRef,
      'Belleza': bellezaRef,
      'Automotriz': automotrizRef
    };
    
    const targetRef = refs[section];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleToggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const featuredProducts = products.filter(product => product.isRecommended || product.isBestSeller);

  // Función para obtener iconos de categorías
  const getCategoryIcon = (category) => {
    const icons = {
      'Electrónicos': '📱',
      'Ropa': '👕',
      'Hogar': '🏠',
      'Deportes': '⚽',
      'Libros': '📚',
      'Juguetes': '🧸',
      'Belleza': '💄',
      'Automotriz': '🚗'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="store">
      <FloatingParticles />
      <Header 
        cartItems={cartItems.length}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        onOpenCart={handleOpenCart}
        onNavigateToSection={handleNavigateToSection}
      />
      
      <main className="store-main">
        {/* Hero Section */}
        <section ref={inicioRef} className="hero-section">
          <div className="hero-content">
            <h1>¡Bienvenido, {user.name}!</h1>
            <p>Descubre los mejores productos con ofertas increíbles</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">18+</span>
                <span className="stat-label">Productos</span>
              </div>
              <div className="stat">
                <span className="stat-number">8</span>
                <span className="stat-label">Categorías</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Soporte</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section ref={ofertasRef} className="featured-section">
          <div className="section-header">
            <h2>Productos Destacados</h2>
            <p>Los productos más recomendados y más comprados</p>
          </div>
          <ProductGrid 
            products={featuredProducts}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        {/* New Products */}
        <section ref={nuevosRef} className="new-products-section">
          <div className="section-header">
            <h2>Productos Nuevos</h2>
            <p>Descubre las últimas novedades</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.isNew)}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        {/* Most Bought Products */}
        <section ref={masCompradoRef} className="most-bought-section">
          <div className="section-header">
            <h2>Lo Más Comprado</h2>
            <p>Los productos favoritos de nuestros clientes</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.isBestSeller)}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        {/* Promotional Products */}
        <section className="promotional-section">
          <div className="section-header">
            <h2>Ofertas Especiales</h2>
            <p>Productos con descuentos increíbles</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.discount > 20)}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>


        {/* All Products */}
        <section ref={categoriasRef} className="products-section">
          <div className="section-header">
            <h2>Todos los Productos</h2>
            <p>Explora nuestra amplia selección de productos</p>
          </div>
          
          <div className="filter-info">
            <p>
              Mostrando {filteredProducts.length} productos
              {selectedCategory !== 'Todos' && ` en ${selectedCategory}`}
              {searchQuery && ` para "${searchQuery}"`}
            </p>
          </div>
          
          <ProductGrid 
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        {/* Categorías Específicas */}
        <section ref={electronicosRef} className="category-section">
          <div className="section-header">
            <h2>📱 Electrónicos</h2>
            <p>Los mejores dispositivos electrónicos y tecnología</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.category === 'Electrónicos')}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        <section ref={ropaRef} className="category-section">
          <div className="section-header">
            <h2>👕 Ropa</h2>
            <p>Moda y ropa para todas las ocasiones</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.category === 'Ropa')}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        <section ref={hogarRef} className="category-section">
          <div className="section-header">
            <h2>🏠 Hogar</h2>
            <p>Todo para decorar y equipar tu hogar</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.category === 'Hogar')}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        <section ref={deportesRef} className="category-section">
          <div className="section-header">
            <h2>⚽ Deportes</h2>
            <p>Equipamiento deportivo y fitness</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.category === 'Deportes')}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        <section ref={librosRef} className="category-section">
          <div className="section-header">
            <h2>📚 Libros</h2>
            <p>Libros y literatura para todos los gustos</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.category === 'Libros')}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        <section ref={juguetesRef} className="category-section">
          <div className="section-header">
            <h2>🧸 Juguetes</h2>
            <p>Juguetes y entretenimiento para niños</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.category === 'Juguetes')}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        <section ref={bellezaRef} className="category-section">
          <div className="section-header">
            <h2>💄 Belleza</h2>
            <p>Productos de belleza y cuidado personal</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.category === 'Belleza')}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>

        <section ref={automotrizRef} className="category-section">
          <div className="section-header">
            <h2>🚗 Automotriz</h2>
            <p>Accesorios y repuestos para vehículos</p>
          </div>
          <ProductGrid 
            products={products.filter(product => product.category === 'Automotriz')}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            loading={loading}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="store-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Mi Tienda</h3>
            <p>Tu tienda online de confianza con los mejores productos y precios.</p>
          </div>
          <div className="footer-section">
            <h4>Categorías</h4>
            <ul>
              <li>Electrónicos</li>
              <li>Ropa</li>
              <li>Hogar</li>
              <li>Deportes</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Soporte</h4>
            <ul>
              <li>Centro de Ayuda</li>
              <li>Contacto</li>
              <li>Envíos</li>
              <li>Devoluciones</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Mi Cuenta</h4>
            <ul>
              <li>Mi Perfil</li>
              <li>Mis Pedidos</li>
              <li>Favoritos</li>
              <li><button onClick={onLogout} className="logout-button">Cerrar Sesión</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Mi Tienda Online. Todos los derechos reservados.</p>
        </div>
      </footer>


      {/* Cart Modal */}
      <Cart
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
};

export default Store;
