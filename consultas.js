const { query } = require("express");
const mysql =require("mysql");

function altaUser(conection,data,callback){
    let insert="INSERT INTO `user`( `user`, `passw`) VALUES (?,?)";
    let query=mysql.format(insert,[data.user,data.contra]);
    conection.query(query,function(err,result){
        if(err)throw err;
        callback(result);
    });
}

function buscarUser(connection, data, callback) {
    let select = "SELECT `id`, `user`, `passw` FROM `user` WHERE `user`= ?";
    let query = mysql.format(select, [data.user]);
    connection.query(query, function (err, result) {
        if (err) {
            console.error("Error en la consulta MySQL:", err); // Log para MySQL
            throw err; // Rethrow non-MySQL errors
        }
        callback(result);
    });
}

function nuevaSol(conection,data,callback){
    let insert ="INSERT INTO `tareas`( `estado`, `mensaje`, `cifrado`, `llave`,`algoritmo`,`credito`) VALUES(0,?,'na',?,?,0)";
    let query = mysql.format(insert,[data.mensaje,data.llave,data.algoritmo]);
    conection.query(query,function(err,result){
        if(err){
            console.log("Error en la consulta",err);
            throw err;
        }
        callback(result);
    })
}

function buscarTarea(conection,callback){
    let select="SELECT `id`, `estado`, `mensaje`, `cifrado`, `llave`, `algoritmo`, `credito`, `user` FROM `tareas` WHERE `estado`=0  LIMIT 1";
    let query=mysql.format(select,[]);
    
    conection.query(query,function(err,result){
        if(err){
            console.log("Error en la consulta");
            throw err;
        }
        callback(result)
    })
}

function cambioEstado(conection,data,callback){
    let update="UPDATE `tareas` SET `estado` = '1' WHERE `tareas`.`id` = ?; ";
    let query=mysql.format(update,[data.id]);
    conection.query(query,function(err,result){
        if(err){
            console.log("No se actualizo");
            throw err;
        }
        callback(result);
    })
}

function tareaCompleta(conection,data,callback){
    let update="UPDATE `tareas` SET `cifrado`=?,`credito`=?,`user`=? WHERE`id`=?";
    let query=mysql.format(update,[data.cifrado,data.credito,data.user]);
    conection.query(query,function(err,result){
        if(err){
            console.log("Error al guardar datos");
            throw err;
        }
        callback(result);
    })
}

function userCreditos(conection,data,callback){
    let select="SELECT SUM(credito) AS Suma_total FROM `tareas` WHERE `user`=?;"
    let query=mysql.format(select,[data.user]);
    conection.query(query,function(err,result){
        if(err){
            console.log("Ha fallado el servidor");
            throw err
        }
        callback(result);
    })
}

function bestScore(conection,callback){
    let select="SELECT user, SUM(credito) AS Credito_total FROM tareas GROUP BY user ORDER BY Credito_total DESC LIMIT 3;"
    let query=mysql.format(select)
    conection.query(query,function(err,result){
        if(err){
            console.log("Ha ocurrido un error en el sevidor");
            throw err;
        }
        callback(result);
    })
}
module.exports={altaUser,buscarUser,nuevaSol,buscarTarea,cambioEstado};//Se tienen que exportar cada una de las funciones