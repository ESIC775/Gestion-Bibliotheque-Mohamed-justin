import React, { useState, useMemo } from "react";
import { Plus, Edit, Trash2, BookOpen, Search } from "lucide-react";
import api from "../api";
import Modal from "../components/Modal";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  id: number;
  title: string;
  isbn: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  summary: string;
  categoryId: number;
  coverUrl?: string;
  category?: { name: string };
  authors?: { id: number; firstName: string; lastName: string }[];
}

interface AuthorOption {
  id: number;
  firstName: string;
  lastName: string;
}
interface CategoryOption {
  id: number;
  name: string;
}
interface BooksData {
  books: Book[];
  authors: AuthorOption[];
  categories: CategoryOption[];
}

const BooksView = ({
  data,
  onRefresh,
}: {
  data: BooksData;
  onRefresh: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publishedYear: new Date().getFullYear(),
    totalCopies: 1,
    availableCopies: 1,
    summary: "",
    coverUrl: "",
    categoryId: data.categories[0]?.id || 1,
    authorIds: [data.authors[0]?.id || 1],
  });

  const filteredBooks = useMemo(() => {
    return data.books.filter(
      (book: Book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery),
    );
  }, [data.books, searchQuery]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      isbn: book.isbn,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      summary: book.summary || "",
      coverUrl: book.coverUrl || "",
      categoryId: book.categoryId,
      authorIds: book.authors?.map((a: AuthorOption) => a.id) || [
        data.authors[0]?.id || 1,
      ],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer ce livre ?")) {
      try {
        await api.delete(`/books/${id}`);
        onRefresh();
      } catch (error: unknown) {
        const e = error as {
          response?: { data?: { message?: string | string[] } };
        };
        alert(
          "Erreur: " + (e.response?.data?.message || "Suppression impossible"),
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingBook) {
        await api.patch(`/books/${editingBook.id}`, formData);
      } else {
        await api.post("/books", formData);
      }
      setIsModalOpen(false);
      setEditingBook(null);
      onRefresh();
    } catch (error: unknown) {
      const e = error as {
        response?: { data?: { message?: string | string[] } };
      };
      const msg = e.response?.data?.message;
      alert(
        "Erreur: " + (Array.isArray(msg) ? msg.join(", ") : msg || "Inconnue"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="view-content">
      <div className="view-actions">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher par titre ou ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingBook(null);
            setFormData({
              title: "",
              isbn: "",
              publishedYear: new Date().getFullYear(),
              totalCopies: 1,
              availableCopies: 1,
              summary: "",
              coverUrl: "",
              categoryId: data.categories[0]?.id || 1,
              authorIds: [data.authors[0]?.id || 1],
            });
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} /> Ajouter un Livre
        </button>
      </div>

      <div className="books-grid">
        <AnimatePresence>
          {filteredBooks.map((book: Book) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={book.id}
              className="book-card"
            >
              <div className="book-cover-container">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="book-cover"
                  />
                ) : (
                  <div className="book-cover-placeholder">
                    <BookOpen size={48} />
                  </div>
                )}
                <div className="book-badge category">{book.category?.name}</div>
              </div>

              <div className="book-details">
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="book-authors">
                    {book.authors
                      ?.map((a) => `${a.firstName} ${a.lastName}`)
                      .join(", ")}
                  </p>
                  <p className="book-isbn">ISBN: {book.isbn}</p>
                </div>

                <div className="book-stock">
                  <span
                    className={`stock-tag ${book.availableCopies > 0 ? "in" : "out"}`}
                  >
                    {book.availableCopies} / {book.totalCopies} disponibles
                  </span>
                </div>

                <div className="book-actions">
                  <button
                    className="btn-icon edit"
                    onClick={() => handleEdit(book)}
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDelete(book.id)}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? "Modifier le Livre" : "Ajouter un Livre"}
      >
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-row">
            <div className="form-group">
              <label>Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL de la Couverture</label>
            <div className="input-with-preview">
              <input
                type="url"
                value={formData.coverUrl}
                onChange={(e) =>
                  setFormData({ ...formData, coverUrl: e.target.value })
                }
                placeholder="https://..."
              />
              {formData.coverUrl && (
                <img
                  src={formData.coverUrl}
                  className="preview-small"
                  alt="Preview"
                />
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Année</label>
              <input
                type="number"
                value={formData.publishedYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishedYear: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Copies totales</label>
              <input
                type="number"
                value={formData.totalCopies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalCopies: parseInt(e.target.value),
                    availableCopies: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Catégorie</label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: parseInt(e.target.value),
                  })
                }
              >
                {data.categories.map((c: CategoryOption) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Auteur principal</label>
              <select
                value={formData.authorIds[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    authorIds: [parseInt(e.target.value)],
                  })
                }
              >
                {data.authors.map((a: AuthorOption) => (
                  <option key={a.id} value={a.id}>
                    {a.firstName} {a.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Résumé</label>
            <textarea
              rows={3}
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
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
              {editingBook
                ? "Enregistrer les modifications"
                : "Enregistrer le Livre"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BooksView;
