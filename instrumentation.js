const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations, } = require('@opentelemetry/auto-instrumentations-node');

// gRPC - not supported by Seq without HTTP2/TLS
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');

// HTTP/JSON not supported by Seq
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');


const opentelemetry = require('@opentelemetry/api');
const { Resource } = require('@opentelemetry/resources');
const {
    SemanticResourceAttributes,
  } = require('@opentelemetry/semantic-conventions');

const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
        // optional - default url is http://localhost:4318/v1/traces
        // using gRPC to OTEL collector
        // optional - collection of custom headers to be sent with each request, empty by default
        headers: {},
      }),
 
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();