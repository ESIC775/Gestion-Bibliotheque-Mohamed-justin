import React, { useState } from 'react';
import { Plus, Edit, Trash2, Mail, MapPin, Phone } from 'lucide-react';
import api from '../api';
import Modal from '../components/Modal';

interface User { 
  id: number; 
  firstName: string; 
  lastName: string; 
  email: string; 
  memberProfile?: {
    address: string;
    phone: string;
    membershipNumber: string;
  };
}

const UsersView = ({ data, onRefresh }: { data: any, onRefresh: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '',
    address: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ 
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email,
      address: user.memberProfile?.address || '',
      phone: user.memberProfile?.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce membre ?')) {
      await api.delete(`/users/${id}`);
      onRefresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await api.patch(`/users/${editingUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (error: any) {
      const msg = error.response?.data?.message;
      alert('Erreur: ' + (Array.isArray(msg) ? msg.join(', ') : msg || 'Inconnue'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="view-content">
      <div className="view-actions">
        <button className="btn-primary" onClick={() => { 
          setEditingUser(null); 
          setFormData({firstName:'', lastName:'', email:'', address:'', phone:''}); 
          setIsModalOpen(true); 
        }}>
          <Plus size={18} /> Ajouter un Membre
        </button>
      </div>

      <div className="grid-list">
        {data.users.map((user: User) => (
          <div key={user.id} className="item-card">
            <div className="user-header">
              <div className="avatar">{user.firstName[0]}{user.lastName[0]}</div>
              <div>
                <h3>{user.firstName} {user.lastName}</h3>
                <p className="email"><Mail size={14} /> {user.email}</p>
              </div>
            </div>
            {user.memberProfile && (
              <div className="profile-info">
                <p><MapPin size={14} /> {user.memberProfile.address}</p>
                <p><Phone size={14} /> {user.memberProfile.phone}</p>
                <span className="badge">#{user.memberProfile.membershipNumber}</span>
              </div>
            )}
            {!user.memberProfile && (
              <div className="profile-info error">
                <p>Profil non créé</p>
              </div>
            )}
            <div className="item-actions">
              <button className="btn-icon edit" onClick={() => handleEdit(user)}><Edit size={16} /></button>
              <button className="btn-icon delete" onClick={() => handleDelete(user.id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? 'Modifier le Membre' : 'Ajouter un Membre'}
      >
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input 
                type="text" 
                value={formData.firstName} 
                onChange={e => setFormData({...formData, firstName: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={e => setFormData({...formData, lastName: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input 
              type="text" 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              required={!editingUser}
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input 
              type="text" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              required={!editingUser}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>Enregistrer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersView;
