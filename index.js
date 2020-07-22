require("dotenv").config()
const express = require("express")
const ratingAPI = require('ups-shipping/lib/rating');
const fs = require('fs');
const path = require("path");
const rating = new ratingAPI(process.env.ACCESSKEY, process.env.USERID, process.env.PASSWORD);

rating.setJsonResponse(true);

const app = express();

app.listen(5500, () => {
  console.log("Server started on port 5500");
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get('/api', (req, res) => {
  
  if (!(req.query.from && req.query.to && req.query.weight)) {
    res.send({
      error: 'Not enough parameters. The required parameters are: from, to, weight'
    })
    return
  }
  
  if (+req.query.weight > 150) {
    res.send({
      error: 'This API doesn\'t support LTL shipping. The weight should be under 150 lbs'
    })
    return
  }
  
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

    res.send(rating)
  });
  
})




