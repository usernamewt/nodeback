const endMiddleware = (req, res, next) => {
    const defaultWrite = res.write;
    const defaultEnd = res.end;
    const chunks = [];
    res.write = (...restArgs) => {
      chunks.push(Buffer.from(restArgs[0]));
      defaultWrite.apply(res, restArgs);
    };
    res.end = (...restArgs) => {
      let mList = ["POST", "GET"];
      if (mList.indexOf(req.method) !== -1) {
        if (restArgs[0]) {
          chunks.push(Buffer.from(restArgs[0]));
        }
        const body = Buffer.concat(chunks).toString("utf8");
        const time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const blacklist = ["/adminRequestLog/queryAdminRequestLogListByPage"];
        if (blacklist.indexOf(req.url) === -1) {
          AdminRequestLog.create({
            user_id: req.data && req.data.user_id ? req.data.user_id : null,
            username: req.data && req.data.username ? req.data.username : null,
            url: req.url,
            method: req.method,
            body: JSON.stringify(req.body),
            params: "",
            ip_address: getClientIp(req),
            result: JSON.stringify(body),
            create_time: time,
            updated_time: time,
          });
        }
      }
      defaultEnd.apply(res, restArgs);
    };
    next();
  };