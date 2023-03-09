export default class AbstractController {
  /**
   *
   */
  static successResponse(res, data, message = "Success", status_code = 200) {
    return res.status(status_code).json({
      status: "success",
      message,
      ...data,
    });
  }

  /**
   *
   */
  static errorResponse(res, message = "Error", error, status_code = 500) {
    console.log(`E - ${error?.message}`, JSON.stringify(error));
    return res.status(status_code).json({
      status: "failed",
      message: error?.message || message,
    });
  }
}
