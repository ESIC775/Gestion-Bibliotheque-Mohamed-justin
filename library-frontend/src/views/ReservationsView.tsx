import { useState } from 'react';
import { CalendarDays, Trash2, XCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

interface Reservation {
  id: number;
  status: 'PENDING' | 'CANCELLED' | 'COMPLETED';
  reservedAt: string;
  userId: number;
  bookId: number;
  user?: { firstName: string; lastName: string };
  book?: { title: string };
}

interface ReservationsViewProps {
  data: {
    reservations: Reservation[];
  };
  onRefresh: () => void;
}

const ReservationsView = ({ data, onRefresh }: ReservationsViewProps) => {
  const [loading, setLoading] = useState<number | null>(null);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
    setLoading(id);
    try {
      await api.patch(`/reservations/${id}/cancel`);
      onRefresh();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Erreur lors de l\'annulation');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer définitivement cette réservation ?')) return;
    setLoading(id);
    try {
      await api.delete(`/reservations/${id}`);
      onRefresh();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="view-content">
      <div className="table-container fade-in">
        <table className="data-table">
          <thead>
            <tr>
              <th>Livre</th>
              <th>Membre</th>
              <th>Date de Réservation</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  Aucune réservation trouvée
                </td>
              </tr>
            ) : (
              data.reservations.map((res) => (
                <motion.tr
                  key={res.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td>
                    <div className="book-info-cell">
                      <span className="book-title">{res.book?.title || 'Livre inconnu'}</span>
                    </div>
                  </td>
                  <td>
                    {res.user ? `${res.user.firstName} ${res.user.lastName}` : 'Utilisateur inconnu'}
                  </td>
                  <td>{new Date(res.reservedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${res.status.toLowerCase()}`}>
                      {res.status === 'PENDING' && <CalendarDays size={14} />}
                      {res.status === 'CANCELLED' && <XCircle size={14} />}
                      {res.status === 'COMPLETED' && <CheckCircle size={14} />}
                      {res.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {res.status === 'PENDING' && (
                        <button
                          className="btn-icon btn-warning"
                          onClick={() => handleCancel(res.id)}
                          disabled={loading === res.id}
                          title="Annuler"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(res.id)}
                        disabled={loading === res.id}
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsView;
