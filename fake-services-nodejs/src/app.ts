const { v4: uuidv4 } = require('uuid');

////////////////////////////////////
// FAKE PAYMENT SERVICE
////////////////////////////////////
var amqp = require('amqplib/callback_api');

const queuePaymentRequest = 'paymentRequest';
const queuePaymentResponse = 'paymentResponse';

amqp.connect('amqp://3.74.41.198', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queuePaymentRequest, { durable: true });
    channel.assertQueue(queuePaymentResponse, {durable: true });

    channel.consume(queuePaymentRequest, function(inputMessage) {
      var paymentRequestId =  inputMessage.content.toString();
      var paymentConfirmationId = uuidv4();

      console.log("\n\n [x] Received payment request %s", paymentRequestId);

      var outputMessage = '{"paymentRequestId": "' + paymentRequestId + '", "paymentConfirmationId": "' + paymentConfirmationId + '"}';

      channel.sendToQueue(queuePaymentResponse, Buffer.from(outputMessage));
      console.log(" [x] Sent payment response %s", outputMessage);

    }, {
        noAck: true
    });
  });
});
