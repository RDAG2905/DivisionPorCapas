const jwt = require("jsonwebtoken");
const logger = require("../logger");
const util = require('util')

const PRIVATE_KEY = "myprivatekey";

const generateAuthToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1800s' });
  return token;
}



const auth = (req, res, next) =>{
  const authHeader = req.headers["authorization"] || req.headers["Authorization"] || '';

  if (!authHeader) {
    return res.status(401).json({
      error: 'se requiere autenticacion para acceder a este recurso',
      detalle: 'no se encontró token de autenticación'
    })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      error: 'se requiere autenticacion para acceder a este recurso',
      detalle: 'formato de token invalido!'
    })
  }

  try {
    //const objetoOriginal = jwt.verify(token, PRIVATE_KEY);
    //req.user = objetoOriginal

    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          error: 'not authorized'
        });
      }
      logger.info(util.inspect(decoded.user))
      req.user = decoded.user;
      logger.info(util.inspect(req.user))
      //next();
    });
  
    

  } catch (ex) {
    return res.status(403).json({
      error: 'token invalido',
      detalle: 'nivel de acceso insuficiente para el recurso solicitado'
    })
  }

  next();
}




const adminAuth  = (req, res, next)=>{
    if(req.user && !req.user.isAdmin){
      return res.status(401).json({
        error: 'Acceso denegado'
      })
    }
    next();
}



module.exports = {
  generateAuthToken,
  auth,
  adminAuth
}