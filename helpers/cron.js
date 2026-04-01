const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Running a task Every day 4:00AM To clear uploads folders
//MIN HOUR DOM MON DOW
cron.schedule('48 11 * * *', async () => {
    console.log("started");
  const directory = 'uploads';
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
  console.log('Task running everyday 4:00AM To clear uploads folders');
});