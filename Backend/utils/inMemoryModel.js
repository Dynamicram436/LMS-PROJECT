import mongoose from 'mongoose';

// In-memory storage for development when MongoDB is not available
class InMemoryModel {
  constructor(schemaData) {
    this.data = [];
    this.schema = schemaData;
  }

  async findOne(query) {
    return this.data.find(item => this.matchesQuery(item, query)) || null;
  }

  async find(query = {}) {
    return this.data.filter(item => this.matchesQuery(item, query));
  }

  async create(data) {
    const newItem = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.push(newItem);
    return newItem;
  }

  matchesQuery(item, query) {
    if (Object.keys(query).length === 0) return true;
    
    for (const [key, value] of Object.entries(query)) {
      if (key === '$or') {
        const orMatch = value.some(orQuery => this.matchesQuery(item, orQuery));
        if (!orMatch) return false;
      } else if (item[key] !== value) {
        return false;
      }
    }
    return true;
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

// In-memory User instance class
class InMemoryUserInstance {
  constructor(data, userModel) {
    this._data = {
      _id: data._id || InMemoryModel.prototype.generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this._userModel = userModel;
  }

  async save() {
    const existingIndex = this._userModel.data.findIndex(item => item._id === this._data._id);
    if (existingIndex >= 0) {
      this._userModel.data[existingIndex] = { ...this._data, updatedAt: new Date() };
    } else {
      this._userModel.data.push(this._data);
    }
    return this;
  }

  get _id() { return this._data._id; }
  get name() { return this._data.name; }
  get userid() { return this._data.userid; }
  get email() { return this._data.email; }
  get rollno() { return this._data.rollno; }
  get courseName() { return this._data.courseName; }
  get role() { return this._data.role; }
}

// Create in-memory User model
const createInMemoryUserModel = () => {
  const userModel = new InMemoryModel({
    userid: String,
    password: String,
    name: String,
    email: String,
    rollno: String,
    courseName: String,
    role: String
  });

  // Add static methods
  userModel.findOne = async (query) => {
    return InMemoryModel.prototype.findOne.call(userModel, query);
  };

  userModel.create = async (data) => {
    return InMemoryModel.prototype.create.call(userModel, data);
  };

  // Constructor function for new instances
  const UserConstructor = function(data) {
    return new InMemoryUserInstance(data, userModel);
  };

  // Copy static methods to constructor
  UserConstructor.findOne = userModel.findOne;
  UserConstructor.create = userModel.create;

  return UserConstructor;
};

export { InMemoryModel, createInMemoryUserModel };
