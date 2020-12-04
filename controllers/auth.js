const { response } = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/jwt");
const user = require("../models/user");

const createUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const emailExist = await User.findOne({email});
        if (emailExist) {
            return res.status(400).json({
                ok: false,
                msg: 'Email is already used'
            });
        }
        const user = new User(req.body);
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        await user.save();
        const token = await generateJWT(user.id);
        res.json({
            ok: true,
            user,
            token
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
    
}

const loginUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const userDB = await user.findOne({email});
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email not found'
            });
        }
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Password incorrect'
            });
        }
        const token = await generateJWT(userDB.id);
        res.json({
            ok: true,
            user: userDB,
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    const token = await generateJWT(uid);
    const user = await User.findById(uid);
    res.json({
        ok: true,
        token,
        user
    });
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}