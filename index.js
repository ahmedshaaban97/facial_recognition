//const path = require('path')
//const {spawn} = require('child_process')
// /**
//  * Run python myscript, pass in `-u` to not buffer console output
//  * @return {ChildProcess}
//  */
function runScript(){
    return spawn('python', [
        "-u",
        path.join(__dirname, 'input.py'),
        "--foo", '555555',
    ]);
}
// const subprocess = runScript()
// // print output of script
// subprocess.stdout.on('data', (data) => {
//     console.log(`data:${data}`);
// });
// subprocess.stderr.on('data', (data) => {
//     console.log(`error:${data}`);
// });
// subprocess.stderr.on('close', () => {
//     console.log("Closed");
// });

/////////////////////////////////

const express = require('express');
const app = express();
//we add the path module which is built in node.js
const path = require('path');
//require our database odm
const mongoose = require('mongoose');
//require body parser to parse date from front-end
const bodyParser = require('body-parser');

//const testSet = require('./test');

const {spawn} = require('child_process');
const Alist = require('./models/alist');
const macs = require('./models/macs');

//connecting to database
mongoose.connect('mongodb://localhost/task4',{ useNewUrlParser: true }).then((db)=>{
    console.log('database connected');
}).catch(error=> console.log(error));


//we add the middle ware for the public folder and join it to the path to call our styles from it
app.use(express.static(path.join(__dirname,'public')));



//always put it before the routes or it will not work
app.use(bodyParser.urlencoded({extended: true}));
//to be able to parse json files
app.use(bodyParser.json());





app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//middle ware to active pass



app.get('/', (req,res)=>{
     const subprocess = runScript()
// print output of script
     subprocess.stdout.on('data', (data) => {
        // names = String(data).split(",");
        // names = String(names).split("[");
        // names = String(names).split("]");
        // names = String(names).split(",");


        let a = String(data).replace(/'/g, '"');
        let names= JSON.parse(a);
        console.log((`names are ${names}`))
        if(names.length == 0){
             res.send('please try again')
        }else {
            for(let i = 0; i< names.length;i++){
                Alist.findOne({firstName: names[i]}).then(user=>{
                    if(!user){
                        const newAlist = new Alist({

                            firstName : String(names[i])

                        });
                        newAlist.save().then(()=>{
                            console.log(`name is ${String(names[i])}`)

                        });

                    }else{
                        res.send('user is not on the dataset or already registered')
                    }
                })
            }

            // for(let i = 0;i< names.length;i++){
            //     const newAlist = new Alist({
            //
            //         firstName : String(names[i])
            //
            //     });
            //      newAlist.save().then(()=>{
            //          console.log(`name is ${String(names[i])}`)
            //
            //      });
            //
            // }
            //res.send(`${String(names)} was registered `)
            //console.log( names.length);

        }

    });
    subprocess.stderr.on('data', (data) => {
        console.log(`error:${data}`);
    });
    // subprocess.stderr.on('close', () => {
    //     console.log("Closed");
    // });
})



app.post('/mac',(req,res)=>{
   let mac = req.body.mac;
    console.log(parseInt(mac))

    // macs.findOne({mac : (parseInt(mac))}).then(user=>{
    //     Alist.findOne({firstName: user.firstName}).then(newUser=>{
    //         if (!newUser){
    //             console.log('user is not facially recognized')
    //         } else {
    //             newUser.approved = 1
    //             newUser.save().then(savedUser=>{
    //                 console.log('user registered')
    //             })
    //         }
    //     })
    // })


    console.log(mac)
    //res.redirect(`/checkApproved/${mac}`)
});

app.get('/checkApproved/:id',(req,res)=>{
    console.log('this is check')
    console.log(req.params.id)
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)

});