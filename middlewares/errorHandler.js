const errorHandler = (err, req, res, _next) => {
  if(err.status) return res.status(err.status).json({ message: err.message });

  if(err.details) return res.status(422).json({ message: err.details[0].message });

  return res.status(500).json({message: 'Internal Error'});
};

module.exports = errorHandler;