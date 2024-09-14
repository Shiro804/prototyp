import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the ProductionOrder model
interface ProductionOrderAttributes {
  id: number;
  orderNumber: string;
  materialId: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new ProductionOrder
interface ProductionOrderCreationAttributes
  extends Optional<
    ProductionOrderAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

// Define the ProductionOrder model class
class ProductionOrder
  extends Model<ProductionOrderAttributes, ProductionOrderCreationAttributes>
  implements ProductionOrderAttributes
{
  public id!: number;
  public orderNumber!: string;
  public materialId!: number;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    // ProductionOrder belongs to a Material
    ProductionOrder.belongsTo(models.Material, {
      foreignKey: "materialId",
      as: "material",
    });
  }
}

// Initialize and define the ProductionOrder model
export default (sequelize: Sequelize): typeof ProductionOrder => {
  ProductionOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Material",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      quantity: {
        type: DataTypes.INTEGER,
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
      tableName: "ProductionOrder",
      timestamps: true,
    }
  );

  return ProductionOrder;
};
