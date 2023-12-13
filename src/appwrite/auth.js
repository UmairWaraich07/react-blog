import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";
class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createUser({ email, password, name }) {
    try {
      const createdUser = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (createdUser) {
        // direct logged IN that user
        return this.loginUser({ email, password });
      } else {
        return createdUser;
      }
    } catch (error) {
      console.log(`Error while creating user :: Appwrite : ${error}`);
      throw error;
    }
  }

  async loginUser({ email, password }) {
    try {
      return this.account.createEmailSession(email, password);
    } catch (error) {
      console.log(`Error while logging user :: Appwrite : ${error}`);
      throw error;
    }
  }

  async logoutUser() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      console.log(`Error while logout user :: Appwrite : ${error}`);
      throw error;
    }
  }

  async getLoggedInUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log(`Error while getting loggedin user :: Appwrite : ${error}`);
      // throw error;
    }
    return null;
  }
}

const authService = new AuthService();

export default authService;
