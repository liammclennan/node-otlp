import express from 'express';
import opentelemetry from '@opentelemetry/api';

const PORT = parseInt(process.env.PORT || '8080');
const app = express();

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.use(express.json());

app.get('/rolldice', (req, res) => {
  const tracer = opentelemetry.trace.getTracer(
    'instrumentation-scope-name',
    'instrumentation-scope-version',
  );

  

  tracer.startActiveSpan(
    'roll the dice ' + PORT, 
    { kind: 1 }, // server
    async (span) => {
      const nextPort = PORT === 8096 ? 8081 : PORT + 1;

      // recursive call here to a different port
      const p = Math.random() < 0 
        ? fetch(`http://localhost:${nextPort}/rolldice`) 
        : Promise.resolve(0);

      setTimeout(() => {
        p.catch(function (err) {
          console.log("Unable to fetch -", err);
        }).finally(() => {
          span.end();
          res.send(getRandomNumber(1, 6).toString());
        });
      }, Math.random() * 2000);
  });

});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});