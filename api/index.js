require("dotenv").config()
const express = require("express")
const ratingAPI = require('ups-shipping/lib/rating');
const fs = require('fs');

const rating = new ratingAPI(process.env.ACCESSKEY, process.env.USERID, process.env.PASSWORD);

rating.setJsonResponse(true);



const app = express();

app.listen(5500, () => {
  console.log("Server started on port 5500");
});

app.get('/', (req, res) => {
  
  rating.makeRequest({
    customerContext: "Rating and Service",
    pickUpType: {
      code: "07",
      description: "Rate"
    },
    shipment: {
      description: "",
      name: "",
      phoneNumber: "",
      shipperNumber: "",
      shipper: {
        address: {
          addressLine: "Address Line",
          city: "City",
          StateProvinceCode: "NJ",
          PostalCode: "07430",
          countryCode: "US"
        }
      },
      shipTo: {
        companyName: "",
        phoneNumber: "",
        address: {
          addressLine: "",
          city: "",
          postalCode: req.query.to,
          countryCode: "US"
        }
      },
      shipFrom: {
        companyName: "",
        attentionName: "",
        phoneNumber: "",
        faxNumber: "",
        address: {
          addressLine: "",
          city: "",
          stateProvinceCode: "",
          postalCode: req.query.from,
          countryCode: "US"
        }
      },
      service: {
        code: "03"
      },
      paymentInformation: {
        accountNumber: "Ship Number"
      },
      package: [
        {
          code: "02",
          weight: req.query.weight
        },
      ],
      schedule: {
        pickUpDay: "02",
        method: "02"
      }
    }
  }, function (data) {
    const rating = data.RatingServiceSelectionResponse.RatedShipment;
    fs.writeFile('res.json', rating, 'utf8', ()=>console.log('Written to JSON'));
    res.send(rating)
  });
  
})




