const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
// user에 들어가는 Id는 몽구스관련, 이 Id값의 참조 ref로 어떤 스키마(내가 만든 스키마)를 참조하는 지 알려준다.

// ? 몽고디비에서 제공하는 타임스탬프를 쓰기위해 두번째 객체로 옵션을 넘겨준다.

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});

module.exports = mongoose.model("Note", noteSchema);
