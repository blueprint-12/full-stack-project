const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  console.log(err.stack);

  //status code가 있으면 세팅된 걸로하고 없다면 서버에러 상태코드 500d으로 세팅
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status);

  res.json({ message: err.message });
};

module.exports = errorHandler;
