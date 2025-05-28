import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match:  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    firstname: {
        type: String,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    profilePicture: {
        type: String,
        default: 'default-profile-picture.png',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
});



userSchema.methods.toJSON = function() {
    const userObject = this.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject
}

// generate jwt

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign( { _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await this.findOne({ email });

    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login.')
    }

    return user
}



// hash the plain text password before saving.

userSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

export const User = mongoose.model('User', userSchema);
await User.init();