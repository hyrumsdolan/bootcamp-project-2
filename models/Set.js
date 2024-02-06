const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Set extends Model {}

Set.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        reps: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        workout_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "workout",
                key: "id",
            },
        },
        user_id: { // Corrected placement
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
        }
    }, // Removed extra comma
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: "set",
    }
);

module.exports = Set;
