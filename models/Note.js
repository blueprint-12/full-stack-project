const mongoose = require("mongoose");

// user에 들어가는 Id는 몽구스관련, 이 Id값의 참조 ref로 어떤 스키마를 참조하는 지 알려준다.
const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Note", noteSchema);
