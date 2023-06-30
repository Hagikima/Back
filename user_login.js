const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const executeQuery = require('./dbUtils');


async function authentication(system_user) {
    const query = `SELECT usr_role FROM system_users WHERE login_id = :login_id AND passphrase = :passphrase`;
  
    const binds = {
      login_id: system_user.login_id,
      passphrase: system_user.passphrase
    };
  
    try {
      const result = await executeQuery(query, binds);
  
      if (result.rows.length === 1) {
        const usr_role = result.rows[0][0];
  
        if (usr_role === 1) {
          return 'an admin';
        } else if (usr_role ===  2) {
          return 'a supervisor';
        }else if(usr_role === 3){
            return 'a normal user';
        }
      }
  
      return null; // Invalid login_id or passphrase
    } catch (error) {
      console.error('Error executing authentication query:', error);
      throw error;
    }
  }
  

  function isAdmin(req, res, next){
    if (req.session.privileges === 1 || value ===2){
        next();
    }else {
        res.status(403).Send('Access denied');
    }
  }


  module.exports = {
    authentication,
    isAdmin
  };