const allowedOrigins = require("./allowedOrigins");

// array.indexOf = 배열에서 지정된 요소를 찾을 수 있는 첫번째 요소를 반환하고 존재하지 않으면 -1 반환
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
