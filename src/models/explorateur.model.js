import mongoose from 'mongoose';

const schema = mongoose.Schema(
    {
        courriel: { type: String, required: true, unique: true },
        nom: { type: String, required: true },
        motDePasse: { type: String, required: true },
        inox: { type: Number , default: 0 , required: true },
        elements: [{
            _id : false,
            element : { type : String , required: true },
            quantity: { type: Number , required: true }
        }]
    },
    {
        collection: 'explorateurs',
        timestamps: true,
        strict: 'throw'
    }
);

schema.virtual('creatures', {
    ref: 'Creature',
    localField:'_id',
    foreignField: 'explorateur',
    justOne: false,
    required:false
});


schema.index({ nom: 1 }, { unique: true });

export default mongoose.model('Explorateur', schema);