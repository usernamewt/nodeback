let jwt = require('jsonwebtoken')
let options = {
    expiresIn: '3h',
    algorithm: 'HS256',
    jwtSecretKey: 'gnotgnaw'
}

const setToken = (username,id)=>{
    return new Promise((res,rej)=>{
        const token = jwt.sign({
            username,id
        },'gnotgnaw',{expiresIn:'3h'},{algorithm:'HS256'})
        console.log(token);
        res(token);
    })
}

const getToken = (token)=>{
    return new Promise((res,rej)=>{
        if(!token) {
            rej('令牌为空')
        } else {
            const tok = `Bearer [${token}]`
            const virify = jwt.verify(tok,'gnotgnaw');
            res(virify)
        }
    }) 
}

module.exports = {
    setToken,
    getToken
}