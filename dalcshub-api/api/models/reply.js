// Author: Meet Kumar Patel

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const repliesSchema = new Schema({
    replied_post_id: {type: String, required: true},
    author_name: {type: String, required: true},
    commentDescription: {type: String, required: true},
    timeCreated: { type: Date, required: true },
});

const Reply  = mongoose.model("replies", repliesSchema);

module.exports = Reply ;
