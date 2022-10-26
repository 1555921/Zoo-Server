import mongoose from 'mongoose';

const schema = mongoose.Schema(
    {
        explorateur : { type: String , required:true },
        explorationDate: { type: Date, required: true },
        destination: { type: String, required: true },
        affinity: { type: String, required: true },
        vault: { 
            inox: { type: Number, required:true },
            elements: [
                {
                    element: { type: String, required:true },
                    quantity: { type: Number, required:true }
                }
            ]
        },
        creature: { 
            type: mongoose.Schema.ObjectId, 
            ref:'Creature',
            required: false
        },
        
    },
    
    {
        collection: 'explorations',
        timestamps: true,
        strict: 'throw'
    }

    );
    
   

export default mongoose.model('Exploration', schema);