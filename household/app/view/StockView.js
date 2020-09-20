class StockView{
    constructor(element){
        this._element = element;
    }

    template(stock){
        return `<li class="ui-state-default">
        ${stock.day} 　　 ${stock.money}円   ${stock.way}
            <button id="btn-change-item" class="btn btn-default btn-xs pull-right" value="${stock.id}">
                <i class="far fa-trash-alt">修正</i>
            </button>
            
            <button id="btn-delete-item" class="btn btn-default btn-xs pull-right" value="${stock.id}">
                <i class="far fa-trash-alt">削除</i>
            </button>
        </li>`
    }//stockのidも一緒に渡す

    update(stockList){
        let text = ''
        stockList.forEach(stock => {
            text += this.template(stock)
        });
        this._element.innerHTML = text;
    }
}

