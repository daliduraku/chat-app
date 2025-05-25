import express from 'express';
import path from 'path';


const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});