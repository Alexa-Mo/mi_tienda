import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    setIsOpen(false);
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="category-filter">
      <div className="filter-header">
        <h3>Categorías Disponibles</h3>
        <button className="filter-toggle" onClick={toggleFilter}>
          <Filter size={20} />
          Filtrar por Categoría
        </button>
      </div>

      {isOpen && (
        <div className="filter-overlay" onClick={() => setIsOpen(false)}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h3>Selecciona una Categoría</h3>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="categories-grid">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-option ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="selected-category">
        {selectedCategory && selectedCategory !== 'Todos' && (
          <div className="current-filter">
            <span>Categoría seleccionada: <strong>{selectedCategory}</strong></span>
            <button 
              className="clear-filter"
              onClick={() => onCategorySelect('Todos')}
            >
              Ver todas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
