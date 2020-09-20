class StockList{
    constructor(){
        this._list = []
    }
    get list(){
        return this._list
    }
    
    addstock(stock){
    //追加する
        this._list.push(stock)
        console.log(this._list)
    }

    renewList(newList){
    //全部削除してから代入
        this._list = [];
        this._list = newList
    } 
}