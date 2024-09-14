import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the User model
interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: string;
  status: "Active" | "Inactive";
  workstationId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new User
interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "workstationId" | "createdAt" | "updatedAt"
  > {}

// Define the User model class
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: string;
  public status!: "Active" | "Inactive";
  public workstationId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    // A User belongs to a Workstation
    User.belongsTo(models.Workstation, {
      foreignKey: "workstationId",
      as: "workstation",
    });

    // A User can be associated with multiple Machines
    User.hasMany(models.Machine, { foreignKey: "userId", as: "machines" });
  }
}

// Initialize and define the User model
export default (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
        allowNull: false,
      },
      workstationId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional, or change to false if mandatory
        references: {
          model: "Workstation",
          key: "id",
        },
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
      tableName: "User",
      timestamps: true, // Enable automatic management of createdAt and updatedAt
    }
  );

  return User;
};
