import AbstractService from "../AbstractService.js";
import { bcryptSalt } from "../../../config/env.js";
import userModel from "../../models/user/userModel.js";
import roleModel from "../../models/role/roleModel.js";
import Bcrypt from "bcryptjs";
import { generateJWT } from "../../../utils/util.js";
import { PAGINATION } from "../../../config/constants.js";

class UserService extends AbstractService {
  constructor() {
    super();
    this.userModel = userModel;
    this.roleModel = roleModel;
    this.generateAccessToken = generateJWT;
  }

  /**
   *
   */
  async registerUser(userInfo) {
    const { email, password, phone_no, username, role, gender } = userInfo;
    let hashedPassword;
    let userRole;

    const matchQuery = {
      $or: [{ email }, { phone_no }, { username }],
    };

    switch (role) {
      case "admin":
        userRole = await this.roleModel.findOne({ name: "admin" });
        break;
      case "user":
        userRole = await this.roleModel.findOne({ name: "user" });
        break;
      default:
        userRole = await this.roleModel.findOne({ name: "user" });
        break;
    }

    const userExists = await this.userModel.findOne(matchQuery);

    if (userExists) {
      const error = new Error(
        "User with Email/Phone No/Username already exists"
      );
      error.httpStatusCode = 400;
      throw error;
    }

    if (password) {
      hashedPassword = Bcrypt.hashSync(password, bcryptSalt);
    }

    const userData = {
      ...userInfo,
      gender: gender.toLowerCase(),
      password: hashedPassword,
      role: userRole._id,
    };

    const user = await AbstractService.create(this.userModel, userData);

    return { ...user, role: userRole.name };
  }

  /**
   *
   */
  async loginUser(userInfo) {
    const { email, password, username } = userInfo;

    if (!email && !username) {
      const error = new Error("Email or username is required");
      error.httpStatusCode = 400;
      throw error;
    }
    const matchQuery = email ? { email } : { username };
    let user = await this.userModel.findOne(matchQuery);

    if (!user) {
      const error = new Error("Could not find a user matching those details");
      error.httpStatusCode = 400;
      throw error;
    }

    const passwordMatch = await Bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      const error = new Error("Invalid login details");
      error.httpStatusCode = 400;
      throw error;
    }

    const userRecord = user.toObject();
    const accessToken = this.generateAccessToken(userRecord);

    return { ...user._doc, accessToken };
  }

  /**
   *
   */
  async updateProfile(userInfo) {
    const {
      id,
      password,
      name,
      username,
      gender,
      email_verified,
      profile_image,
      role,
    } = userInfo;
    if (
      name === "" ||
      username === "" ||
      password === "" ||
      gender === "" ||
      email_verified === "" ||
      profile_image === "" ||
      role === ""
    ) {
      const error = new Error("Empty fields are not allowed");
      error.httpStatusCode = 400;
      throw error;
    }

    let hashedPassword;

    const matchQuery = {
      $or: [{ name }, { username }],
    };

    const invalidEntry = await this.userModel.findOne(matchQuery);
    if (invalidEntry) {
      const error = new Error("Name or username already exists");
      error.httpStatusCode = 409;
      throw error;
    }

    if (password) {
      hashedPassword = Bcrypt.hashSync(password, bcryptSalt);
    }
    const userData = {
      ...userInfo,
      password: hashedPassword,
    };
    const user = await AbstractService.updateDocumentById(
      this.userModel,
      id,
      userData
    );

    return user;
  }

  /**
   *
   */
  async getProfile(userData) {
    const { id } = userData;
    const user = await AbstractService.getDocumentById(this.userModel, id);
    return user;
  }

  /**
   *
   */
  async getAllProfile(filter = {}) {
    const { page } = filter;

    const usersProfile = await this.userModel.aggregate([
      {
        $facet: {
          metadata: [
            {
              $count: "total",
            },
            {
              $addFields: {
                current_page: page,
                has_next_page: {
                  $cond: {
                    if: {
                      $lt: [{ $multiply: [page, PAGINATION] }, "$total"],
                    },
                    then: true,
                    else: false,
                  },
                },
                has_previous_page: {
                  $cond: {
                    if: {
                      $gt: [page, 1],
                    },
                    then: true,
                    else: false,
                  },
                },
                next_page: {
                  $add: [page, 1],
                },
                previous_page: {
                  $cond: {
                    if: {
                      $gt: [page, 1],
                    },
                    then: {
                      $subtract: [page, 1],
                    },
                    else: 1,
                  },
                },
                last_page: {
                  $ceil: {
                    $divide: ["$total", PAGINATION],
                  },
                },
              },
            },
          ],
          products: [
            {
              $skip: (page - 1) * PAGINATION,
            },
            {
              $limit: PAGINATION,
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                password: 1,
                username: 1,
                gender: 1,
                phone_no: 1,
                email_verified: 1,
                profile_image: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
    ]);

    const returnData = {};

    if (usersProfile[0].metadata[0]) {
      returnData.usersProfile = usersProfile[0].products;
      const [metadata] = usersProfile[0].metadata;
      returnData.metadata = metadata;
    } else {
      returnData.usersProfile = usersProfile[0].products;
      returnData.metadata = {
        total: 0,
        current_page: 1,
        has_next_page: false,
        has_previous_page: false,
        next_page: 2,
        previous_page: 1,
        last_page: 1,
      };
    }
    return returnData;
  }

  /**
   *
   */
  async deleteProfile(id) {
    await AbstractService.deleteDocumentById(this.userModel, id);
  }

  /**
   *
   */
  async uploadProfileImage(data) {
    const {
      id,
      image_file: { secure_url },
    } = data;

    const updateData = {
      profile_image: secure_url,
    };

    const user = await AbstractService.updateDocumentById(
      this.userModel,
      id,
      updateData
    );
    return user._doc;
  }
}

export default new UserService();
