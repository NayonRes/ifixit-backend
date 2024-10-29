const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequenceValue: { type: Number, default: 100001, initial: 100001 },
});

const counter = mongoose.model('counters', counterSchema);

module.exports = counter;

// Initialize the counter value if it doesn't already exist
async function initializeCounter() {
    const exists = await counter.findById('memberId');
    if (!exists) {
        await counter.create({ _id: 'memberId', sequenceValue: 100001 });
    }
}

initializeCounter();