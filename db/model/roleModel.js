const {DataTypes} = require('sequelize');
const sequelize = require('../../config/sequelize');
const Role = sequelize.define('role',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    role_name:{
        type:DataTypes.STRING,
    },
    state:{
        type:DataTypes.INTEGER,
    },
    desc:{
        type:DataTypes.STRING,
    },
    permission_ids:{
        type:DataTypes.STRING,
    }
})
module.exports = Role;