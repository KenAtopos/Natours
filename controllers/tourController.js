const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours, //es6 feature, equal to tours: tours
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  if (!tour)
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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
};

exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });

  res.status(200).json({
    status: "success",
    data: {
      tour: "updated tour here...",
    },
  });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });

  res.status(204).json({
    status: "success",
    data: null,
  });
};