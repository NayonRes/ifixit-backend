const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequenceValue: { type: Number, default: 100001, initial: 100001 },
});

const counterModel = mongoose.model('counters', counterSchema);

module.exports = counterModel;

// Initialize the counter value if it doesn't already exist
async function initializeCounter() {
    const exists = await counterModel.findById('memberId');
    if (!exists) {
        await counterModel.create({ _id: 'memberId', sequenceValue: 100001 });
    }
}

initializeCounter();