const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Activer CORS pour toutes les origines
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Karnak Vote Bot API - Server is running',
    endpoints: {
      claimVote: 'POST /api/claim-vote'
    }
  });
});

// Route pour valider le vote sur Karnak
app.post('/api/claim-vote', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      error: 'Token manquant' 
    });
  }

  try {
    const response = await fetch('https://soon.karnak-retro.net/api/votes/spnet/claim', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = await response.text();
    
    if (response.ok) {
      res.json({ 
        success: true, 
        message: 'Vote validé avec succès',
        data: data
      });
    } else {
      res.json({ 
        success: false, 
        error: data || 'Erreur lors de la validation',
        status: response.status
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
