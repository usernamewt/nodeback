const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const User = require("./userModel");
const ChatInfo = sequelize.define("chat_info", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: "主键",
    },
    from_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "谁发送的消息",
    },
    to_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "发给谁",
    },
    content: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        comment: "消息内容",
    },
    created_time: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        comment: "创建时间",
    },
    updated_time: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        comment: "更新时间",
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: "状态",
    },
    type: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
        comment: "消息类型",
    },
    is_read: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: "是否已读",
    },
    is_delete: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: "是否删除",
    },
    is_revoke: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: "是否撤回",
    },
    revoke_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "群组id",
    }
});

ChatInfo.belongsTo(User, { foreignKey: 'from_id', as: 'sender' });
ChatInfo.belongsTo(User, { foreignKey: 'to_id', as: 'receiver' });

module.exports = ChatInfo;
