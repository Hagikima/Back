const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');

async function executeQuery(query, binds = [], options = {}) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(query, binds, options);
    await connection.execute("COMMIT"); // Commit the transaction
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

module.exports = executeQuery;
