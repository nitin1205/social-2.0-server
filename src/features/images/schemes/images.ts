import Joi, { ObjectSchema } from 'joi';

const addImageSchema: ObjectSchema = Joi.object().keys({
  Image: Joi.string().required()
});

export { addImageSchema };
