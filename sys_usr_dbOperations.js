const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const executeQuery = require('./dbUtils');
const bill_dbOperations = require('./bill_dbOperations');



// Create a new system user
async function createSystemUser(systemUser) {
  const query = `INSERT INTO system_users
                 (sysusr_id, first_name, last_name, email, login_id, passphrase, work_num, usr_role)
                 VALUES
                 (:sysusr_id, :first_name, :last_name, :email, :login_id, :passphrase, :work_num, :usr_role)`;
  
  const binds = {
    sysusr_id: systemUser.sysusr_id,
    first_name: systemUser.first_name,
    last_name: systemUser.last_name,
    email: systemUser.email,
    login_id: systemUser.login_id,
    passphrase: systemUser.passphrase,
    work_num: systemUser.work_num,
    usr_role: systemUser.usr_role
  };
  
  try {
    const result = await executeQuery(query, binds);
    console.log('System user created successfully');
    return result;
  } catch (error) {
    console.error('Error creating system user:', error);
    throw error;
  }
}

// Read a system user by ID
async function getSystemUserById(sysusr_id) {
  const query = 'SELECT * FROM system_users WHERE sysusr_id = :sysusr_id';
  const binds = [sysusr_id];
  
  try {
    const result = await executeQuery(query, binds);
    if (result.rows.length === 0) {
      console.log('System user not found');
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error retrieving system user:', error);
    throw error;
  }
}

// Update a system user
async function updateSystemUser(systemUser) {
  const query = `UPDATE system_users SET
                 first_name = :first_name,
                 last_name = :last_name,
                 email = :email,
                 login_id = :login_id,
                 passphrase = :passphrase,
                 work_num = :work_num,
                 usr_role = :usr_role
                 WHERE sysusr_id = :sysusr_id`;

  const binds = {
    sysusr_id: systemUser.sysusr_id,
    first_name: systemUser.first_name,
    last_name: systemUser.last_name,
    email: systemUser.email,
    login_id: systemUser.login_id,
    passphrase: systemUser.passphrase,
    work_num: systemUser.work_num,
    usr_role: systemUser.usr_role
  };
  
  try {
    const result = await executeQuery(query, binds);
    console.log('System user updated successfully');
    return result;
  } catch (error) {
    console.error('Error updating system user:', error);
    throw error;
  }
}

// Delete a system user
async function deleteSystemUser(sysusr_id) {
  const query = 'DELETE FROM system_users WHERE sysusr_id = :sysusr_id';
  const binds = [sysusr_id];
  
  try {
    const result = await executeQuery(query, binds);
    console.log('System user deleted successfully');
    return result;
  } catch (error) {
    console.error('Error deleting system user:', error);
    throw error;
  }
}

// Get all system users by a specific name (first name or last name)
async function getSystemUsersByName(name) {
    const query = `SELECT sysusr_id, first_name, last_name FROM system_users
                   WHERE first_name = :name OR last_name = :name OR login_id = :name`;
    const binds = [name, name, name]; // Provide the name twice as an array
  
    try {
      const result = await executeQuery(query, binds);
      if (result.rows.length === 0) {
        console.log('No system users found with the specified name');
        return null;
      }
      return result.rows;
    } catch (error) {
      console.error('Error retrieving system users:', error);
      throw error;
    }
  }

//Getting current system user information(all)
// Getting current system user information (all)
async function getActiveUserInfo(loginId, sessionUser) {
  const query = `SELECT * FROM system_users WHERE login_id = :loginId`;
  const binds = [loginId]; // Provide the loginId as a single element array

  try {
    const result = await executeQuery(query, binds);
    if (result.rows.length === 0) {
      console.log('No active session');
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error retrieving current users:', error);
    throw error;
  }
}

module.exports = {
  createSystemUser,
  getSystemUserById,
  updateSystemUser,
  deleteSystemUser,
  getSystemUsersByName,
  getActiveUserInfo
};
