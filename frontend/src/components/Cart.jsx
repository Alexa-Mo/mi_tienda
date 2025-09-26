import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    deliveryType: 'pickup',
    address: '',
    comments: '',
  });
  const [formError, setFormError] = useState('');

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validar datos
    if (!formData.name || !formData.email || !formData.phone || !formData.city || (formData.deliveryType === 'delivery' && !formData.address)) {
      setFormError('Por favor, completa todos los campos requeridos.');
      return;
    }
    setFormError('');
    setIsCheckingOut(true);
    setTimeout(() => {
      alert(`¡Compra realizada con éxito!\n\nNombre: ${formData.name}\nCorreo: ${formData.email}\nTeléfono: ${formData.phone}\nCiudad: ${formData.city}\n${formData.deliveryType === 'delivery' ? `Dirección: ${formData.address}` : 'Recoger en tienda'}\nComentarios: ${formData.comments}`);
      onClearCart();
      onClose();
      setIsCheckingOut(false);
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', city: '', deliveryType: 'pickup', address: '', comments: '' });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Mi Carrito</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={64} className="empty-icon" />
            <h3>Tu carrito está vacío</h3>
            <p>Agrega algunos productos para comenzar a comprar</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">${item.price}</p>
                  </div>
                  <div className="cart-item-controls">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="quantity-button"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="quantity-button"
                    >
                      <Plus size={16} />
                    </button>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="remove-button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Total de productos: {totalItems}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total a pagar:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-actions">
              <button 
                className="checkout-button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                Finalizar Compra
              </button>
              <button 
                className="clear-cart-button"
                onClick={onClearCart}
              >
                Vaciar Carrito
              </button>
            </div>

            {/* Modal de formulario de datos de usuario */}
            {showForm && (
              <div className="modal-overlay">
                <div className="modal-form enhanced" onClick={e => e.stopPropagation()}>
                  <h2 className="modal-title">Confirmar compra</h2>
                  <form onSubmit={handleFormSubmit} className="modal-form-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nombre completo:<span>*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} required autoFocus />
                      </div>
                      <div className="form-group">
                        <label>Correo electrónico:<span>*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Teléfono:<span>*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} required pattern="[0-9\-\+\s]+" />
                      </div>
                      <div className="form-group">
                        <label>Ciudad:<span>*</span></label>
                        <input type="text" name="city" value={formData.city} onChange={handleFormChange} required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group radio-group">
                        <label>Tipo de entrega:<span>*</span></label>
                        <div className="radio-options">
                          <label>
                            <input
                              type="radio"
                              name="deliveryType"
                              value="pickup"
                              checked={formData.deliveryType === 'pickup'}
                              onChange={handleFormChange}
                            />
                            Recoger en tienda
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="deliveryType"
                              value="delivery"
                              checked={formData.deliveryType === 'delivery'}
                              onChange={handleFormChange}
                            />
                            Envío a domicilio
                          </label>
                        </div>
                      </div>
                    </div>
                    {formData.deliveryType === 'delivery' && (
                      <div className="form-row">
                        <div className="form-group" style={{width: '100%'}}>
                          <label>Dirección de envío:<span>*</span></label>
                          <input type="text" name="address" value={formData.address} onChange={handleFormChange} required={formData.deliveryType === 'delivery'} />
                        </div>
                      </div>
                    )}
                    <div className="form-row">
                      <div className="form-group" style={{width: '100%'}}>
                        <label>Comentarios adicionales:</label>
                        <textarea name="comments" value={formData.comments} onChange={handleFormChange} rows={2} placeholder="¿Algo que debamos saber? (opcional)" />
                      </div>
                    </div>
                    {formError && <div className="form-error">{formError}</div>}
                    <div className="modal-actions">
                      <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setFormError(''); }} disabled={isCheckingOut}>Cancelar</button>
                      <button type="submit" className="confirm-btn" disabled={isCheckingOut}>{isCheckingOut ? 'Procesando...' : 'Confirmar compra'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
