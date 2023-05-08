const User = require("../models/User");
const Note = require("../models/Note"); // 컨트롤러 내부에서 참조할 수도 있으니까 가져온다.
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc GEt all users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) => {
  //find, select, lean 메서드는 mongoose의 메서드
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  //TODO: confirm DATA
  // Array.isArray(인자) 인자가 Array인지 확인 return boolean
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // TODO: Check for duplicate(중복 방지)
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    // error code 409 : conflict
    return res.status(409).json({ message: "Duplicate username" });
  }

  // TODO: Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // saltRounds: 10=> 반복할 솔트의 횟수를 지정한다. 보통 10이상으로 지정하여 보안성을 높인다.

  const userObject = { username, password: hashedPwd, roles };

  // TODO: 새 유저를 생성하고 저장하기
  const user = await User.create(userObject);
  if (user) {
    // 만일 생성되었다면?
    res.status(201).json({
      message: `New user ${username} created`,
    });
  } else {
    res
      .status(400)
      .json({ message: "유효하지 않은 유저 데이터를 전달받았습니다." });
  }
});

// @desc Update a user
// @route PATCH /user:id
// @access Private

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // TODO: confirm DATA
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // ✅리턴값이 Query(몽구스 쿼리)이면 then()을 사용할 수 있는 유사 프로미스이다. exec()를 사용하면 `쿼리`가 아니라 `온전한 프로미스`를 반환값으로 얻을 수 있다. + 에러가 났을 때, stack trace에 오류가 발생한 코드의 위치가 포함되기 때문에 사용이 권장된다.
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "찾는 유저가 존재하지 않습니다." });
  }

  // TODO: Check for duplicate
  // 중복값인지
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the origin user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save(); //변경된 새로운 값 DB에 저장

  res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /user:id
// @access Private

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "user ID required" });
  }
  //유저를 삭제하기 전에 특정 사용자의 존재 notes를 확인해야 한다.

  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res
      .status(400)
      .json({ message: "유저에게 할당된 노트가 존재합니다." });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "해당 유저가 존재하지 않습니다." });
  }

  const result = await user.deleteOne();

  const reply = `ID가 ${result._id}인 유저 ${result.username}가 성공적으로 삭제되었습니다. `;

  res.json({ message: reply }); // 200 OK 시
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
