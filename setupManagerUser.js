const bcrypt = require("bcrypt");
const usersDb = require("./models/user");

function setupManagerUser(logger) {
  const managerUsername = "manager";

  usersDb.findUserByUsername(managerUsername, (err, user) => {
    if (err) {
      logger.error("Error checking for manager user:", err);
      return;
    }

    if (user) {
      logger.info("Manager user already exists. Skipping creation.");
    } else {
      const managerUser = {
        username: managerUsername,
        password: bcrypt.hashSync("managerpassword", 10),
        email: "manager@example.com",
        role: "manager",
      };

      usersDb.addUser(managerUser, (err, newDoc) => {
        if (err) {
          logger.error("Error adding manager user:", err);
        } else {
          logger.info("Manager user added:", newDoc);
        }
      });
    }
  });
}

module.exports = setupManagerUser;
