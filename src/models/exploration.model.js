import mongoose from 'mongoose';

const explorationSchema = mongoose.Schema(
    {
        explorateur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Explorateur',
            required: true
        },
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
        }/*,
        creature: { 
            type: mongoose.Schema.ObjectId, 
            ref:'Creature',
            required: false
        },*/
        
    },
    
    {
        collection: 'explorations',
        timestamps: true,
        strict: 'throw'
    }

    );
    /*schema.virtual('creature', {
        ref: 'Creature',
        localField:'_id',
        foreignField: 'explorateur',
        justOne: true,
        _id:false
    });*/
   

export default mongoose.model('Exploration', explorationSchema);