// Temporary in-memory storage for demo (replace with MongoDB later)
let users = [
  {
    id: '1',
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    role: 'admin',
    email: 'admin@example.com'
  },
  {
    id: '2',
    username: 'user',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    role: 'user',
    email: 'user@example.com'
  }
];

let responses = [];

// Mock User model
const User = {
  findOne: async (query) => {
    if (query.username) {
      return users.find(u => u.username === query.username);
    }
    return null;
  },
  
  findById: async (id) => {
    return users.find(u => u.id === id);
  },
  
  save: async function(userData) {
    const newUser = {
      id: (users.length + 1).toString(),
      ...userData
    };
    users.push(newUser);
    return newUser;
  }
};

// Mock constructor for new User
const createUser = (userData) => {
  const user = {
    ...userData,
    save: async function() {
      const newUser = {
        id: (users.length + 1).toString(),
        ...userData
      };
      users.push(newUser);
      return newUser;
    }
  };
  return user;
};

module.exports = { User, createUser, users, responses };
