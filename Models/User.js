import mongoose from 'mongoose'
const Schema = mongoose.Schema
const userSchema = new Schema({
    Mail: {
        type: String
    },
    Date:{
        type:Date
    }
})
export default mongoose.model('User',userSchema)