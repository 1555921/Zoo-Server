import mongoose from 'mongoose';

const creatureSchema = mongoose.Schema(
    {
        explorateur: { type : String, required: true },
        stats: {
            life:{ type: Number, required: true},
            speed:{ type: Number, required: true},
            power:{ type: Number, required: true},
            shield:{ type: Number, required: true}
        },
        crypto:{
            hash:{ type: String, required: true},
            signature:{ type: String, required: true}
        },
        books:[String],
        kernel: [String],
        archiveIndex:{ type: Number, required: true},
        name:{ type: String, required: true},
        uuid:{ type: String, required: true},
        affinity:{ type: String, required: true},
        essence:{ type: Number, required: true},
        href:{ type: String, required: true},
        asset:{ type: String, required: true},
        createdAt: { type:Date, required:true}
    },
    
    {
        collection: 'creatures',
        timestamps: true,
        strict: 'throw'
    }

    );
    
   

export default mongoose.model('Creature', creatureSchema);