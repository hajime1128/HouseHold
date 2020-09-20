class StockController{
    constructor(){
    //作成されたらしてほしいことを書いてく
        const btnRemoveItemId = 'btn-delete-item';
        const btnChangeItemId = 'btn-change-item';
        //Idの変数。後々楽になる

        let selector = document.querySelector.bind(document);

        
        this.inputmonth = selector('.inputMonth')
        this.inputday = selector('.inputDay');
        this.inputmoney = selector('.inputMoney');
        this.inputway = selector('.inputWay');
        this.inputstatus = selector('.inputStatus');
        this.inputId = selector('.inputId');
        //入力を受け取る
        
        this._ulSpendings = selector('#spending');
        this._ulIncomes =selector('#income')
        //表示部分を更新するために使う

        this._ulStockViews = selector('#stock')
        //削除、修正のクリックイベントの監視のために使う。

        this._spendinglist = new StockList();
        this._spendingview = new StockView(this._ulSpendings);
        //支出で使うインスタンス
        
        this._incomelist = new StockList();
        this._incomeview = new StockView(this._ulIncomes);
        //収入で使うインスタンス

        this._ulStockViews.addEventListener('click', function(event){
            event.preventDefault;
            let itemValue;
            let isDelete = false;
            //このままだと削除と修正どっちもされてしまう。その判別のための変数（もっといいやり方ありそう）
            if (isEquals(btnRemoveItemId, event.target.id)) {
                itemValue = event.target.value;
            } else if (isEquals(btnRemoveItemId, event.target.parentElement.id)) {
                itemValue = event.target.parentElement.value;
            }
            if (itemValue) {
                isDelete = true
                this.deleateStock(itemValue);
            }
            if (isEquals(btnChangeItemId, event.target.id)) {
                itemValue = event.target.value;
            } else if (isEquals(btnChangeItemId, event.target.parentElement.id)) {
                itemValue = event.target.parentElement.value;
            }
            if (itemValue) {
                if(isDelete==false){
                    this.changeStock(itemValue);
                }
            }
        }.bind(this));
        //削除と修正ボタンが押された時の処理。
        
        this.printSpendingList();
        this.printIncomeList();
        //表示の更新
    }

//ボタンに関する処理
    //追加ボタンが押されたら呼び出される
    btnOnClick(){
        let month = this.inputmonth.value;
        let day = this.inputday.value;
        let money = this.inputmoney.value;
        let way = this.inputway.value;
        let status = this.inputstatus.value;
        let id = this.inputId.value;

        //状態の入力を要求
        if(status==''){
            alert('状態の選択をしてください')
            return false
        }
        if (id!=""){
            alert('修正完了ボタンを押してください')
            return false
        }
        //日付が入力されていない場合の処理
        let date = new Date()
        if(month ==''){
            month = date.getMonth() +1;
        }
        if(day == ''){
            day = date.getDate();
            //なぜか少しずれる
        }
        day = `${month}月${day}日`

        //金額が入力ないなら、とりあえず0にする
        if(money==''){
            money = 0;
        }

        //インスタンス化していく
        let stock = new Stock(money,status,day,way)
        //idはデータベースが処理するので不要
            
        ConnectionFactory.getConnection()
            .then(connection => new HouseHoldDao(connection))
            .then(dao=>dao.storeHouseHold(stock))
            .catch(error=>{
                console.log(error);
                alert('error');
            })

        this.inputClear()
        if (stock.status==0){
            this.printSpendingList()
        }else{
            this.printIncomeList();
        }
    } 

    //削除ボタンが押されたら呼び出される
    deleateStock(itemId){
        //呼び出す時に、IDを渡すメソッドを実装→コンストラクター
        ConnectionFactory.getConnection()
            .then(connection => new HouseHoldDao(connection))
            .then(dao =>dao.deleteStock(itemId))
            .catch(error=>{
                console.log(error)
                alert('error');
            });
        this.printSpendingList();
        this.printIncomeList();
    }

    //修正のための情報を渡すメソッド
    changeStock(itemId){
        //IDをうけとる→コンストラクター
        ConnectionFactory.getConnection()
        .then(connection => new HouseHoldDao(connection))
        .then(dao =>dao.fetchItem(itemId))
        .then(stock =>this.inputStock(stock))
        .catch(error=>{
            console.log(error)
            alert('error');
        });
    }
    
    //修正を反映するメソッド（修正ボタンの処理）
    btnReNew(){
        
        if (this.inputId.value == ''){
            alert('修正したいものを選択してください')
            return false
        }
        //修正するためのIdを受け取る
        if(this.inputstatus.value==''){
            alert('状態の選択をしてください')
            return false
        }
        let stock = new Stock(this.inputmoney.value,this.inputstatus.value,'',this.inputway.value,this.inputId.value);
        
        //上で同じの作ってるから、それが使えたら書く量が減る？
        ConnectionFactory.getConnection()
        .then(connection => new HouseHoldDao(connection))
        .then(dao =>dao.updateItem(stock))
        .catch(error=>{
            console.log(error)
            alert('error');
        });
        this.inputClear()
        this.printSpendingList()
        this.printIncomeList();
    }

    //入力欄消去ボタン
    btnClear(){
        this.inputClear()
    }

//表示に関するメソッド
    //支出を表示
    printSpendingList(){
        ConnectionFactory.getConnection()
            .then(connection => new HouseHoldDao(connection))
            //DBから支出のデータを取得
            .then(dao => dao.fetchStatusSpending())
            .then(list=>{
                this._spendinglist.renewList(list);
            })
            .then(()=>{
                this._spendingview.update(this._spendinglist.list);
            })
            .catch(error =>{
                console.log(error)
                alert('error');
            })
    }


    //収入の表示。支出とまとめられる？
    printIncomeList(){
        ConnectionFactory.getConnection()
            .then(connection => new HouseHoldDao(connection))
            //DBから支出のデータを取得
            .then(dao => dao.fetchStatusIncome())
            .then(list=>{
                this._incomelist.renewList(list);
            })
            .then(()=>{
                this._incomeview.update(this._incomelist.list);
            })
            .catch(error =>{
                console.log(error)
                alert('error');
            })
    }


//入力欄に関する処理
    //インスタンスの値を入力欄にいれる処理。修正の時に使う    
    inputStock(stock){
        this.inputmonth.value = ''
        this.inputday.value = ''
        this.inputmoney.value = stock.money
        this.inputway.value = stock.way
        this.inputstatus.value = stock.status
        this.inputId.value = stock.id
    }

    //入力欄を空にする
    inputClear(){
        this.inputmonth.value = ''
        this.inputday.value = ''
        this.inputmoney.value = ''
        this.inputway.value = ''
        this.inputstatus.value = ''
        this.inputId.value = ''
    }
}