const express = require('express');
const sysUsrDbOperations = require('./sys_usr_dbOperations');
const billDbOperations = require('./bill_dbOperations');
const path = require('path');
const session = require('express-session');
const user_login = require('./user_login');
const oracledb = require('oracledb');
const cors = require('cors');
const marketDbOperations = require('./market_dbOperations');


const app = express();
app.use(cors());
app.use(express.json());



app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


//test function 
app.get('/testy', async(req, res)=>{
  console.log("test function");
  res.sendFile("C:\\Users\\maguir\\Documents\\WebAppSimControl_ISPM\\facture.pdf");
  //res.json({message: "hello there"});
})

//-------------------------------------------application users route handler-------------------------------------------


// Create a new system user
app.post('/system-users', async (req, res) => {
  try {
    const systemUser = req.body;
    const result = await sysUsrDbOperations.createSystemUser(systemUser);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error creating system user' });
  }
});

// Read a system user by ID
app.get('/system-users/:sysusr_id', async (req, res) => {
  try {
    const sysusr_id = req.params.sysusr_id;
    const systemUser = await sysUsrDbOperations.getSystemUserById(sysusr_id);
    if (systemUser) {
      res.json(systemUser);
    } else {
      res.status(404).json({ error: 'System user not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving system user' });
  }
});

// Update a system user
app.put('/system-users/:sysusr_id', async (req, res) => {
  try {
    const sysusr_id = req.params.sysusr_id;
    const systemUser = req.body;
    systemUser.sysusr_id = sysusr_id;
    const result = await sysUsrDbOperations.updateSystemUser(systemUser);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error updating system user' });
  }
});

// Delete a system user
app.delete('/system-users/:sysusr_id', async (req, res) => {
  try {
    const sysusr_id = req.params.sysusr_id;
    const result = await sysUsrDbOperations.deleteSystemUser(sysusr_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting system user' });
  }
});

// Get all system users by name
app.get('/system-usersn/:name', async (req, res) => {
  try {
    const name = req.params.name; // Use params instead of query
    const systemUsers = await sysUsrDbOperations.getSystemUsersByName(name);
    if (systemUsers) {
      res.json(systemUsers);
    } else {
      res.status(404).json({ error: 'No system users found with the specified name' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving system users' });
  }
});

//Get current active user informations test:
app.get('/activeusertest/:name', async(req, res) => {
  try {
    const name = req.params.name; // Use params instead of query
    const systemUsers = await sysUsrDbOperations.getActiveUserInfo(name);
    if (systemUsers) {
      res.json(systemUsers);
    } else {
      res.status(404).json({ error: 'No system users found with the specified name' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving system users' });
  }
});

// Get current active user information
app.get('/activeuser', async (req, res) => {
  console.log('req.session.user:', req.session.user);
  try {
    const loginId = req.session.user.login_id;
    const systemUsers = await sysUsrDbOperations.getActiveUserInfo(loginId);
    if (systemUsers) {
      console.log(systemUsers);
      res.json(systemUsers);
    } else {
      res.status(404).json({ error: 'No active user' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving system users' });
  }
});

//-------------------------------------------Login handler-------------------------------------------
//login
app.post('/login', async (req, res) => {
  const { login_id, passphrase } = req.body;

  const system_user = {
    login_id: login_id,
    passphrase: passphrase
  };


  console.log('login');
  try {
    const userRole = await user_login.authentication(system_user);

    if (userRole) {
      req.session.user = {
        login_id: login_id,
        privileges: userRole
      };
    console.log('req.session.user:', req.session.user);

      res.status(200).send('Login successful!');
    } else {
      res.status(401).send('Invalid login ID or passphrase');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
});

//logout
app.get('/logout', async (req, res) => {
  console.log('logout');
  try {
    // Check if the user is authenticated
    if (!req.session.user) {
      return res.status(401).send('You are not logged in');
    }

    // Perform the logout logic
    req.session.destroy((err) => {
      if (err) {
        console.error('Error while destroying session:', err);
        return res.status(500).send('Error occurred during logout');
      }

      // Clear the session cookie
      res.clearCookie('session');
      res.status(200).send('Logout successful');
    });
  } catch (error) {
    console.error('Error occurred during logout:', error);
    res.status(500).send('Error occurred during logout');
  }
});


//-------------------------------------------Billing routes Handler-------------------------------------------
// Create a new bill
app.post('/bill', async (req, res) => {
  try {
    const newBill = req.body;
    const result = await billDbOperations.createBill(newBill);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error creating bill' });
  }
});

// Read a bill by ID
app.get('/bill/:billId', async (req, res) => {
  try {
    const billId = req.params.billId;
    const bill = await billDbOperations.getBillById(billId);
    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ error: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving bill' });
  }
});

// Update a bill
app.put('/bill/:billId', async (req, res) => {
  try {
    const billId = req.params.billId;
    const updatedBill = req.body;
    updatedBill.bill_id = billId;
    const result = await billDbOperations.updateBill(updatedBill);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error updating bill' });
  }
});

// Delete a bill
app.delete('/bill/:billId', async (req, res) => {
  try {
    const billId = req.params.billId;
    const result = await billDbOperations.deleteBill(billId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting bill' });
  }
});

// Get all bills by name or code
app.get('/bills/search/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const bills = await billDbOperations.getBillsByNameOrCode(searchTerm);
    if (bills) {
      res.json(bills);
    } else {
      res.status(404).json({ error: 'No bills found with the specified name or code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving bills' });
  }
});

//Get bill names by handler
app.get('/handled/:usrId', async(req, res) =>{
  try {
    const usrId = req.params.usrId;
    const bills = await billDbOperations.getBillHandled(usrId);
    console.log('hello');
    console.log(bills)
    if (bills) {
      res.json(bills);
    } else {
      res.status(404).json({ error: 'No bills found with the specified name or code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving bills' });
  }
});


// Get bill data by id
app.get('/bill_data/:billId', async (req, res) => {
  try {
    const billId = req.params.billId;
    const bill = await billDbOperations.getBillDataById(billId);
    if (bill) {
      //const filePath = path.resolve(bill.bill_data);
      const filePath = path.resolve(bill[0]);
      console.log('File path:', filePath);// Add this line for debugging
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(filePath);

    } else {
      res.status(404).json({ error: 'Bill data not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving bill data' });
  }
});
//-------------------------------------------Main market route handler-------------------------------------------
app.post('/mm', async (req, res) => {
  try {
    const newmm = req.body;
    const result = await marketDbOperations.createMainMarket(newmm);
    res.json(result);
  } catch (error) {
    res.status(500).json({error: 'error creating new market'});
  }
})

app.get('/mm/:idm_market', async (req, res) => {
  try {
    const idb_market = req.params.idb_market;
    const bmarket = await marketDbOperations.getMainMarketById(idb_market);
    if(bmarket){
      res.json(bmarket);
    } else{
      res.status(404).json({error:'main market non existant'});
    }
  } catch (error) {
    res.status(500).json({error: 'Error retrieving main market'});
  }
});

//all main markets:
app.get('/mm', async(req, res) => {
  try {
    const mmarkets = await marketDbOperations.getMainMarkets();
    console.log('Main markets:', mmarkets);
    if(mmarkets){
      res.json(mmarkets);
    }else{
      res.status(404).json({error:`No main markets found`});
    }
  } catch (error) {
    res.status(500).json({error: `Error retrieving main Markets`});
  }
})

//-------------------------------------------Branch market route handler-------------------------------------------
app.post('/bm', async (req, res) => {
  try {
    const newmm = req.body;
    const result = await marketDbOperations.createBranchMarket(newmm);
    res.json(result);
  } catch (error) {
    res.status(500).json({error: 'error creating new markeet'});
  }
})

app.get('/bm/:idb_market', async (req, res) => {
  try {
    const idb_market = req.params.idb_market;
    const bmarket = await marketDbOperations.getBranchMarketById(idb_market);
    if(bmarket){
      res.json(bmarket);
    } else{
      res.status(404).json({error:'Branch market non existant'});
    }
  } catch (error) {
    res.status(500).json({error: 'Error retrieving Branch market'});
  }
});

//get all branch markets
app.get('/bm', async(req, res) => {
  try {
    const bmarkets = await marketDbOperations.getBranchMarkets();
    console.log('bmarkets:', bmarkets);
    if(bmarkets){
      res.json(bmarkets);
    }else{
      res.status(404).json({error:`No branch markets found`});
    }
  } catch (error) {
    res.status(500).json({error: `Error retrieving Branch Markets`});
  }
})

//-------------------------------------------Listen here-------------------------------------------

//listening to port
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


//---------------connecting to db and then disconnecting
// i do realise this does nothing but if i remove it the entire project stops working sooo



async function checkConnection() {
  try {
    // Connection configuration
    const connectionConfig = {
      user: 'hr',
      password: '123',
      connectString: 'localhost:1521'
    };

    // Establish a connection
    const connection = await oracledb.getConnection(connectionConfig);

    if (connection) {
      console.log('Connection to Oracle Database established successfully');
      // Perform additional database operations if needed
      // ...

      // Release the connection
      await connection.close();
      console.log('Connection closed');
    }
  } catch (error) {
    console.error('Error connecting to Oracle Database:', error);
  }
}

// Call the function to check the connection
checkConnection();
