const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    forename: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["basic", "member", "admin"],
        default: "basic",
        required: true,
    },
});

UserSchema.virtual("canSeeAuthorshipDetails").get(function() {
    return this.status === "member" || this.status === "admin";
});

UserSchema.virtual("fullName").get(function() {
    return `${this.forename} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);