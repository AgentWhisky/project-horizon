import express from 'express';

const app = express();

app.use(express.static('./dist/client'));

app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: 'dist/client' });
});

app.listen(process.env.PORT || 8080);
