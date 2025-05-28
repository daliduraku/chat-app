import express from 'express';
import { User } from '../models/users.js';
import { auth } from '../middleware/auth.js';


const router = new express.Router()

router.post('/users', async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
    } catch(err) {
        res.status(400).send({ error: err.message })
    }
});

router.post('/users/login', async(req, res) => {
    console.log(req.body)

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token })
    } catch(err) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send();
    } catch(err) {
        res.status(400).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send({ message: 'Logged out of all sessions.'})
    } catch(err) {
        console.log('LogoutAll error:', err);
        res.status(400).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'firstname', 'lastname', 'email', 'password', 'dateOfBirth'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);

        await req.user.save();

        if(!req.user) {
            return res.status(404).send()
        }
        res.send(req.user)
    } catch(err) {
        res.status(400).send(err)
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
        const { name, email } = req.user;
        await User.deleteOne({ _id: req.user._id });
        res.send(req.user)
    } catch (err) {
        console.log('Delete user error:', err)
        res.status(400).send()
    }
})








export default router