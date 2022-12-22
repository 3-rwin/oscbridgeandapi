const buttonRoutes = (app, fs) => {
    // variables
    const dataPath = './data/buttons.json';

  // Helper methods
  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = 'utf8'
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }
      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = 'utf8'
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }
      callback();
    });
  };

  const insertAndShift = (arr, from, to) => {
    // Update location in array
    let cutOut = arr.splice(from, 1)[0]; // cut the element at index 'from'
    arr.splice(to, 0, cutOut);           // insert it at index 'to'

    // Update button.id's
    for (let i = 0; i < arr.length; i++) {
      arr[i].id = Number(i)+1;
    }
    return arr;
  }

  // READ
  app.get('/buttons', (req, res) => {
    readFile((data) => {
      res.send(data.buttons);
    }, true);
  });

  // READ single item
  app.get('/buttons/:id', (req, res) => {
    const { id } = req.params;
    readFile((data) => {
      res.send(
        data.buttons.filter(button => { return button.id == id})
      );
    }, true);
  });

  // CREATE
  app.post('/buttons', (req, res) => {
    readFile((data) => {
      // Add the new button to the existing buttons
      data.buttons.push(req.body);

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(req.body);
      });
    }, true);
  });

  app.put('/buttons/up/:id', (req, res) => {
    readFile((data) => {
      const { id } = req.params;
      if (id > 1 ) {
        data.buttons = insertAndShift(data.buttons, id-1, id-2);
        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send(data);
        });
      }
    }, true); 
  });

  app.put('/buttons/down/:id', (req, res) => {
    readFile((data) => {
      const { id } = req.params;
      if (id < data.buttons.length ) {
        data.buttons = insertAndShift(data.buttons, id-1, id);
        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send(data);
        });
      }
    }, true); 
  });

  // DELETE
  app.delete('/buttons/:id', (req, res) => {
    const { id } = req.params;
    readFile((data) => {
      data = data.buttons.filter(button => { return button.id != id})
      data = {
        "buttons": data
      }
  
      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(data);
      });
    }, true);
  });
};

module.exports = buttonRoutes;