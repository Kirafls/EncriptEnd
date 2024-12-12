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

module.exports={altaUser,buscarUser};//Se tienen que exportar cada una de las funciones