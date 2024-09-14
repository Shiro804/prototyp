import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the MaterialBatch model
interface MaterialBatchAttributes {
  id: number;
  materialId: number;
  batchNumber: string;
  quantity: number;
  locationId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new MaterialBatch
interface MaterialBatchCreationAttributes
  extends Optional<MaterialBatchAttributes, "id" | "createdAt" | "updatedAt"> {}

// Define the MaterialBatch model class
class MaterialBatch
  extends Model<MaterialBatchAttributes, MaterialBatchCreationAttributes>
  implements MaterialBatchAttributes
{
  public id!: number;
  public materialId!: number;
  public batchNumber!: string;
  public quantity!: number;
  public locationId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    MaterialBatch.belongsTo(models.Material, {
      foreignKey: "materialId",
      as: "materials",
    });
    MaterialBatch.belongsTo(models.Hall, {
      foreignKey: "locationId",
      as: "hall",
    });
  }
}

// Initialize and define the MaterialBatch model
export default (sequelize: Sequelize): typeof MaterialBatch => {
  MaterialBatch.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Material",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      batchNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
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
      tableName: "MaterialBatch",
      timestamps: true,
    }
  );

  return MaterialBatch;
};
