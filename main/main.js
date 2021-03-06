// 打印赠送商品会出现一行空行
var collection = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
];
// console.log(collection);

var temp=grouping_count(collection);
var temp1=goodlist(temp);
console.log(
    "***<没钱赚商店>购物清单***\n"+
    print_goodlist(temp1)+'\n'+
    "----------------------\n"+
    "挥泪赠送商品：\n"+
    print_promotionslist(temp1)+'\n'+
    "----------------------\n" +
    calculate(temp1)+'\n'+
    "**********************");
// return 0;
//};
// 获取全部商品信息
function loadAllItems() {
    return [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
        },
        {
            barcode: 'ITEM000004',
            name: '电池',
            unit: '个',
            price: 2.00
        },
        {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
        }
    ];
}

// 获取促销商品信息
function loadPromotions() {
    return [
        {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
                'ITEM000000',
                'ITEM000001',
                'ITEM000005'
            ]
        }
    ];
}

// 统计表商品的条形码及数量
function grouping_count(collection) {
    //在这里写入代码
    var result= [];
    for(var i = 0;i<collection.length;){
        var count = 0;
        var len = collection[i].length;
        var t=len-1;
        if(len>10){
            var temp=collection[i].substring(0,10);
            count=parseInt(collection[i].slice(11,12));
            result.push({key:temp,count:count})
            i+=count;
            i=i-(count-1);
        }else{
            for(var j=i;j<collection.length;j++){
                if(collection[i]==collection[j]){
                    count++;
                }
            }
            result.push({key:collection[i],count:count});
            i+=count;
        }
    }
    return result;
}

// 购物清单商品条形码详细信息
function goodlist(collection) {
    var temp=[];
    collection.forEach(function(item,index,array){
        for(var i =0;i<loadAllItems().length;i++) {
            if (item.key=== loadAllItems()[i].barcode) {
                temp.push({
                    barcode:loadAllItems()[i].barcode,
                    name: loadAllItems()[i].name,
                    count: item.count ,
                    unit:loadAllItems()[i].unit,
                    price: loadAllItems()[i].price
                });
            }
        }
    });
    var result = [];
    var isPromotions;
    for (var t = 0; t < temp.length;) {
        var subtotal = 0;
        var original = 0;
        for (var j = 0; j < loadPromotions()[0].barcodes.length; j++) {

            isPromotions = false;
            if (temp[t].barcode === loadPromotions()[0].barcodes[j]) {
                isPromotions = true;
                original = temp[t].count * temp[t].price;
                //console.log(result[t].count);
                if (temp[t].count > 2) {
                    var a = parseInt(temp[t].count / 3) * 2 + (temp[t].count % 3);
                    // console.log(a);
                    subtotal = a * temp[t].price;
                } else {
                    subtotal = temp[t].count * temp[t].price;
                }
                result.push({
                    barcode:temp[t].barcode,
                    name: temp[t].name,
                    quantity: temp[t].count,
                    freenum: temp[t].count-a,
                    price: temp[t].price,
                    unit:temp[t].unit,
                    sum: subtotal,
                    orignal_price: original
                });
                t++;
            }
        }
        if (!isPromotions) {
            subtotal = temp[t].count * temp[t].price;
            original = subtotal;
            result.push({
                barcode:temp[t].barcode,
                name: temp[t].name,
                quantity: temp[t].count,
                freenum: 0,
                unit:temp[t].unit,
                price: temp[t].price,
                sum: subtotal,
                orignal_price: original
            });
        }
        t++;
    }
    //console.log(result);
    return (result);
}

// 打印商品清单
function print_goodlist(collection){
    var print_goodlist = collection.map(function (item, index, array) {
        var goodlist = "名称：" + item.name + ",数量：" + item.quantity + item.unit + ",单价:"
            + item.price.toFixed(2) + "(元)" + ",小计："+ item.sum.toFixed(2) + "(元)";
        //console.log(goodlist + '\n');
        return goodlist;
    });
    return print_goodlist.join('\n');
}

// 打印折扣商品清单
function print_promotionslist(collection){
    var print_result=collection.map(function(item,index,array){
        if(item.freenum>0){
           // var promotions = "名称："+ item.name +",数量："+ item.freenum + item.unit +'\n';  //这样打印会出现2个逗号
            var promotions = "名称："+ item.name +",数量："+ item.freenum + item.unit ;
            return promotions;
        }
    });
    return print_result.join('\n');
   // return print_result;
}

// 计算商品总金额和折扣
function calculate(collection){
    var result=[];
    var price_diff=0;
    var total=0;
    var old_total=0;
    collection.forEach(function(item,index,array){
        total+=item.sum;
        old_total+=item.orignal_price;
    });

    total=(total).toFixed(2);
    price_diff=(old_total-total).toFixed(2);
    result.push({
        total: total ,
        price_diff: price_diff
    });
    // console.log(result);
    var print_result=result.map(function(item,index,array){
        var money = "总计："+ item.total +"(元)\n"
            +"节省："+ item.price_diff +"(元)";
        return money;
    });
    return print_result.join('\n');
}
