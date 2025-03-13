const { DataTypes }  = require("sequelize")
const sequelize = require('../../config/sequelize')
const User = sequelize.define("user",{
    id:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    },
    state:{
        type:DataTypes.INTEGER
    },
    role_id:{
        type:DataTypes.INTEGER
    },
    avatar:{
        type:DataTypes.INTEGER
    },
    nickname:{
        type:DataTypes.STRING
    },
    mobile:{
        type:DataTypes.STRING
    },
    bgavatar:{
        type:DataTypes.STRING
    }
})

module.exports = User