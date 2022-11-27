import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';
const AutoIncrement = AutoIncrementFactory(mongoose);
const noteSchema = new mongoose.Schema(
        {
        user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User",
        },
        title: {
                type: String,
                required: true
        },
        text: {
                type: String,
                default: "Employee"
        },
        completed: {
                type: Boolean,
                default: false
        },
        _id: Number,

},
{ timestamps: true },
{_id: false},
)

noteSchema.plugin(AutoIncrement,{
        inc_filed: 'ticket',
        id: 'ticketNums',
        start_seq: 500
})

export default mongoose.model('Note', noteSchema);