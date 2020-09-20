const ConnectionFactory = (function(){
    const dbSize = 1024 * 1024 *2;
        //2MB分（最大が5MB）
    const dbName ='household.db';
    
    const dbDisplayName = 'HouseholdsDB';
    
    const dbVersion ='1';
    let connection=null
    
        return class ConnectionFactory{
            constructor(){
                throw new Error('Can not create an instence of ConnectionFactory');
            }
            static getConnection(){
                return new Promise((resolve,reject) =>{
                    try {
                        connection = openDatabase(
                            dbName,
                            dbVersion,
                            dbDisplayName,
                            dbSize
                        );
                        ConnectionFactory._migrateDb()
                        //すぐ下のメソッド
                        .then(resolve(connection))
                        .catch(error =>{
                            console.log(error);
                            reject(error);
                        });
                    }catch (error) {
                        console.log(error);
                        reject(error);
                    }
                })
            }
    
            static _migrateDb(){
                return new Promise((resolve,reject)=>{
                    let sql ='CREATE TABLE IF NOT EXISTS household(\
                    id INTEGER PRIMARY KEY AUTOINCREMENT,\
                    day INTEGER,\
                    money INTEGER,\
                    way TEXT,\
                    status INTEGER DEFAULT 0)';
                    connection.transaction(tx=>{
                        tx.executeSql(
                            sql,
                            [],
                            (tx,result)=>resolve(),
                            (tx,error) =>reject(error)
                        )
                    })
                });
            }    
        }
})();
    