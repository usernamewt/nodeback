function successWithData(data) {
  return {
    code: 0,
    msg: "success",
    data,
  };
}

function successWrong(data){
  return {
    code:-1,
    msg:data
  }
}

function success(value) {
  return {
    code: 0,
    msg: value?value:"success",
  };
}

function fail( msg) {
  return {
    code:500,
    msg,
  };
}

function otherFails(code,msg){
    return {
        code,
        msg
    }
}

module.exports = {
  successWithData,
  success,
  fail,
  otherFails,
  successWrong
}