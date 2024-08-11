const bcrypt = require("bcrypt");
const usersDb = require("./models/user");

// Function to set up the manager user
function setupManagerUser(logger) {
  const managerUsername = "manager";

  // Check if the manager user already exists
  usersDb.findUserByUsername(managerUsername, (err, user) => {
    if (err) {
      logger.error("Error checking for manager user:", err);
      return;
    }

    if (user) {
      // If the manager user already exists, skip creation
      logger.info("Manager user already exists. Skipping creation.");
    } else {
      // If the manager user doesn't exist, create a new one
      const managerUser = {
        username: managerUsername,
        password: bcrypt.hashSync("managerpassword", 10),
        email: "manager@example.com",
        role: "manager",
      };

      // Add the manager user to the database
      usersDb.addUser(managerUser, (err, newDoc) => {
        if (err) {
          logger.error("Error adding manager user:", err);
        } else {
          // Log the successful addition of the manager user
          logger.info("Manager user added:", newDoc);
        }
      });
    }
  });
}

module.exports = setupManagerUser;
