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
        },'gnotgnaw',{expiresIn:'3h'})
        res(token);
    })
}

const removeToken = (username,id)=>{
    return new Promise((res,rej)=>{
        const token = jwt.sign({
            username,id
        },'gnotgnaw',{expiresIn:'1s'})
        res(token);
    })
}

const getToken = (token)=>{
    token = token.split(' ')[1]
    return new Promise((res,rej)=>{
        if(!token) {
            rej({status:401,message:'token is not exist'})
        } 
        else {
            const virify = jwt.verify(token,'gnotgnaw');
            res(virify)
        }
    })
}

module.exports = {
    setToken,
    getToken,
    removeToken
}