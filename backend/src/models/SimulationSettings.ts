import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the SimulationSetting model
interface SimulationSettingAttributes {
  id: number;
  settingName: string;
  settingValue: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new SimulationSetting
interface SimulationSettingCreationAttributes
  extends Optional<
    SimulationSettingAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

// Define the SimulationSetting model class
class SimulationSetting
  extends Model<
    SimulationSettingAttributes,
    SimulationSettingCreationAttributes
  >
  implements SimulationSettingAttributes
{
  public id!: number;
  public settingName!: string;
  public settingValue!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize and define the SimulationSetting model
export default (sequelize: Sequelize): typeof SimulationSetting => {
  SimulationSetting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      settingName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      settingValue: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "SimulationSetting",
      timestamps: true, // Automatically manage createdAt and updatedAt
    }
  );

  return SimulationSetting;
};
