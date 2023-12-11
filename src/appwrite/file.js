import { Client, Storage } from "appwrite";
import conf from "../conf/conf";

class File {
  client = new Client();
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.storage = new Storage(this.client);
  }

  async uploadFile(file) {
    try {
      return this.storage.createFile(conf.appwriteBucketId, ID.unique(), file);
    } catch (error) {
      console.log(`Error while uploading file to APPWRITE storage : ${error}`);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.storage.deleteFile(conf.appwriteBucketId, fileId);
    } catch (error) {
      console.log(`Error while deleting file APPWRITE storage : ${error}`);
      return false;
    }
  }

  getFilePreview(fileId) {
    try {
      return this.storage.getFilePreview(conf.appwriteBucketId, fileId);
    } catch (error) {
      console.log(`Error while previewing file APPWRITE storage : ${error}`);
      return false;
    }
  }
}

const file = new File();

export default file;
