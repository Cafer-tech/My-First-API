require('dotenv').config();
const mongoose=require('mongoose');

// 1.Bring in the Express tool we just installed.
const express=require('express');

//2.Create our application.
const app=express();

//This tells Express to read JSON data sent by the client
app.use(express.json());

//Create the schema(The Blueprint)
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    age:Number
});

//Create the model(The Tool)
const User= mongoose.model('User', userSchema);

//3.Tell the application what to do when someone visits the main page('/') YOUR FİRST ROUTE(MAİN PAGE)
app.get('/',function(request,response){
    response.send('I succesfully change my backend code.');
});

//YOUR NEW ROUTE(ABOUT PAGE)
app.get('/about',function(request,response){
    response.send('Welcome to about page! I made a second route.');
});

//A route that returns JSON data
app.get('/api/user',function(request,response){
    response.json({
        name:"Alex",
        role:"developer",
        level:"senior"
    })
});
/*
// A dynamic route that reads the URL.
app.get('/api/user/:id',function(request,response){
    // We grab the Id that the user typed.
    const requestId=request.params.id;

    response.json({
        message:"You are looking for the user with this ID:",
        userId:requestId
    })
})
*/
// This is our fake databases(an array of objects)
const users=[
    {id:"1",name:"Alice",role:"Admin"},
    {id:"2",name:"Jack",role:"Teacher"},
    {id:"3",name:"Elizabeth",role:"Programmer"}
]

// A dynamic route that searchs out database
app.get('/api/user/:id',function(request,response){
    // Grab the id from the URL
    const requestId=request.params.id;

    // Search our fake database for a user with a matching ID
    const foundUser=users.find(function(user){
        return user.id===requestId;
    });

    // If we found them, send their data back
    if(foundUser){
        response.json(foundUser);
    }
    else{
        response.status(404).json({error:"Sorry that user doesnt exist"});
    }
});

//A POST route to create a new user
app.post('/api/user',function(request,response){
    //1.Grab the new data the user sent us(this is called the "body" of the request)
    const newUser=request.body;

    //2.Add the new user to our fake database list
    users.push(newUser);

    //3.Reply to the client to confirm it worked
    response.json({
        message:"User successfully added to the database!",
        user:newUser
    });
});

//A DELETE route to remove a user
app.delete('/api/user/:id',function(request,response){
    const requestId=request.params.id;

    //We find the exact position of the in our list
    const userPosition= users.findIndex(function(user){
        return user.id===requestId;
    });
    
    //If the users exists(position is not -1)
    if(userPosition !== -1){

        //We cut them out of the list
        users.splice(userPosition,1);
        response.json({message:"User deleted successfully."});
    }
    else{
        response.status(404).json({error:"User not found"});
    }
});

//A PUT route to update an existing (already there) user
app.put('/api/user/:id',function(request,response){
    //1.Get the ID from the web address
    const requestId=request.params.id;

    //2.Get the new data from the hidden body
    const newInformation=request.body;

    //3.Find the user in our database
    const foundUser=users.find(function(user){
        return user.id===requestId;
    });

    //4.If we found them ,update their information
    if(foundUser){

        //We change old name and role to the new ones
        foundUser.name=newInformation.name;
        foundUser.role=newInformation.role;

        //Send a success message back
        response.json({
            message:"User updated successfully",
            user:foundUser
        });
    }
    else{
        response.status(404).json({error:"User not found!"});
    }
})

//We connected Database
mongoose.connect(process.env.MONGO_URI)
.then(function(){
    console.log("Connected to local MongoDB successfully!");
})
.catch(function(error){
    console.log("Database connection failed:",error);
});

//Create the save route
app.post('/users', async function(req,res){
    try{
        //1.Grab the data the user sent us
        const userData=req.body;

        //2.Use our model to build new User
        const newUser= new User(userData);

        //3.Save it securely into MongoDB
        await newUser.save();

        //4.Send a success message back
        res.status(201).json({message:"User saved!",user: newUser});
    }catch(error){
        res.status(400).json({error:"Failed to save user!"});
    }

})

//4.Tell the application to listen on a specific port(like channel 3000 on a TV)
app.listen(3000, function(){
    console.log('The server is running on http://localhost:3000');
});
