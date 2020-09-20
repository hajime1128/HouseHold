class Stock{

    constructor(money=0,status,day,way = '',id = 0){
        this._money = money;
        this._status = status;
        this._day = day;
        this._way = way;
        this._id = id        
    }
    get money(){
        return  this._money;
    }
    get status(){
        return this._status;
    }
    get day(){
        return this._day;
    }
    get way(){
        return this._way;
    }
    get id(){
        return this._id
    }
    
}