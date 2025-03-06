import React, { useState } from 'react';
    import PaymentLinkForm from './PaymentLinkForm';

    function App() {
      const [paymentLinks, setPaymentLinks] = useState([
        {
          reservationNumber: 'RES-12345',
          emissionDate: '2024-01-20',
          totalValue: 100.00,
          status: 'Pendente',
          paymentMethod: 'Cartão de Crédito',
          clientName: 'João Silva',
          details: {
            cardType: 'Crédito à vista',
            transactionId: 'TXN-001',
          },
        },
        {
          reservationNumber: 'RES-67890',
          emissionDate: '2024-01-15',
          totalValue: 250.00,
          status: 'Pago',
          paymentMethod: 'Boleto',
          clientName: 'Maria Oliveira',
          details: {
            dueDate: '2024-01-25',
            paymentDate: '2024-01-22',
          },
        },
        {
          reservationNumber: 'RES-11223',
          emissionDate: '2024-01-10',
          totalValue: 150.00,
          status: 'Cancelado',
          paymentMethod: 'Cartão de Crédito',
          clientName: 'Pedro Santos',
          details: {
            cardType: 'Crédito parcelado',
            installments: 3,
            cancellationDate: '2024-01-12',
            nsu: 'NSU-00123',
          },
        },
        {
          reservationNumber: 'RES-98765',
          emissionDate: '2024-01-28',
          totalValue: 75.00,
          status: 'Pago',
          paymentMethod: 'Cartão de Crédito',
          clientName: 'Ana Paula',
          details: {
            cardType: 'Crédito à vista',
            transactionId: 'TXN-002',
            nsu: 'NSU-00456',
            paymentDate: '2024-01-29',
          },
        },
      ]);

      const [expandedLink, setExpandedLink] = useState(null);
      const [menuOpen, setMenuOpen] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editingLink, setEditingLink] = useState(null);
      const [isEditing, setIsEditing] = useState(false);
      const [searchTerm, setSearchTerm] = useState('');

      const toggleDetails = (index) => {
        setExpandedLink(expandedLink === index ? null : index);
        setMenuOpen(null);
      };

      const toggleMenu = (index) => {
        setMenuOpen(menuOpen === index ? null : index);
      };

      const handleMenuAction = (linkIndex, action) => {
        console.log(`Ação ${action} no link ${linkIndex}`);
        setMenuOpen(null);
      };

      const getStatusColor = (status) => {
        switch (status) {
          case 'Pendente':
            return '#ffc107'; // Amarelo
          case 'Pago':
            return '#28a745'; // Verde
          case 'Cancelado':
            return '#dc3545'; // Vermelho
          default:
            return '#6c757d'; // Cinza
        }
      };

      const openModal = () => {
        setIsModalOpen(true);
        setIsEditing(false);
        setEditingLink(null);
      };

      const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingLink(null);
      };

      const handleCreateLink = (newLink) => {
        setPaymentLinks([...paymentLinks, newLink]);
        closeModal();
      };

      const handleEditLink = (index) => {
        setEditingLink(paymentLinks[index]);
        setIsEditing(true);
        setIsModalOpen(true);
      };

      const handleUpdateLink = (updatedLink) => {
        const updatedLinks = paymentLinks.map((link, index) => {
          if (link === editingLink) {
            return { ...updatedLink, emissionDate: new Date().toISOString().slice(0, 10) };
          }
          return link;
        });
        setPaymentLinks(updatedLinks);
        closeModal();
      };

      const handleCancelModal = () => {
        if (window.confirm('Deseja realmente cancelar?')) {
          closeModal();
        }
      };

      const handleComprovante = (index) => {
        console.log(`Gerando comprovante para o link ${index}`);
      };

      const handleSearch = (e) => {
        setSearchTerm(e.target.value);
      };

      const filteredLinks = paymentLinks.filter(link =>
        link.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.emissionDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (link.clientName && link.clientName.toLowerCase().includes(searchTerm.toLowerCase())) // Busca por nome do cliente
      );

      return (
        <div>
          <div className="header">
            <h1>💰 Gerenciamento de Links de Pagamento</h1>
          </div>
          <div className="controls">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button onClick={openModal} className="create-link-button">Criar Link</button>
          </div>

          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <PaymentLinkForm
                  onCreateLink={handleCreateLink}
                  onEditLink={handleUpdateLink}
                  onCancel={handleCancelModal}
                  initialData={editingLink}
                  isEditing={isEditing}
                />
              </div>
            </div>
          )}

          {filteredLinks.map((link, index) => (
            <div
              key={index}
              className="payment-link-container"
              onClick={() => toggleDetails(index)}
            >
              <div className="payment-link-header">
                <div className="payment-link-columns">
                  <div className="payment-link-column">
                    <b>Reserva:</b> {link.reservationNumber}
                  </div>
                  <div className="payment-link-column">
                    <b>Data:</b> {link.emissionDate}
                  </div>
                  <div className="payment-link-column">
                    <b>Cliente:</b> {link.clientName}
                  </div>
                  <div className="payment-link-column">
                    <b>Valor:</b> R$ {link.totalValue.toFixed(2)}
                  </div>
                  <div className="payment-link-column">
                    <span className="payment-link-status" style={{ backgroundColor: getStatusColor(link.status), color: '#fff', padding: '4px 8px', borderRadius: '12px', display: 'inline-block', fontSize: '0.8em' }}>
                      {link.status}
                    </span>
                  </div>
                </div>
                <div className="payment-link-menu">
                  <button className="payment-link-menu-button" onClick={(e) => { e.stopPropagation(); toggleMenu(index); }}>
                    ...
                  </button>
                  <div className={`payment-link-menu-options ${menuOpen === index ? 'show' : ''}`}>
                    {link.status === 'Pendente' && (
                      <div className="payment-link-menu-option" onClick={(e) => { e.stopPropagation(); handleEditLink(index); }}>Editar</div>
                    )}
                    {link.status === 'Pago' && (
                      <div className="payment-link-menu-option" onClick={(e) => { e.stopPropagation(); handleComprovante(index); }}>Comprovante</div>
                    )}
                  </div>
                </div>
              </div>
              <div className={`payment-link-details ${expandedLink === index ? 'expanded' : ''}`}>
                <p><b>Data de Criação:</b> {link.emissionDate}</p>
                {link.details.paymentDate && (
                  <p><b>Data de Pagamento:</b> {link.details.paymentDate}</p>
                )}
                {link.details.cancellationDate && (
                  <p><b>Data de Cancelamento:</b> {link.details.cancellationDate}</p>
                )}
                <p><b>Método de Pagamento:</b> {link.paymentMethod}</p>
                {link.paymentMethod === 'Cartão de Crédito' && (
                  <>
                    <p><b>Tipo de Cartão:</b> {link.details.cardType}</p>
                    {link.details.installments && <p><b>Parcelas:</b> {link.details.installments}</p>}
                    <p><b>ID da Transação:</b> {link.details.transactionId}</p>
                    {link.details.nsu && <p><b>NSU:</b> {link.details.nsu}</p>}
                  </>
                )}
                {link.paymentMethod === 'Boleto' && (
                  <>
                    <p><b>Data de Vencimento:</b> {link.details.dueDate}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    export default App;
