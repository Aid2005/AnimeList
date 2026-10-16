const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static images from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Disk storage configuration for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ==========================================
// ANIME ROUTES
// ==========================================

// GET - Retrieve all anime records
app.get('/api/anime', async (req, res) => {
  try {
    const [animeList] = await db.query('SELECT * FROM anime');
    res.json(animeList);
  } catch (error) {
    console.error("Error fetching anime list:", error);
    res.status(500).json({ error: 'Failed to retrieve anime list' });
  }
});

// GET - Retrieve details for a single anime
app.get('/api/anime/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM anime WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Anime not found in database' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Database error fetching anime details:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST - Add a new anime with image cover
app.post('/api/anime', upload.single('cover_image'), async (req, res) => {
  const { title, description, total_episodes, category, status, average_rating } = req.body;
  const cover_image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

  try {
    const query = `
      INSERT INTO anime (title, description, cover_image, total_episodes, category, status, average_rating) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(query, [
      title, description, cover_image, total_episodes, category, status || 'Finished', average_rating || 0.0
    ]);
    res.status(201).json({ message: 'Anime added successfully!' });
  } catch (error) {
    console.error("Error creating anime record:", error);
    res.status(500).json({ error: 'Failed to add anime' });
  }
});

// PUT - Update an existing anime record
app.put('/api/anime/:id', upload.single('cover_image'), async (req, res) => {
  const { id } = req.params;
  const { title, description, total_episodes, category, status, average_rating, existing_image } = req.body;
  
  const cover_image = req.file 
    ? `http://localhost:5000/uploads/${req.file.filename}` 
    : existing_image;

  try {
    const query = `
      UPDATE anime 
      SET title = ?, description = ?, cover_image = ?, total_episodes = ?, category = ?, status = ?, average_rating = ? 
      WHERE id = ?
    `;
    await db.query(query, [
      title, description, cover_image, total_episodes, category, status || 'Finished', average_rating || 0.0, id
    ]);
    res.json({ message: 'Anime updated successfully!' });
  } catch (error) {
    console.error("Error updating anime record:", error);
    res.status(500).json({ error: 'Failed to update anime' });
  }
});

// DELETE - Remove an anime record
app.delete('/api/anime/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM anime WHERE id = ?', [id]);
    res.json({ message: 'Anime deleted successfully!' });
  } catch (error) {
    console.error("Error deleting anime:", error);
    res.status(500).json({ error: 'Failed to delete anime' });
  }
});

// ==========================================
// USER ROUTES
// ==========================================

// GET - Retrieve all registered users
app.get('/api/users', async (req, res) => {
  try {
    const [results] = await db.query("SELECT Id AS id, username, email, role FROM users");
    res.json(results);
  } catch (error) {
    console.error("Database error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - User Authentication (Login)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = "SELECT Id AS id, username, email, role FROM users WHERE username = ? AND password = ?";
    const [users] = await db.query(query, [username, password]);

    if (users.length > 0) {
      res.json(users[0]);
    } else {
      res.status(401).json({ message: "Invalid username or password!" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during authentication" });
  }
});

// POST - User Registration (Sign Up)
app.post('/api/users', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    await db.query(query, [username, email, password, role || 'user']);
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "A user with this email or username already exists!" });
    }
    res.status(500).json({ message: "Server error creating user account." });
  }
});

// DELETE - Remove a user account
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE Id = ?", [id]);
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Database error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// COMMENT ROUTES
// ==========================================

// GET - Retrieve comments for a specific anime
app.get('/api/comments/:anime_id', async (req, res) => {
  const { anime_id } = req.params;
  try {
    const query = `
      SELECT c.id, c.text, c.created_at AS date, u.username AS user 
      FROM comments c
      JOIN users u ON c.user_id = u.Id
      WHERE c.anime_id = ? 
      ORDER BY c.created_at DESC
    `;
    const [comments] = await db.query(query, [anime_id]);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Create a new comment
app.post('/api/comments', async (req, res) => {
  const { anime_id, user_id, text } = req.body;
  try {
    const query = "INSERT INTO comments (anime_id, user_id, text) VALUES (?, ?, ?)";
    await db.query(query, [anime_id, user_id, text]);
    res.status(201).json({ message: "Comment posted successfully." });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to post comment" });
  }
});

// DELETE - Remove a comment (Admin only)
app.delete('/api/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM comments WHERE id = ?", [id]);
    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// USER ANIME LIST & RATING ROUTES
// ==========================================

// GET - Retrieve custom list for a specific user
app.get('/api/user-list/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const query = `
      SELECT 
        ual.id AS list_id,
        ual.user_id,
        ual.anime_id,
        ual.status,
        ual.user_rating,
        ual.episodes_watched,
        a.title,
        a.cover_image,
        a.category,
        a.total_episodes,
        a.average_rating
      FROM user_anime_list ual
      JOIN anime a ON ual.anime_id = a.id
      WHERE ual.user_id = ?
      ORDER BY ual.updated_at DESC
    `;
    const [userList] = await db.query(query, [user_id]);
    res.json(userList);
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Add or update anime in user list & recalculate average rating
app.post('/api/user-list', async (req, res) => {
  const { user_id, anime_id, status, user_rating, episodes_watched } = req.body;

  if (!user_id || !anime_id || !status) {
    return res.status(400).json({ message: "All required fields must be provided!" });
  }

  try {
    // 1. Validate watched episodes against total episodes
    const [animeRows] = await db.query("SELECT total_episodes FROM anime WHERE id = ?", [anime_id]);
    const maxEpisodes = animeRows.length > 0 ? animeRows[0].total_episodes : null;

    let validEpisodesWatched = parseInt(episodes_watched) || 0;

    if (maxEpisodes && validEpisodesWatched > maxEpisodes) {
      return res.status(400).json({ 
        message: `Watched episodes (${validEpisodesWatched}) cannot exceed total episodes (${maxEpisodes})!` 
      });
    }

    // 2. Check if item already exists in user list
    const [existing] = await db.query(
      "SELECT id FROM user_anime_list WHERE user_id = ? AND anime_id = ?",
      [user_id, anime_id]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE user_anime_list SET status = ?, user_rating = ?, episodes_watched = ? WHERE user_id = ? AND anime_id = ?",
        [status, user_rating || null, validEpisodesWatched, user_id, anime_id]
      );
    } else {
      await db.query(
        "INSERT INTO user_anime_list (user_id, anime_id, status, user_rating, episodes_watched) VALUES (?, ?, ?, ?, ?)",
        [user_id, anime_id, status, user_rating || null, validEpisodesWatched]
      );
    }

    // 3. Recalculate average rating for the anime
    const [ratingResult] = await db.query(
      "SELECT AVG(user_rating) AS avg_rating FROM user_anime_list WHERE anime_id = ? AND user_rating IS NOT NULL AND user_rating > 0",
      [anime_id]
    );

    const newAvgRating = ratingResult[0].avg_rating 
      ? parseFloat(ratingResult[0].avg_rating).toFixed(1) 
      : 0.0;

    await db.query("UPDATE anime SET average_rating = ? WHERE id = ?", [newAvgRating, anime_id]);

    res.status(200).json({ 
      message: "Successfully saved to list!", 
      newAverageRating: newAvgRating 
    });

  } catch (error) {
    console.error("Error saving to user list:", error);
    res.status(500).json({ message: "Server error saving to list" });
  }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});