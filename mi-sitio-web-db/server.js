const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const PORT = process.env.PORT || 3000;


/*
=========================
CONSULTAR TODOS
GET /usuarios
=========================
*/

app.get('/usuarios', async (req,res)=>{

    try{

        const result =
        await pool.query(
            'SELECT * FROM usuarios ORDER BY id'
        );

        res.json(result.rows);

    }catch(err){

        console.error(err);
        res.status(500).send("Error");

    }

});


/*
=========================
CONSULTAR UNO
GET /usuarios/1
=========================
*/

app.get('/usuarios/:id', async(req,res)=>{

    try{

        const result =
        await pool.query(
            'SELECT * FROM usuarios WHERE id=$1',
            [req.params.id]
        );

        res.json(result.rows);

    }catch(err){

        console.error(err);
        res.status(500).send("Error");

    }

});


/*
=========================
AGREGAR
POST /usuarios
=========================
*/

app.post('/usuarios', async(req,res)=>{

    const {nombre,correo}=req.body;

    try{

        await pool.query(

            `INSERT INTO usuarios
            (nombre,correo)

            VALUES($1,$2)`,

            [nombre,correo]

        );

        res.send(
            "Usuario agregado"
        );

    }catch(err){

        console.error(err);
        res.status(500).send("Error");

    }

});


/*
=========================
EDITAR
PUT /usuarios/1
=========================
*/

app.put('/usuarios/:id', async(req,res)=>{

    const {nombre,correo}=req.body;

    try{

        await pool.query(

            `UPDATE usuarios

            SET nombre=$1,
                correo=$2

            WHERE id=$3`,

            [
                nombre,
                correo,
                req.params.id
            ]

        );

        res.send(
            "Usuario actualizado"
        );

    }catch(err){

        console.error(err);
        res.status(500).send("Error");

    }

});


/*
=========================
ELIMINAR
DELETE /usuarios/1
=========================
*/

app.delete('/usuarios/:id',
async(req,res)=>{

try{

await pool.query(

'DELETE FROM usuarios WHERE id=$1',

[req.params.id]

);

res.send(
"Usuario eliminado"
);

}catch(err){

console.error(err);

res.status(500)
.send("Error");

}

});


app.listen(PORT,()=>{

console.log(
`Servidor corriendo ${PORT}`
);

});