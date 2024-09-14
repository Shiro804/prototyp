import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Interface for the attributes of the Hall model
interface HallAttributes {
  id: number;
  name: string;
  description?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Optional attributes for Hall when creating a new record (because 'id', 'createdAt', and 'updatedAt' are automatically generated)
interface HallCreationAttributes
  extends Optional<HallAttributes, "id" | "createdAt" | "updatedAt"> {}

// The actual Hall model
class Hall
  extends Model<HallAttributes, HallCreationAttributes>
  implements HallAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public location?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Define associations
  public static associate(models: any) {
    Hall.hasMany(models.Workstation, {
      foreignKey: "locationId",
      as: "workstations",
    });
    Hall.hasMany(models.Machine, {
      foreignKey: "locationId",
      as: "machines",
    });
    Hall.hasMany(models.Material, {
      foreignKey: "locationId",
      as: "materials",
    });
  }
}

// Export the function to define the model
export default (sequelize: Sequelize): typeof Hall => {
  Hall.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: "Hall",
      timestamps: true, // Enable Sequelize to handle createdAt and updatedAt
    }
  );

  return Hall;
};
