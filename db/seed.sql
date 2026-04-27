-- Suppression des anciennes données pour forcer la remise à zéro propre
-- Désactivation des contraintes pour le nettoyage
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE book_authors;
TRUNCATE TABLE loans;
TRUNCATE TABLE books;
TRUNCATE TABLE member_profiles;
TRUNCATE TABLE authors;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insertion des données propres
INSERT INTO users (id, firstName, lastName, email, password, createdAt, updatedAt)
VALUES
  (1, 'Amina', 'Bensaid', 'amina@example.com', '$2b$10$bayzXtFz1yXioAok53cKSuHICNEmYw3ePTSXp/7JCisjMur9TeY8e', NOW(), NOW()),
  (2, 'Yanis', 'Dupont', 'yanis@example.com', '$2b$10$bayzXtFz1yXioAok53cKSuHICNEmYw3ePTSXp/7JCisjMur9TeY8e', NOW(), NOW()),
  (3, 'Mohamed', 'Daoud', 'mohamed@gmail.com', '$2b$10$wFUyUzZYgWnyNfNDn0cpcu0GW8kykXFoqHtBJEvFQ/IENFP1DWPIG', NOW(), NOW()),
  (4, 'Justin', 'Ami', 'justin@gmail.com', '$2b$10$2dFrGp//fDUdPrDXkNf33Oe0TdEOVh41ZF5mF2kBLEq7wS5s2zSte', NOW(), NOW());

INSERT INTO member_profiles (id, address, phone, membershipNumber, joinedAt, userId, createdAt, updatedAt)
VALUES
  (1, '12 rue des Fleurs, Paris', '+33601020304', 'MEM-2026-001', NOW(), 1, NOW(), NOW()),
  (2, '5 avenue du Livre, Lyon', '+33605060708', 'MEM-2026-002', NOW(), 2, NOW(), NOW()),
  (3, '8 rue de la Bibliothèque, Marseille', '+33607080910', 'MEM-2026-003', NOW(), 3, NOW(), NOW()),
  (4, '15 boulevard des Livres, Nice', '+33611121314', 'MEM-2026-004', NOW(), 4, NOW(), NOW());

INSERT INTO authors (id, firstName, lastName, bio, createdAt, updatedAt)
VALUES
  (1, 'Victor', 'Hugo', 'Auteur français du XIXe siècle.', NOW(), NOW()),
  (2, 'Jules', 'Verne', 'Pionnier du roman scientifique.', NOW(), NOW()),
  (3, 'Colleen', 'Hoover', 'Autrice américaine de romances contemporaines.', NOW(), NOW()),
  (4, 'Ana', 'Huang', 'Autrice de best-sellers de romance contemporaine.', NOW(), NOW()),
  (5, 'Robyne', 'Max Chavalan', 'Autrice de romance.', NOW(), NOW()),
  (6, 'Cecy', 'Robson', 'Autrice de romance.', NOW(), NOW()),
  (7, 'Margherita', 'Gabbiani', 'Autrice de romance.', NOW(), NOW());

INSERT INTO categories (id, name, description, createdAt, updatedAt)
VALUES
  (1, 'Roman', 'Ouvrages de fiction littéraire.', NOW(), NOW()),
  (2, 'Science-fiction', 'Romans d''anticipation et d''aventure scientifique.', NOW(), NOW()),
  (3, 'Romance', 'Histoires d''amour et relations sentimentales.', NOW(), NOW());

INSERT INTO books (id, title, isbn, publishedYear, totalCopies, availableCopies, summary, coverUrl, categoryId, createdAt, updatedAt)
VALUES
  (1, 'Les Misérables', '978-2070409189', 1862, 5, 4, 'Roman historique et social.', 'https://covers.openlibrary.org/b/id/12818862-L.jpg', 1, NOW(), NOW()),
  (2, 'Vingt mille lieues sous les mers', '978-2253006324', 1870, 4, 3, 'Aventure sous-marine emblématique.', 'https://covers.openlibrary.org/b/id/8231990-L.jpg', 2, NOW(), NOW()),
  (3, 'Jamais Plus', '978-2755624734', 2017, 3, 3, 'Lily Bloom s''installe à Boston...', '/covers/jamais_plus.png', 3, NOW(), NOW()),
  (4, 'Kings of Sin', '978-2755670007', 2024, 2, 2, 'Une histoire de sin et de luxe.', '/covers/kings_of_sin.png', 3, NOW(), NOW()),
  (5, 'Just Romance', '978-2755620001', 2023, 2, 2, 'Une histoire de romance passionnée.', '/covers/just_romance.png', 3, NOW(), NOW()),
  (6, 'Loved', '978-2755620002', 2022, 2, 2, 'Un amour inconditionnel.', '/covers/loved.png', 3, NOW(), NOW()),
  (7, 'I Want Your Revenge', '978-2755620003', 2024, 2, 2, 'Une vengeance romantique.', '/covers/revenge.png', 3, NOW(), NOW());

INSERT INTO book_authors (bookId, authorId)
VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5),
  (6, 6),
  (7, 7);

INSERT INTO loans (id, borrowedAt, dueDate, returnedAt, status, userId, bookId, createdAt, updatedAt)
VALUES
  (1, NOW(), ADDDATE(NOW(), 14), NULL, 'BORROWED', 1, 1, NOW(), NOW()),
  (2, NOW(), ADDDATE(NOW(), 7), NULL, 'BORROWED', 2, 2, NOW(), NOW());
