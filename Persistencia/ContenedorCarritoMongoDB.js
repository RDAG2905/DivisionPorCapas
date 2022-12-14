const mongoose = require('mongoose');
const model = require('../models/CarritoMongoDb');    
const carrito = require('../Business/Carrito')
const config = require('config');
const logger = require('../logger');
const mongoConnectionString = config.get('mongoDB.connection')  
const util = require('util')

class ContenedorCarritoMongo{
       
    constructor(){
       
        const URL = mongoConnectionString
        let rta = mongoose.connect(URL, {});   
       
    }
   
  

    async getCart(idCart){
      return await model.findById(idCart)
    }


   
    
    async save(idUsuario){
        let unCarrito = new carrito(undefined)
        const modelCarrito = model(unCarrito);
        let changuito = await modelCarrito.save();
        return changuito._id
        
    }




    async delete(id){
        await model.findByIdAndRemove(id)      
    }





    async addProductToCart(idCarro,producto){      
        let carrito = await this.getCart(idCarro)
        carrito.productos.push(producto)
      
       // let carritoEditado = await this.editCart(carrito,carrito._id)
         
        await this.editCart(carrito,carrito._id)
        return await this.getCart(idCarro)
        //logger.info(`carrito editado agregar: ${util.inspect(carritoEditado)}`)
        //return carritoEditado;
       
    } 




    async removeProductFromCart(idCarrito,idProducto){
        let carrito = await this.getCart(idCarrito)
        carrito.productos = carrito.productos.filter(prod =>prod._id != idProducto)
        this.editCart(carrito,carrito._id)
    }




     async editCart(carrito,idBuscado){
       return await model.findByIdAndUpdate(idBuscado,carrito) 
           
    }
}

module.exports = ContenedorCarritoMongo
