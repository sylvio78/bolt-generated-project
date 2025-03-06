import React, { useState, useEffect } from 'react';

    function PaymentLinkForm({ onCreateLink, onEditLink, onCancel, initialData, isEditing }) {
      const [formData, setFormData] = useState({
        reservationNumber: '',
        name: '',
        email: '',
        whatsapp: '',
        value: '',
        paymentMethod: 'boleto',
        installments: 1,
        expiryDate: '',
        clientName: '', // Adicionado
      });

      useEffect(() => {
        if (initialData) {
          setFormData({
            reservationNumber: initialData.reservationNumber,
            name: '',
            email: '',
            whatsapp: '',
            value: initialData.totalValue.toString(),
            paymentMethod: initialData.paymentMethod === 'Cartão de Crédito' ? 'cartao' : 'boleto',
            installments: initialData.details?.installments || 1,
            expiryDate: '',
            clientName: initialData.clientName || '', // Adicionado
          });
        }
      }, [initialData]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        const newLink = {
          reservationNumber: formData.reservationNumber,
          totalValue: parseFloat(formData.value),
          status: 'Pendente',
          paymentMethod: formData.paymentMethod === 'cartao' ? 'Cartão de Crédito' : 'Boleto',
          clientName: formData.clientName, // Adicionado
          details: {},
        };

        if (formData.paymentMethod === 'cartao') {
          newLink.details.cardType = formData.installments === 1 ? 'Crédito à vista' : 'Crédito parcelado';
          if (formData.installments > 1) {
            newLink.details.installments = parseInt(formData.installments);
          }
        }

        if (isEditing && initialData) {
          onEditLink(newLink);
        } else {
          onCreateLink(newLink);
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <h2>{isEditing ? 'Editar Link de Pagamento' : 'Criar Link de Pagamento'}</h2>
          <div>
            <label htmlFor="reservationNumber">Número da Reserva:</label>
            <input type="text" id="reservationNumber" name="reservationNumber" value={formData.reservationNumber} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="name">Nome:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="whatsapp">WhatsApp:</label>
            <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="value">Valor:</label>
            <input type="number" id="value" name="value" value={formData.value} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="paymentMethod">Forma de Pagamento:</label>
            <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="boleto">Boleto</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>
          {formData.paymentMethod === 'cartao' && (
            <div>
              <label htmlFor="installments">Parcelas (máx. 10):</label>
              <input type="number" id="installments" name="installments" value={formData.installments} onChange={handleChange} min="1" max="10" />
            </div>
          )}
          <div>
            <label htmlFor="expiryDate">Data de Expiração:</label>
            <input type="date" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="clientName">Nome do Cliente:</label>
            <input type="text" id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} />
          </div>
          <div className="modal-buttons">
            <button type="submit">{isEditing ? 'Salvar' : 'Enviar Link'}</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
      );
    }

    export default PaymentLinkForm;
