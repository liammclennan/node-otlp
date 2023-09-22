import opentelemetry from '@opentelemetry/api';
import { exec } from 'child_process';

const tracer = opentelemetry.trace.getTracer(
    'instrumentation-scope-name',
    'instrumentation-scope-version',
);

const serviceNames = [
    // 'Aurora',    
    // 'Avalanche',
    // 'Blizzard',
    // 'Cyclone',
    // 'Dewdrop',
    // 'Downpour',
    // 'Duststorm',
    // 'Fogbank',
    // 'Freeze',    
    // 'Frost',
    // 'Gully Washer',
    // 'Gust',
    // 'Hurricane',
    // 'Ice Storm',
    // 'Jet Stream',
    'Lightning',
];



serviceNames.forEach((serviceName, ix) => {
    const port = 8081 + ix;

    tracer.startActiveSpan(
        'host request to child process', 
        { 
            attributes: { 
                port,
                childServiceName: serviceName 
            },
            kind: 2,
        }, 
        async (span) => {
            exec(
                `env PORT="${port}" OTEL_SERVICE_NAME="${serviceName}" node -r ./instrumentation.js app.mjs`, 
                (error, stdout, stderr) => {
            
              if (error) {
                console.error(`error: ${error.message}`);
                return;
              }
            
              if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
              }
            
              console.log(`stdout:\n${stdout}`);
        
            });
        
            setTimeout(() => {
                fetch(`http://localhost:${port}/rolldice`)
                .then((response) => {
                    console.log(serviceName, port, response);
                    span.end();
                })
                .catch(function (err) {
                    console.log("Unable to fetch -", err);
                    span.end();
                });
            }, 1000);
            
      });

});




