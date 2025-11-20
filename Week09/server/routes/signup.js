import { Router } from 'express';
const router = Router();


const signups = [];
let nextId = 1;

function validateSignup(body) {
    const errors = [];
    const { name, email, phone, password, confirmPassword, terms } = body;

    if (!name || name.length < 2) {
        errors.push('Name is required and must be at least 2 characters.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Email is required and must be in a valid format.');
    }

    const phoneRegex = /^09\d{8}$/;
    if (!phone || !phoneRegex.test(phone)) {
        errors.push('Phone is required and must be a 10-digit number starting with 09.');
    }

    if (!password || password.length < 8) {
        errors.push('Password is required and must be at least 8 characters.');
    }
    
    if (password !== confirmPassword) {
        errors.push('Password and confirmPassword do not match.');
    }
    
    if (terms !== true) {
        errors.push('You must agree to the terms.');
    }

    return errors;
}
router.post('/', (req, res) => {
    const validationErrors = validateSignup(req.body);

    if (validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed.',
            errors: validationErrors
        });
    }

    const { name, email, phone, interests } = req.body;

    const newSignup = {
        id: nextId++,
        name,
        email,
        phone,
        interests: Array.isArray(interests) ? interests : [],
        createdAt: new Date().toISOString(),
    };

    signups.push(newSignup);

    res.status(201).json({
        success: true,
        message: 'Signup successful!',
        data: newSignup,
    });
});

router.get('/', (req, res) => {
    res.json({
        success: true,
        total: signups.length,
        list: signups,
    });
});
export { router };