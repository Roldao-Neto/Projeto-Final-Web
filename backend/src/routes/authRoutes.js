const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.put('/update', authController.verificarToken, authController.updateProfile);

router.get('/me', authController.verificarToken, authController.getProfile);

router.delete('/delete', authController.verificarToken, authController.deleteProfile);

module.exports = router;
