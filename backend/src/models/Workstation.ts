import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the Workstation model
interface WorkstationAttributes {
  id: number;
  name: string;
  locationId: number;
  status: "Active" | "Inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new Workstation
interface WorkstationCreationAttributes
  extends Optional<WorkstationAttributes, "id" | "createdAt" | "updatedAt"> {}

// Define the Workstation model class
class Workstation
  extends Model<WorkstationAttributes, WorkstationCreationAttributes>
  implements WorkstationAttributes
{
  public id!: number;
  public name!: string;
  public locationId!: number;
  public status!: "Active" | "Inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    // Workstation belongs to a Hall (location)
    Workstation.belongsTo(models.Hall, {
      foreignKey: "locationId",
      as: "hall",
    });

    // Workstation has many Users
    Workstation.hasMany(models.User, {
      foreignKey: "workstationId",
      as: "users",
    });
  }
}

// Initialize and define the Workstation model
export default (sequelize: Sequelize): typeof Workstation => {
  Workstation.init(
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
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Hall",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
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
      tableName: "Workstation",
      timestamps: true,
    }
  );

  return Workstation;
};
