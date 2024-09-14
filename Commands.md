# Start seeding (Inserts Dummy Data)

npx sequelize-cli db:seed:all

# Undo seeding (Deletes Dummy Data)

npx sequelize-cli db:seed:undo:all

# Generate migration files with custom name (here e.g. "seeder"). The file will be created in the corresponding "migrations" folder.

npx sequelize-cli migration:generate --name seeder

# Generate seeding files with custom name (here e.g. "seed-dummy-data"). The file will be created in the corresponding "seeders" folder.

npx sequelize-cli seed:generate --name seed-dummy-data

# Starts DB migration(s)

npx sequelize-cli db:migrate
