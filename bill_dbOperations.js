const executeQuery = require('./dbUtils');

// Create a new bill
async function createBill(bill) {
  const query = `INSERT INTO bills
                 (bill_id, bill_name, des, bill_data, bill_code, bill_status)
                 VALUES
                 (:bill_id, :bill_name, :des, :bill_data, :bill_code, :bill_status)`;

  const binds = {
    bill_id: bill.bill_id,
    bill_name: bill.bill_name,
    des: bill.des,
    bill_data: bill.bill_data,
    bill_code: bill.bill_code,
    bill_status: bill.bill_status
  };

  try {
    const result = await executeQuery(query, binds);
    console.log('Bill created successfully');
    return result;
  } catch (error) {
    console.error('Error creating bill:', error);
    throw error;
  }
}

// Read a bill by ID
async function getBillById(billId) {
    const query = 'SELECT bill_id, bill_name, bill_data, bill_code, bill_status FROM bills WHERE bill_id = :billId';
    const binds = [billId];
  
    try {
      const result = await executeQuery(query, binds);
      if (result.rows.length === 0) {
        throw new Error('Bill not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error retrieving bill:', error);
      throw new Error('Error retrieving bill');
    }
  }

// Update a bill
async function updateBill(bill) {
  const query = `UPDATE bills SET
                 bill_name = :bill_name,
                 des = :des,
                 bill_data = :bill_data,
                 bill_code = :bill_code,
                 bill_status = :bill_status
                 WHERE bill_id = :bill_id`;

  const binds = {
    bill_id: bill.bill_id,
    bill_name: bill.bill_name,
    des: bill.des,
    bill_data: bill.bill_data,
    bill_code: bill.bill_code,
    bill_status: bill.bill_status
  };

  try {
    const result = await executeQuery(query, binds);
    console.log('Bill updated successfully');
    return result;
  } catch (error) {
    console.error('Error updating bill:', error);
    throw error;
  }
}

// Delete a bill
async function deleteBill(bill_id) {
  const query = 'DELETE FROM bills WHERE bill_id = :bill_id';
  const binds = [bill_id];

  try {
    const result = await executeQuery(query, binds);
    console.log('Bill deleted successfully');
    return result;
  } catch (error) {
    console.error('Error deleting bill:', error);
    throw error;
  }
}

//Get bill data by id
async function getBillDataById(billId) {
    const query = 'SELECT bill_data FROM bills WHERE bill_id = :billId';
    const binds = [billId];
  
    try {
      const result = await executeQuery(query, binds);
      if (result.rows.length === 0) {
        throw new Error('Bill data not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error retrieving bill data:', error);
      throw new Error('Error retrieving bill data');
    }
  }

// Get all bills by a specific name or code
async function getBillsByNameOrCode(searchTerm) {
  const query = `SELECT bill_id, bill_name, des FROM bills
                 WHERE bill_name = :searchTerm OR bill_code = :searchTerm`;
  const binds = [searchTerm, searchTerm]; // Provide the searchTerm twice as an array

  try {
    const result = await executeQuery(query, binds);
    if (result.rows.length === 0) {
      console.log('No bills found with the specified name or code');
      return null;
    }
    return result.rows;
  } catch (error) {
    console.error('Error retrieving bills:', error);
    throw error;
  }
}

async function getBillHandled(usrId) {
  const query = `SELECT bill_id, bill_name FROM bills
                 WHERE bill_handler = :usrId`;
  const binds = [usrId]; // Provide the searchTerm twice as an array

  try {
    const result = await executeQuery(query, binds);
    if (result.rows.length === 0) {
      console.log('No bills found');
      return null;
    }
    return result.rows;
  } catch (error) {
    console.error('Error retrieving bills:', error);
    throw error;
  }  
}

module.exports = {
  createBill,
  getBillById,
  updateBill,
  deleteBill,
  getBillsByNameOrCode,
  getBillDataById,
  getBillHandled
};
