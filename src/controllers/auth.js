// import model here
const { user } = require('../../models');

// import package here
const Joi = require('joi');

exports.register = async (req, res) => {
  // code here
  try {
    const data = req.body;

    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().min(6).email().required(),
      password: Joi.string().min(6).required(),
      status: Joi.string().required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).send({
        stasus: 'error',
        message: error.details[0].message,
      });
    }

    await user.create(data);

    res.send({
      status: 'success',
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.login = async (req, res) => {
  // code here
  try {
    const data = req.body;

    const schema = Joi.object({
      email: Joi.string().min(6).email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).send({
        stasus: 'error',
        message: error.details[0].message,
      });
    }

    const userExist = await user.findOne({
      where: {
        email: data.email,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    if (!userExist) {
      return res.send({
        stasus: 'failed',
        message: 'Email and Password dont match',
      });
    }

    if (userExist.password != data.password) {
      return res.send({
        stasus: 'failed',
        message: 'Email and Password dont match',
      });
    }

    res.send({
      status: 'success',
      message: 'Login success',
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};
