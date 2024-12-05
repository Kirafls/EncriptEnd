const express =require('express');
const bodyParser=require('body-parser');
const axios=require('axios');

const app=express();
app.use(bodyParser.json);

const nodosEncriptacion =[ //Nodos diponibles para solicitar trabajo
    {id:1,url:'http://localhost:8081/encripte',status:'disponible'},
    {id:2,url:'http://localhost:8082/encripte',status:'disponible'},
    {id:3,url:'http://localhost:8083/encripte',status:'disponible'}
];

//Se asigna trabajo a un nodo
const asignarNodo=()=>nodosEncriptacion.find(nodo=>nodo.status==='disponible');

app.post('/encripte',async(req,res)=>{
    const {texto,algoritmo,key}=req.body;
    if(!texto||!algoritmo||!key){//Validacion de parametros
        return res.status(400).send({error:'Faltan parametros para relizar el trabajo... '});
    }
    const nodo=asignarNodo();
    if(!nodo){
        return res.status(503).send({error:'El servidor no esta disponible para nuevas tareas... '})
    }
    nodo.status='ocupado';
    try{//Envio de la tarea
        const response=await axios.post(nodo.url,{texto,algoritmo,key});
        nodo.status="disponible";
        return res.send(response,datos);
    }catch(error){
        nodo.status='disponible';
        return res.status(500).send({error:'Error al procesar el nodo... '})
    }
});

//Arranque de servidor 
const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en puerto: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})
