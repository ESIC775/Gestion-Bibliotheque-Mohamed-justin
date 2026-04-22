import React, { useState } from "react";
import { Plus, Edit, Trash2, UserCircle } from "lucide-react";
import api from "../api";
import Modal from "../components/Modal";

interface Author {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
}

const AuthorsView = ({
  data,
  onRefresh,
}: {
  data: { authors: Author[] };
  onRefresh: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      firstName: author.firstName,
      lastName: author.lastName,
      bio: author.bio,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer cet auteur ?")) {
      await api.delete(`/authors/${id}`);
      onRefresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingAuthor)
        await api.patch(`/authors/${editingAuthor.id}`, formData);
      else await api.post("/authors", formData);
      setIsModalOpen(false);
      onRefresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="view-content">
      <div className="view-actions">
        <button
          className="btn-primary"
          onClick={() => {
            setEditingAuthor(null);
            setFormData({ firstName: "", lastName: "", bio: "" });
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} /> Ajouter un Auteur
        </button>
      </div>
      <div className="grid-list">
        {data.authors.map((author: Author) => (
          <div key={author.id} className="item-card">
            <div className="item-header">
              <UserCircle className="item-icon" />
              <h3>
                {author.firstName} {author.lastName}
              </h3>
            </div>
            <p className="bio">{author.bio}</p>
            <div className="item-actions">
              <button
                className="btn-icon edit"
                onClick={() => handleEdit(author)}
              >
                <Edit size={16} />
              </button>
              <button
                className="btn-icon delete"
                onClick={() => handleDelete(author.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAuthor ? "Modifier l'Auteur" : "Ajouter un Auteur"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AuthorsView;
