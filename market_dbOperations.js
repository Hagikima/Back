const executeQuery = require('./dbUtils');



//---------------------------------------------main market dbop---------------------------------------
// Create a new mmarket
async function createMainMarket(mmarket) {
  const query = `INSERT INTO Main_markets
                 (idm_market, mmarket_name)
                 VALUES
                 (:idm_market, :mmarket_name)`;

  const binds = {
    idm_market: mmarket.idm_market,
    mmarket_name: mmarket.mmarket_name
  };

  try {
    const result = await executeQuery(query, binds);
    console.log('P market created successfully');
    return result;
  } catch (error) {
    console.error('Error creating Main market:', error);
    throw error;
  }
}

async function getMainMarketById(idm_market) {
    const query = 'SELECT mmarket_name FROM Main_markets WHERE idm_market = :idm_market';
    const binds = [idm_market];
  
    try {
      const result = await executeQuery(query, binds);
      if (result.rows.length === 0) {
        throw new Error('Main market not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error retrieving main market:', error);
      throw new Error('Error retrieving main market');
    }
  }
  
    //get all Branch markets  
  async function getBranchMarkets() {
    const query = 'SELECT * FROM branch_markets ';
    
  
    try {
      const result = await executeQuery(query);
      if (result.rows.length === 0) {
        throw new Error('Branch market not found');
      }
      return result.rows;
    } catch (error) {
      console.error('Error retrieving branch market:', error);
      throw new Error('Error retrieving branch market');
    }
  }

    //get all Branch markets  
    async function getMainMarkets() {
        const query = 'SELECT * FROM Main_markets ';
        
      
        try {
          const result = await executeQuery(query);
          if (result.rows.length === 0) {
            throw new Error('Main markets not found');
          }
          return result.rows;
        } catch (error) {
          console.error('Error retrieving main market:', error);
          throw new Error('Error retrieving main market');
        }
      }

// Update a main market
async function updateMainMarket(mmarket) {
  const query = `UPDATE Main_markets SET
                 mmarket_name = :mmarket_name,
                 idm_market = :idm_market`;

  const binds = {
    idm_market: mmarket.idm_market,
    mmarket_name: mmarket.mmarket_name
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

// Delete a main market
async function deleteMainMarket(idm_market) {
  const query = 'DELETE FROM Main_markets WHERE idm_market = :idm_market';
  const binds = [idm_market];

  try {
    const result = await executeQuery(query, binds);
    console.log('Main market deleted successfully');
    return result;
  } catch (error) {
    console.error('Error deleting Main market:', error);
    throw error;
  }
}

//---------------------------------------------main market dbop---------------------------------------

// Create a new mmarket
async function createBranchMarket(bmarket) {
    const query = `INSERT INTO branch_markets
                   (idb_market, bmarket_name, idm_market_b)
                   VALUES
                   (:idb_market, :bmarket_name, :idm_market_b)`;
  
    const binds = {
      idb_market: bmarket.idb_market,
      bmarket_name: bmarket.bmarket_name,
      idm_market_b: bmarket.idm_market_b
    };
  
    try {
      const result = await executeQuery(query, binds);
      console.log('Sub market created successfully');
      return result;
    } catch (error) {
      console.error('Error creating Sub market:', error);
      throw error;
    }
  }
  
  async function getBranchMarketById(idb_market) {
      const query = 'SELECT bmarket_name FROM branch_markets WHERE idb_market = :idb_market';
      const binds = [idb_market];
    
      try {
        const result = await executeQuery(query, binds);
        if (result.rows.length === 0) {
          throw new Error('Branch market not found');
        }
        return result.rows[0];
      } catch (error) {
        console.error('Error retrieving branch market:', error);
        throw new Error('Error retrieving branch market');
      }
    }

  //get all Branch markets  
  async function getBranchMarkets() {
    const query = 'SELECT * FROM branch_markets ';
    
  
    try {
      const result = await executeQuery(query);
      if (result.rows.length === 0) {
        throw new Error('Branch market not found');
      }
      return result.rows;
    } catch (error) {
      console.error('Error retrieving branch market:', error);
      throw new Error('Error retrieving branch market');
    }
  }
    
  // Update a main market
  async function updateBranchMarket(bmarket) {
    const query = `UPDATE branch_markets SET
                   bmarket_name = :bmarket_name,
                   idb_mrket = :idb_market,
                   idm_market_b = :idm_market_b`;
  
    const binds = {
      idb_market: bmarket.idb_market,
      bmarket_name: bmarket.bmarket_name,
      idm_market_b: bmarket.bmarket_name
    };
  
    try {
      const result = await executeQuery(query, binds);
      console.log('Branch market updated successfully');
      return result;
    } catch (error) {
      console.error('Error updating branch market:', error);
      throw error;
    }
  }
  
  // Delete a main market
  async function deleteBranchMarket(idb_market) {
    const query = 'DELETE FROM branch_markets WHERE idb_market = :idb_market';
    const binds = [idb_market];
  
    try {
      const result = await executeQuery(query, binds);
      console.log('Branch market deleted successfully');
      return result;
    } catch (error) {
      console.error('Error deleting Branch market:', error);
      throw error;
    }
  }






module.exports = {
  createMainMarket,
  createBranchMarket,
  getMainMarketById,
  getBranchMarketById,
  updateMainMarket,
  updateBranchMarket,
  deleteMainMarket,
  deleteBranchMarket,
  getBranchMarkets,
  getMainMarkets
};
