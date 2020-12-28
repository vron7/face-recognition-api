

module.exports = (db, bcrypt) => (req, res) => {
    const {email, name, password} = req.body;
    if(!email || !name || !password) {
        return res.status(400).json('incorrect for submission');
    }
    const hash = bcrypt.hashSync(password);
    // we need transaction here to make sure both inserts to login and users execute
    // if one fails, we will just not insert into other
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(arrEmail => {
            return trx('users')
                .returning('*') // let's return all columns in the then function below
                .insert({
                    email: arrEmail[0],
                    name:name,
                    joined: new Date
                }).then(user => {
                    res.json(user[0]); // since array is returned with single object, let's just return the object
                })
        })
        .then(trx.commit) // let's commit the transaction
        .catch(trx.rollback)        
    })
    .catch(err => res.status(400).json('unable to register'))   
}

