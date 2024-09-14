import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the TransportSystem model
interface TransportSystemAttributes {
  id: number;
  transportMethod: "Manual" | "Rollwagen" | "Automated";
  materialId?: number;
  startLocationId: number;
  endLocationId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new TransportSystem
interface TransportSystemCreationAttributes
  extends Optional<
    TransportSystemAttributes,
    "id" | "materialId" | "createdAt" | "updatedAt"
  > {}

// Define the TransportSystem model class
class TransportSystem
  extends Model<TransportSystemAttributes, TransportSystemCreationAttributes>
  implements TransportSystemAttributes
{
  public id!: number;
  public transportMethod!: "Manual" | "Rollwagen" | "Automated";
  public materialId?: number;
  public startLocationId!: number;
  public endLocationId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    // TransportSystem has many Materials
    TransportSystem.hasMany(models.Material, {
      foreignKey: "transportSystemId",
      as: "materials",
    });

    // TransportSystem belongs to a start Hall (start location)
    TransportSystem.belongsTo(models.Hall, {
      foreignKey: "startLocationId",
      as: "startLocation",
    });

    // TransportSystem belongs to an end Hall (end location)
    TransportSystem.belongsTo(models.Hall, {
      foreignKey: "endLocationId",
      as: "endLocation",
    });
  }
}

// Initialize and define the TransportSystem model
export default (sequelize: Sequelize): typeof TransportSystem => {
  TransportSystem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      transportMethod: {
        type: DataTypes.ENUM("Manual", "Rollwagen", "Automated"),
        allowNull: false,
      },
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional since TransportSystems don't always need materials to function
        references: {
          model: "Material",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      startLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Hall",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      endLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Hall",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      tableName: "TransportSystem",
      timestamps: true,
    }
  );

  return TransportSystem;
};
