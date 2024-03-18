const paypal = require('paypal-rest-sdk');

// Configure PayPal SDK with your credentials
paypal.configure({
    'mode': 'sandbox', // Change to 'live' for production
    'client_id': 'AQzzqaM_r6_O3ydty_ddLDmKhw4-7kIkko0v4Ww3zKDSE4_A3wmiE0RWBYPEdxjMx0o_V8CKbprl_YC1',
    'client_secret': 'EDAVCuffsBLwvZMgRFesRHIe4-ZQAxcPmyu2chnaej01eCRVS90uv11KZdJ7ojooet4sU7GT5goA58B4'
});
// Perform a payout to a local bank account
async function performPayoutToLocalBank(amount, currency, recipientName, recipientBankAccount, recipientBankRouting) {
    const payoutItem = {
        "sender_batch_header": {
            "sender_batch_id": "batch_" + Math.random().toString(36).substring(9),
            "email_subject": "You have a payment"
        },
        "items": [
            {
                "recipient_type": "LOCAL_BANK", // Specify recipient type as local bank
                "amount": {
                    "value": amount,
                    "currency": currency
                },
                "note": "Thank you.",
                "receiver": recipientName, // Provide recipient name or identifier
                "receiver_type": "EMAIL",
                "sender_item_id": "item_" + Math.random().toString(36).substring(9),
                "receiver_bank_account": {
                    "recipient_type": "LOCAL_BANK", // Specify recipient type again for receiver_bank_account
                    "bank_account_number": recipientBankAccount, // Bank account number
                    "bank_routing_number": recipientBankRouting, // Bank routing number or other relevant details
                    "name": recipientName
                }
            }
        ]
    };

    try {
        const payout = await new Promise((resolve, reject) => {
            paypal.payout.create(payoutItem, function (error, payout) {
                if (error) {
                    reject(error);
                } else {
                    resolve(payout);
                }
            });
        });

        console.log('Payout performed:', payout);
        return payout;
    } catch (error) {
        console.error('Error performing payout:', error.response);
        throw error;
    }
}

// Example usage
performPayoutToLocalBank('10.00', 'USD', 'Recipient Name', 'Recipient Bank Account Number', 'Recipient Bank Routing Number')
    .then(payout => {
        console.log('Payout performed:', payout);
        // Handle successful payout
    })
    .catch(error => {
        console.error('Error performing payout:', error);
        // Handle error
    });
