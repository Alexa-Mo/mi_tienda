import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import './Header.css';

const Header = ({ cartItems, onSearch, onCategorySelect, onOpenCart, onNavigateToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Electrónicos',
    'Ropa',
    'Hogar',
    'Deportes',
    'Libros',
    'Juguetes',
    'Belleza',
    'Automotriz'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (section) => {
    onNavigateToSection(section);
    setIsMenuOpen(false);
  };

  const handleCategoryHover = () => {
    setIsCategoriesOpen(true);
  };

  const handleCategoryLeave = () => {
    setIsCategoriesOpen(false);
  };

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    setIsCategoriesOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <h1>Mi Tienda</h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-container">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            <li><button onClick={() => handleNavigation('inicio')}>Inicio</button></li>
            <li><button onClick={() => handleNavigation('ofertas')}>Ofertas</button></li>
            <li><button onClick={() => handleNavigation('nuevos')}>Nuevos</button></li>
            <li><button onClick={() => handleNavigation('mas-comprado')}>Lo Más Comprado</button></li>
            <li className="categories-dropdown">
              <button 
                onMouseEnter={handleCategoryHover}
                onMouseLeave={handleCategoryLeave}
                className="categories-button"
              >
                Categorías
                <ChevronDown size={16} />
              </button>
              {isCategoriesOpen && (
                <div 
                  className="categories-dropdown-menu"
                  onMouseEnter={handleCategoryHover}
                  onMouseLeave={handleCategoryLeave}
                >
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="category-dropdown-item"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Right Side Icons */}
        <div className="header-actions">
          <button className="action-button">
            <User size={24} />
          </button>
          <button className="action-button cart-button" onClick={onOpenCart}>
            <ShoppingCart size={24} />
            {cartItems > 0 && <span className="cart-badge">{cartItems}</span>}
          </button>
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <nav className="mobile-nav">
            <ul>
              <li><button onClick={() => handleNavigation('inicio')}>Inicio</button></li>
              <li><button onClick={() => handleNavigation('ofertas')}>Ofertas</button></li>
              <li><button onClick={() => handleNavigation('nuevos')}>Nuevos</button></li>
              <li><button onClick={() => handleNavigation('mas-comprado')}>Lo Más Comprado</button></li>
              <li><button onClick={() => handleNavigation('categorias')}>Categorías</button></li>
            </ul>
          </nav>

          <div className="categories-section">
            <h3>Categorías</h3>
            <div className="categories-grid">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="category-button"
                  onClick={() => {
                    onCategorySelect(category);
                    toggleMenu();
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Categories Bar */}
      <div className="categories-bar">
        <div className="categories-container">
          {categories.map((category, index) => (
            <button
              key={index}
              className="category-item"
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
