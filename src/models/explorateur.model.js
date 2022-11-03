import mongoose from 'mongoose';

const explorateurSchema = mongoose.Schema(
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

explorateurSchema.virtual('creatures', {
    ref: 'Creature',
    localField:'_id',
    foreignField: 'explorateur',
    justOne: false,
    _id:false
});


explorateurSchema.index({ nom: 1 }, { unique: true });

export default mongoose.model('Explorateur', explorateurSchema);