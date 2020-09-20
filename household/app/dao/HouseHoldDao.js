class HouseHoldDao{
    constructor(connection){
        this._connection = connection
    }

    fetchStatusSpending(){
        //statusが0（支出）をもってくる。
        return new Promise((resolve,reject)=>{
            this._fetchStatusStock(0,resolve,reject)
        });
    }

    
    fetchStatusIncome(){
        //statusが1(収入)を持ってくる
        return new Promise((resolve,reject)=>{
            this._fetchStatusStock(1,resolve,reject)
        });
    }  

    //データベースから指定したステータス(収入、支出)を取得するメソッド。上部で呼ぶ
    _fetchStatusStock(status,resolve,reject){
        this._connection.transaction(tx =>{
            tx.executeSql(
                'SELECT * FROM household WHERE status = $1;',
                [status],
                (tx,result)=>{
                    let stockList = [];
                    for (let i = 0; i < result.rows.length; i++) {
                        let date = result.rows.item(i)
                        //SELECTの結果を1行ずつ実行
                        stockList.push(
                            new Stock(date.money,date.status,date.day,date.way,date.id)
                            //リストに追加する時は、idが必要になる
                        );
                    }
                    resolve(stockList)
                },
                (tx,error)=>{
                    console.log(error);
                    reject(error);
                }
            );
        })
    }
    
   fetchItem(itemId){
        //指定したIDのアイテム一つを持ってくる（修正の時に使う）
        return new Promise((resolve,reject)=>{
            this._connection.transaction(tx =>{
                tx.executeSql(
                    'SELECT * FROM household WHERE id = $1;',
                    [itemId],
                    (tx,result)=>{
                        let data = result.rows.item(0)
                        let stock=new Stock(data.money,data.status,data.day,data.way,data.id)
                        resolve(stock)
                    },
                    (tx,error)=>{
                        console.log(error);
                        reject(error);
                    }
                );
            })
        });
    }

    updateItem(stock){
        //指定したIDのアイテムの要素書き換える（修正の時につかう）
        return new Promise((resolve,reject)=>{
            this._connection.transaction(tx =>{
                tx.executeSql(
                    'UPDATE household SET money = $1,way = $2,status = $3 WHERE id = $4;',
                    [stock.money,stock.way,stock.status,stock.id],
                    (tx,result)=>{},
                    (tx,error)=>{
                        console.log(error);
                        reject(error);
                    }
                );
            })
        })
    }

    






    //データベースに入力するメソッド
    storeHouseHold(stock){
        return new Promise((resolve,reject)=>{
            this._connection.transaction(tx=>{
                tx.executeSql(
                    'INSERT into household(money,day,way,status)\
                    VALUES ($1,$2,$3,$4)',
                    [stock.money,stock.day,stock.way,stock.status],
                    (tx,result)=>resolve,
                    (tx,error)=>{
                        console.log(error);
                        reject(error)
                    }
                )
            })
        })
    }

    //データベースから削除するメソッド
    deleteStock(itemId){
        return new Promise((resolve,reject)=>{
            this._connection.transaction(tx =>{
                tx.executeSql(
                    'DELETE FROM household WHERE id = $1;',
                    [itemId],
                    (tx,result)=>resolve(),  
                    (tx,error)=>{
                        console.log(error);
                        reject(error);
                    }
                );
            });
        });
    }

}