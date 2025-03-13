const express = require('express');
const sequelize = require('./config/database');
const Injury = require('./models/Injury');
const User = require('./models/User');
const Treatment = require('./models/Treatment');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test the database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Create a new treatment
app.post('/treatments', async (req, res) => {
    try {
        const newTreatment = await Treatment.create(req.body);
        res.status(201).json(newTreatment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create treatment' });
    }
});

// Get all treatments
app.get('/treatments', async (req, res) => {
    try {
        const treatments = await Treatment.findAll();
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch treatments' });
    }
});

// Get a specific treatment by ID
app.get('/treatments/:id', async (req, res) => {
    try {
        const treatment = await Treatment.findByPk(req.params.id);
        if (treatment) {
            res.json(treatment);
        } else {
            res.status(404).json({ error: 'Treatment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch treatment' });
    }
});

// Update a treatment
app.put('/treatments/:id', async (req, res) => {
    try {
        const treatment = await Treatment.findByPk(req.params.id);
        if (treatment) {
            await treatment.update(req.body);
            res.json(treatment);
        } else {
            res.status(404).json({ error: 'Treatment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update treatment' });
    }
});

// Delete a treatment
app.delete('/treatments/:id', async (req, res) => {
    try {
        const treatment = await Treatment.findByPk(req.params.id);
        if (treatment) {
            await treatment.destroy();
            res.status(204).end(); // No content
        } else {
            res.status(404).json({ error: 'Treatment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete treatment' });
    }
});

// Injury Endpoints
// Create a new injury
app.post('/injuries', async (req, res) => {
    try {
        const newInjury = await Injury.create(req.body);
        res.status(201).json(newInjury);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create injury' });
    }
});

// Get all injuries
app.get('/injuries', async (req, res) => {
    try {
        const injuries = await Injury.findAll();
        res.json(injuries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch injuries' });
    }
});

// Get a specific injury by ID
app.get('/injuries/:id', async (req, res) => {
    try {
        const injury = await Injury.findByPk(req.params.id);
        if (injury) {
            res.json(injury);
        } else {
            res.status(404).json({ error: 'Injury not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch injury' });
    }
});

// Update an injury
app.put('/injuries/:id', async (req, res) => {
    try {
        const injury = await Injury.findByPk(req.params.id);
        if (injury) {
            await injury.update(req.body);
            res.json(injury);
        } else {
            res.status(404).json({ error: 'Injury not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update injury' });
    }
});

// Delete an injury
app.delete('/injuries/:id', async (req, res) => {
    try {
        const injury = await Injury.findByPk(req.params.id);
        if (injury) {
            await injury.destroy();
            res.status(204).end(); // No content
        } else {
            res.status(404).json({ error: 'Injury not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete injury' });
    }
});

// User Endpoints
/* app.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});*/
app.post('/users', async (req, res) => {
    console.log('Received request:', req.body);
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Sequelize error:', error);
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
});

// view all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

//view user by id
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

//update user
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body); // Update the user with the data in the request body
      res.json(user); // Return the updated user data in the response
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

//delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).end(); // 204 No Content on successful deletion
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// database synchronization ensuring Treatment model is included
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});