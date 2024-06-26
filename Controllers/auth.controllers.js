import User from '../Models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../Middlewares/error.js';
import jwt from 'jsonwebtoken'
import { privateKey, publicKey } from '../Config/keypair.js';



export const  signup = async (req, res, next)=>{
    const {username, email, password} = req.body;

    if(!username || !email || !password ||username === '' || password === ''){
        next(errorHandler(400, 'All fields are required'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User ({
            username,
            email,
            password: hashedPassword,
        });
        try {
            await newUser.save();
        res.json('Signup successful')
        } catch (error) {
            next(error);
        }
};

export const signin = async (req, res, next)=> {
    const {email, password} = req.body;

    if(!email || !password ||email === '' || password === ''){
        next(errorHandler(400, 'All fields are required'))
    }

    try {
        const validUser = await User.findOne ({email});
        if (!validUser) {
           return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if (!validPassword) {
           return next(errorHandler(400, 'Invalid password'));
        }
        const token = jwt.sign
           ( {id: validUser._id, isAdmin:validUser.isAdmin} , privateKey, { algorithm: 'RS256'});
            console.log(publicKey);
            const {password: pass, ...rest} = validUser._doc;
           res
           .status(200)
           .header ('access_token', token, )
        .json(rest) 

    } catch (error) {
        next(error);
    }
}

