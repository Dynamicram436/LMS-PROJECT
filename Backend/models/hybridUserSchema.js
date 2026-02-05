import mongoose from 'mongoose';

// In-memory storage fallback
let inMemoryUsers = [];

const userSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    rollno: {
      type: String,
      required: true,
      unique: true,
    },
    courseName: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Override save method to work with both MongoDB and in-memory
const originalSave = User.prototype.save;
User.prototype.save = async function() {
  try {
    // Try to save to MongoDB first
    if (mongoose.connection.readyState === 1) {
      return await originalSave.call(this);
    } else {
      // Fallback to in-memory storage
      const userData = this.toObject();
      userData._id = userData._id || Date.now().toString();
      inMemoryUsers.push(userData);
      return userData;
    }
  } catch (error) {
    console.log('MongoDB save failed, using in-memory fallback');
    const userData = this.toObject();
    userData._id = userData._id || Date.now().toString();
    inMemoryUsers.push(userData);
    return userData;
  }
};

// Override findOne method
const originalFindOne = User.findOne;
User.findOne = async function(filter) {
  try {
    if (mongoose.connection.readyState === 1) {
      return await originalFindOne.call(this, filter);
    } else {
      // In-memory fallback
      if (filter.userid) {
        return inMemoryUsers.find(user => user.userid === filter.userid);
      }
      if (filter.rollno) {
        return inMemoryUsers.find(user => user.rollno === filter.rollno);
      }
      if (filter.email) {
        return inMemoryUsers.find(user => user.email === filter.email);
      }
      return null;
    }
  } catch (error) {
    console.log('MongoDB findOne failed, using in-memory fallback');
    if (filter.userid) {
      return inMemoryUsers.find(user => user.userid === filter.userid);
    }
    if (filter.rollno) {
      return inMemoryUsers.find(user => user.rollno === filter.rollno);
    }
    if (filter.email) {
      return inMemoryUsers.find(user => user.email === filter.email);
    }
    return null;
  }
};

export default User;
