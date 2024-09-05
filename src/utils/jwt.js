import jwt from 'jsonwebtoken'


const JWT_SECRET = 'secretparolyoucantfind';

export default {
    SIGN(payload){
     return jwt.sign({id : payload}, JWT_SECRET)
    },
    VERIFY(token){
        try {
            if (jwt.verify(token, JWT_SECRET) instanceof Error)
              throw new Error("Expired token");
            else return jwt.verify(token, JWT_SECRET);
          } catch (err) {
            return err.message;
          }
    }
}
