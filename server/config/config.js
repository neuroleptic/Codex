const config = {
  production:{
    SECRET: process.env.SECRET,
    DATABASE: process.env.MONGODB_URI
  },
  default:{
    SECRET: 'qJB7VrOzZb1uqUY',
    DATABASE: 'mongodb://localhost:27017/codex'
  }
}

exports.get = function get(env){
  return config[env] || config.default;
} 
