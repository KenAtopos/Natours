const fs = require("fs");
const express = require("express");
const PORT = 3000;

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours, //es6 feature, equal to tours: tours
    },
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  //   console.log(req.params);
  const id = req.params.id * 1;
  if (!tour)
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });

  const tour = tours.find((element) => element.id === id);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  //   console.log(req.body);

  const newID = tours.at(-1).id + 1;
  const newTour = Object.assign(
    {
      id: newID,
    },
    req.body
  );

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
});
