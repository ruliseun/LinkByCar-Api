export default class AbstractService {
  static async create(model, data) {
    const doc = new model(data);
    const result = await doc.save();

    const resultObj = result.toObject();
    delete resultObj.__v;
    return resultObj;
  }

  static async getDocumentById(model, id) {
    const result = await model.findById(id);

    if (!result) {
      const error = new Error("Record does not exist");
      error.httpStatusCode = 404;
      throw error;
    }

    return result;
  }

  static async updateDocumentById(model, id, updates) {
    const documentExists = await model.findById(id);

    if (!documentExists) {
      const error = new Error("Record does not exist");
      error.httpStatusCode = 404;
      throw error;
    }

    try {
      const updatedDoc = await model.findOneAndUpdate({ _id: id }, updates, {
        new: true,
        runValidators: true,
      });
      return updatedDoc;
    } catch (err) {
      const error = new Error(
        "An error occured while updating document",
        err.message
      );
      console.log("ERR", err);
      error.httpStatusCode = 500;
      throw error;
    }
  }

  static async deleteDocumentById(model, id) {
    const documentExists = await model.findById(id);

    if (!documentExists) {
      const error = new Error("Record does not exist");
      error.httpStatusCode = 404;
      throw error;
    }

    try {
      await model.findByIdAndDelete(id);
    } catch (err) {
      const error = new Error("An error occured while deleting document");
      error.httpStatusCode = 500;
      throw error;
    }
  }
}
