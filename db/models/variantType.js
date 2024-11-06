const mongoose = require("mongoose");

const variantTypeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter branch name"],
        trim: true,
        unique: true,
    },
    remarks: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    created_by: {
        type: String,
        trim: true,
        default: "Admin",
    },
    created_at: {type: Date, default: Date.now},
    updated_by: {
        type: String,
        trim: true,
        default: "N/A",
    },
    updated_at: {type: Date, default: Date.now},
});

const variantType = mongoose.model("variant_types", variantTypeSchema);

const saveData = async () => {
    let totalData = await variantType.countDocuments();
    console.log("totalData 123456", totalData);
    if (totalData < 1) {
        const variantTypes = new variantType(
            {
                name: "color",
            });
        await variantTypes.save();
    }
};
saveData();

module.exports = variantType;
