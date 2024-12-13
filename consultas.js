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


module.exports={altaUser,buscarUser,nuevaSol,buscarTarea};//Se tienen que exportar cada una de las funciones