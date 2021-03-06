import mongoose , {Schema} from "mongoose";
import { createHmac} from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new Schema({
    email: {
        type: String,
        minLength: 5,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    role:{
        type: Number,
        default: 0
    }
}, { timestamps: true});

userSchema.methods = {
    authenticate(password){
        return this.password === this.encryptPassword(password)
    },
    encryptPassword(password){
        if(!password) return
        try {
            return createHmac("Sha256", "abc").update(password).digest("hex");
        } catch (error) {
            console.log(error)
        }
    },
}

userSchema.pre("save", function(next){
    this.salt = uuidv4()
    this.password = this.encryptPassword(this.password)
    next();
});


export default mongoose.model('User', userSchema);
