import mongoose from 'mongoose';

const schema = mongoose.Schema(
    {
        username: { type: String, required:true },
        description: { type:String, required:true },
        date: { type:Date, required:true }
    },
    
    {
        collection: 'messages',
        timestamps: true,
        strict: 'throw'
    }

    );
    
   

export default mongoose.model('Message', schema);