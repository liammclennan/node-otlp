import express from 'express';
import opentelemetry, { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const PORT = parseInt(process.env.PORT || '8080');
const app = express();

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.get('/rolldice', (req, res) => {
  const tracer = opentelemetry.trace.getTracer(
    'instrumentation-scope-name',
    'instrumentation-scope-version',
  );

  tracer.startActiveSpan(
    'roll the dice', 
    { attributes: { attribute1: 'value1' } }, 
    async (span) => {
    setTimeout(() => {
      res.send(getRandomNumber(1, 6).toString());
      span.end();
    }, Math.random() * 10000);
  });


});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});